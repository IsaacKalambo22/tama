import prisma from "../config"
import { sendEmail } from "../infisend/client"
import { getEventConfig } from "./event-map"

/**
 * Fire-and-forget notification trigger.
 * Looks up the event→template mapping, calls InfiSend, and persists
 * the initial EmailNotification row. Never blocks the caller — errors
 * are logged but not thrown.
 */
export async function notifyEvent(
  eventName: string,
  recipient: string,
  variables: Record<string, string> = {}
): Promise<void> {
  try {
    const config = getEventConfig(eventName)

    if (!config) {
      console.warn(
        `[notifications] No template mapping for event "${eventName}" — skipping.`
      )
      return
    }

    // Persist the row before calling InfiSend so we always have a record,
    // even if the API call fails. The messageId is filled in after accept.
    const notification = await prisma.emailNotification.create({
      data: {
        event: eventName,
        recipient,
        templateId: config.templateId,
        status: "QUEUED",
      },
    })

    try {
      const result = await sendEmail({
        to: recipient,
        templateId: config.templateId,
        variables,
        idempotencyKey: `notif_${notification.id}`,
      })

      // Update with InfiSend's messageId now that we have it
      await prisma.emailNotification.update({
        where: { id: notification.id },
        data: {
          messageId: result.messageId,
          status: result.status as "QUEUED",
        },
      })
    } catch (error) {
      // Mark as FAILED but keep the row — the admin can see what happened
      await prisma.emailNotification.update({
        where: { id: notification.id },
        data: {
          status: "FAILED",
          failureReason:
            error instanceof Error ? error.message : "Unknown error",
        },
      })
      console.error(
        `[notifications] InfiSend call failed for event "${eventName}" to ${recipient}:`,
        error instanceof Error ? error.message : error
      )
    }
  } catch (error) {
    // This catches Prisma errors (e.g. DB down) — log and move on
    console.error(
      `[notifications] Failed to persist notification for event "${eventName}":`,
      error instanceof Error ? error.message : error
    )
  }
}

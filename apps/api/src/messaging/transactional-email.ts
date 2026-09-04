import prisma from "../config"
import { sendEmail } from "../infisend/client"
import { getTransactionalEmailConfig } from "./transactional-email-map"

/**
 * Fire-and-forget transactional email trigger (welcome mail, etc.).
 * Looks up the event→template mapping, calls InfiSend, and persists the
 * EmailMessage row. Never blocks the caller — errors are logged, not thrown.
 *
 * This is NOT the Messaging Compose path and NOT the system-notification feed;
 * it is one-off mail tied to a user action.
 */
export async function notifyEvent(
  eventName: string,
  recipient: string,
  variables: Record<string, string> = {}
): Promise<void> {
  try {
    const config = getTransactionalEmailConfig(eventName)

    if (!config) {
      console.warn(
        `[transactional-email] No template mapping for event "${eventName}" — skipping.`
      )
      return
    }

    // Persist the row before calling InfiSend so we always have a record,
    // even if the API call fails. The messageId is filled in after accept.
    const record = await prisma.emailMessage.create({
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
        idempotencyKey: `txn_${record.id}`,
      })

      await prisma.emailMessage.update({
        where: { id: record.id },
        data: {
          messageId: result.messageId,
          status: result.status as "QUEUED",
        },
      })
    } catch (error) {
      await prisma.emailMessage.update({
        where: { id: record.id },
        data: {
          status: "FAILED",
          failureReason:
            error instanceof Error ? error.message : "Unknown error",
        },
      })
      console.error(
        `[transactional-email] InfiSend call failed for event "${eventName}" to ${recipient}:`,
        error instanceof Error ? error.message : error
      )
    }
  } catch (error) {
    console.error(
      `[transactional-email] Failed to persist record for event "${eventName}":`,
      error instanceof Error ? error.message : error
    )
  }
}

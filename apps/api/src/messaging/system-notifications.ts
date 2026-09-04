import prisma from "../config"
import { getSystemEventConfig, SystemEventInput } from "./event-catalogue"

/**
 * Fire-and-forget: records one SystemNotification row for an internal system
 * event. Broadcast in nature — no per-recipient rows, no InAppMessage, no
 * MessageBatch. "Unseen for me" is derived from
 * User.lastSeenSystemNotificationAt at read time.
 *
 * Never throws — a failed announcement must not break the action that
 * triggered it (creating a blog post, an event, etc.).
 */
export async function emitSystemNotification(
  eventName: string,
  input: SystemEventInput = {}
): Promise<void> {
  try {
    const config = getSystemEventConfig(eventName)
    if (!config) {
      console.warn(
        `[system-notifications] Unknown event "${eventName}" — no row created.`
      )
      return
    }

    await prisma.systemNotification.create({
      data: {
        event: eventName,
        title: config.title(input),
        body: config.body(input),
        link: config.link(input),
      },
    })
  } catch (error) {
    console.error(
      `[system-notifications] Failed to record event "${eventName}":`,
      error instanceof Error ? error.message : error
    )
  }
}

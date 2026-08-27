import { resolveAudience } from "../audience"
import prisma from "../config"

/**
 * Fires the IN_APP portion of a MessageBatch: resolves the audience right now
 * and creates one InAppMessage row per recipient, then flips the batch to SENT.
 *
 * Shared by the "send now" path (controllers/admin-messages) and the scheduled
 * sweep (messaging/scheduler.ts) so both go through identical fire-time
 * audience resolution — a scheduled send picks up membership changes made after
 * it was composed, right up until it fires.
 *
 * Email and SMS are NOT handled here — they are handed to InfiSend at compose
 * time (with scheduledFor passed through natively). This function only needs to
 * mark the batch SENT for those channels.
 */
export async function fireMessageBatch(batchId: string): Promise<void> {
  const batch = await prisma.messageBatch.findUnique({ where: { id: batchId } })

  if (!batch) return
  if (batch.status === "SENT" || batch.status === "CANCELLED") return

  const wantsInApp = batch.channels.includes("IN_APP")

  if (!wantsInApp) {
    await prisma.messageBatch.update({
      where: { id: batch.id },
      data: { status: "SENT" },
    })
    return
  }

  const recipients = await resolveAudience({
    targetType: batch.targetType,
    targetRef: batch.targetRef,
    individualIds: batch.individualIds,
  })

  await prisma.$transaction([
    prisma.inAppMessage.createMany({
      data: recipients.map((user) => ({
        batchId: batch.id,
        senderId: batch.senderId,
        recipientId: user.id,
        title: batch.inAppTitle ?? "",
        body: batch.inAppBody ?? "",
        link: batch.inAppLink,
      })),
    }),
    prisma.messageBatch.update({
      where: { id: batch.id },
      data: { status: "SENT" },
    }),
  ])
}

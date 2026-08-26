import { resolveAudience } from "../audience"
import prisma from "../config"

/**
 * Resolves the audience for a batch right now and creates the recipient
 * fan-out rows, then flips the batch to SENT. Shared by the "send now" path
 * (apps/api/src/controllers/admin-notifications) and the scheduled sweep
 * (apps/api/src/notifications/scheduler.ts) so both go through identical
 * fire-time audience resolution — a scheduled send picks up membership
 * changes made after it was composed, right up until it fires.
 */
export async function fireNotificationBatch(batchId: string): Promise<void> {
  const batch = await prisma.notificationBatch.findUnique({
    where: { id: batchId },
  })

  if (!batch) return
  if (batch.status === "SENT" || batch.status === "CANCELLED") return

  const recipients = await resolveAudience({
    targetType: batch.targetType,
    targetRef: batch.targetRef,
    individualIds: batch.individualIds,
  })

  await prisma.$transaction([
    prisma.inAppNotification.createMany({
      data: recipients.map((user) => ({
        batchId: batch.id,
        senderId: batch.senderId,
        recipientId: user.id,
        title: batch.title,
        body: batch.body,
        link: batch.link,
      })),
    }),
    prisma.notificationBatch.update({
      where: { id: batch.id },
      data: { status: "SENT" },
    }),
  ])
}

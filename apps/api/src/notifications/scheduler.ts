import prisma from "../config"
import { fireNotificationBatch } from "./fan-out"

const SWEEP_INTERVAL_MS = 60_000 // check for due batches once a minute

let isSweeping = false
let sweepTimer: ReturnType<typeof setInterval> | null = null

/**
 * No job queue (BullMQ, Agenda, etc.) exists in this codebase yet, and
 * scheduled sends are a low-volume admin action, so a simple in-process
 * interval sweep is the pragmatic v1 — the "simple polling worker" option.
 * If this needs to survive multiple API instances or higher volume later,
 * swap this file for a real queue; the DRAFT/SCHEDULED/SENT/CANCELLED
 * batch model doesn't need to change.
 */
export async function sweepScheduledNotificationBatches(): Promise<void> {
  if (isSweeping) return
  isSweeping = true

  try {
    const dueBatches = await prisma.notificationBatch.findMany({
      where: { status: "SCHEDULED", scheduledFor: { lte: new Date() } },
      select: { id: true },
    })

    for (const { id } of dueBatches) {
      try {
        await fireNotificationBatch(id)
      } catch (error) {
        console.error(
          `[notifications] Failed to fire scheduled batch ${id}:`,
          error instanceof Error ? error.message : error
        )
      }
    }
  } catch (error) {
    console.error(
      "[notifications] Scheduled batch sweep failed:",
      error instanceof Error ? error.message : error
    )
  } finally {
    isSweeping = false
  }
}

export function startNotificationScheduler(): void {
  if (sweepTimer) return
  sweepTimer = setInterval(() => {
    void sweepScheduledNotificationBatches()
  }, SWEEP_INTERVAL_MS)
}

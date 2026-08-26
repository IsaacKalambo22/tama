import crypto from "crypto"
import { Request, Response } from "express"
import prisma from "../../config"

const TOLERANCE_SECONDS = 300

/**
 * POST /webhooks/infisend
 *
 * Must be mounted BEFORE any global express.json() body parser.
 * This route uses express.raw() so the raw bytes are available for
 * HMAC-SHA-256 signature verification.
 */
export const handleInfiSendWebhook = async (
  req: Request,
  res: Response
): Promise<void> => {
  const rawBody = req.body.toString("utf8")

  // ── Signature verification ──────────────────────────────────────────────

  const header = req.get("x-infitech-signature") ?? ""
  if (!header) {
    res.status(400).json({ success: false, message: "Missing signature header" })
    return
  }

  // Parse t= and v1= from the header — tolerant of field ordering
  const parts: Record<string, string> = {}
  for (const part of header.split(",")) {
    const [key, ...rest] = part.trim().split("=")
    if (key && rest.length) parts[key] = rest.join("=")
  }

  const t = parts["t"]
  const v1 = parts["v1"]

  if (!t || !v1) {
    res.status(400).json({ success: false, message: "Malformed signature header" })
    return
  }

  // Check freshness — reject if timestamp is >5 min old
  const timestamp = Number(t)
  if (Number.isNaN(timestamp)) {
    res.status(400).json({ success: false, message: "Invalid signature timestamp" })
    return
  }

  const now = Math.floor(Date.now() / 1000)
  if (Math.abs(now - timestamp) > TOLERANCE_SECONDS) {
    res.status(400).json({ success: false, message: "Stale signature" })
    return
  }

  // Compute expected HMAC
  const secret = process.env.INFISEND_WEBHOOK_SECRET
  if (!secret) {
    console.error("[webhook] INFISEND_WEBHOOK_SECRET is not configured")
    res.status(500).json({ success: false, message: "Webhook secret not configured" })
    return
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${t}.${rawBody}`)
    .digest("hex")

  // Constant-time comparison
  const presented = Buffer.from(v1, "utf8")
  const computed = Buffer.from(expected, "utf8")

  if (
    presented.length !== computed.length ||
    !crypto.timingSafeEqual(presented, computed)
  ) {
    res.status(400).json({ success: false, message: "Invalid signature" })
    return
  }

  // ── Acknowledge first, process after ────────────────────────────────────

  res.sendStatus(200)

  // ── Process event asynchronously ─────────────────────────────────────────

  try {
    const event = JSON.parse(rawBody) as {
      event: string
      messageId: string
      status: string
      failureCode: string | null
      failureReason: string | null
      costCharged: string | null
      providerMessageId: string | null
    }

    if (!event.messageId || !event.status) {
      console.warn("[webhook] Received event with missing messageId or status — ignoring.")
      return
    }

    // Only process message.* lifecycle events
    if (!event.event?.startsWith("message.")) {
      console.warn(`[webhook] Unhandled event type "${event.event}" — ignoring.`)
      return
    }

    const validStatuses = [
      "QUEUED",
      "SENT",
      "DELIVERED",
      "FAILED",
      "REJECTED",
      "CANCELLED",
    ]

    if (!validStatuses.includes(event.status)) {
      console.warn(`[webhook] Unknown status "${event.status}" — ignoring.`)
      return
    }

    // Idempotent update: find by messageId and only advance if the new status
    // is a genuine progression. Ignore a status we've already recorded or moved past.
    const statusOrder: Record<string, number> = {
      QUEUED: 0,
      SENT: 1,
      DELIVERED: 2,
      FAILED: 3,
      REJECTED: 3,
      CANCELLED: 3,
    }

    const existing = await prisma.emailNotification.findUnique({
      where: { messageId: event.messageId },
    })

    if (!existing) {
      console.warn(
        `[webhook] No EmailNotification found for messageId "${event.messageId}" — ignoring.`
      )
      return
    }

    const currentPriority = statusOrder[existing.status] ?? -1
    const newPriority = statusOrder[event.status] ?? -1

    // Only update if the new status is a progression (higher priority)
    // or the same status (idempotent replay — just update mutable fields)
    if (newPriority >= currentPriority) {
      await prisma.emailNotification.update({
        where: { messageId: event.messageId },
        data: {
          status: event.status as
            | "QUEUED"
            | "SENT"
            | "DELIVERED"
            | "FAILED"
            | "REJECTED"
            | "CANCELLED",
          failureCode: event.failureCode,
          failureReason: event.failureReason,
          costCharged: event.costCharged,
          providerMessageId: event.providerMessageId,
        },
      })
    }
  } catch (error) {
    console.error("[webhook] Error processing event:", error)
  }
}

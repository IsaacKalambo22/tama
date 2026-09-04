import crypto from "crypto"
import { Request, Response } from "express"
import { ProviderMessageStatus } from "../../../prisma/generated/prisma"
import prisma from "../../config"

const TOLERANCE_SECONDS = 300

const VALID_STATUSES: ProviderMessageStatus[] = [
  "QUEUED",
  "SENT",
  "DELIVERED",
  "FAILED",
  "REJECTED",
  "CANCELLED",
]

// A message only ever moves forward through its lifecycle. Replays and
// out-of-order webhook deliveries that would move it backwards are ignored.
const STATUS_ORDER: Record<ProviderMessageStatus, number> = {
  QUEUED: 0,
  SENT: 1,
  DELIVERED: 2,
  FAILED: 3,
  REJECTED: 3,
  CANCELLED: 3,
}

interface ProviderEvent {
  event: string
  channel?: "EMAIL" | "SMS"
  messageId: string
  status: string
  failureCode: string | null
  failureReason: string | null
  costCharged: string | null
  providerMessageId: string | null
}

/**
 * Applies a provider lifecycle event to the matching email/SMS tracking row.
 * The `message.*` webhook is channel-agnostic — the event's `channel` field
 * routes it to the right table.
 */
async function applyProviderStatus(event: ProviderEvent): Promise<void> {
  const status = event.status as ProviderMessageStatus
  const newPriority = STATUS_ORDER[status] ?? -1

  const mutableData = {
    status,
    failureCode: event.failureCode,
    failureReason: event.failureReason,
    costCharged: event.costCharged,
    providerMessageId: event.providerMessageId,
  }

  // Prefer the explicit channel; fall back to "whichever table has the row"
  // for older payloads that predate the channel field.
  const channel = event.channel

  if (channel === "SMS") {
    const existing = await prisma.smsMessage.findUnique({
      where: { messageId: event.messageId },
    })
    if (!existing) {
      console.warn(
        `[webhook] No SmsMessage for messageId "${event.messageId}" — ignoring.`
      )
      return
    }
    if (newPriority >= (STATUS_ORDER[existing.status] ?? -1)) {
      await prisma.smsMessage.update({
        where: { messageId: event.messageId },
        data: mutableData,
      })
    }
    return
  }

  if (channel === "EMAIL") {
    const existing = await prisma.emailMessage.findUnique({
      where: { messageId: event.messageId },
    })
    if (!existing) {
      console.warn(
        `[webhook] No EmailMessage for messageId "${event.messageId}" — ignoring.`
      )
      return
    }
    if (newPriority >= (STATUS_ORDER[existing.status] ?? -1)) {
      await prisma.emailMessage.update({
        where: { messageId: event.messageId },
        data: mutableData,
      })
    }
    return
  }

  // No channel field — try both tables.
  const [email, sms] = await Promise.all([
    prisma.emailMessage.findUnique({ where: { messageId: event.messageId } }),
    prisma.smsMessage.findUnique({ where: { messageId: event.messageId } }),
  ])

  if (email && newPriority >= (STATUS_ORDER[email.status] ?? -1)) {
    await prisma.emailMessage.update({
      where: { messageId: event.messageId },
      data: mutableData,
    })
  } else if (sms && newPriority >= (STATUS_ORDER[sms.status] ?? -1)) {
    await prisma.smsMessage.update({
      where: { messageId: event.messageId },
      data: mutableData,
    })
  } else if (!email && !sms) {
    console.warn(
      `[webhook] No email/SMS row for messageId "${event.messageId}" — ignoring.`
    )
  }
}

/**
 * POST /webhooks/infisend
 *
 * Mounted BEFORE any global express.json() body parser and using express.raw()
 * so the raw bytes are available for HMAC-SHA-256 signature verification.
 * Handles both EMAIL and SMS delivery events from the single InfiSend webhook.
 */
export const handleInfiSendWebhook = async (
  req: Request,
  res: Response
): Promise<void> => {
  const rawBody = req.body.toString("utf8")

  const header = req.get("x-infitech-signature") ?? ""
  if (!header) {
    res
      .status(400)
      .json({ success: false, message: "Missing signature header" })
    return
  }

  const parts: Record<string, string> = {}
  for (const part of header.split(",")) {
    const [key, ...rest] = part.trim().split("=")
    if (key && rest.length) parts[key] = rest.join("=")
  }

  const t = parts["t"]
  const v1 = parts["v1"]
  if (!t || !v1) {
    res
      .status(400)
      .json({ success: false, message: "Malformed signature header" })
    return
  }

  const timestamp = Number(t)
  if (Number.isNaN(timestamp)) {
    res
      .status(400)
      .json({ success: false, message: "Invalid signature timestamp" })
    return
  }

  const now = Math.floor(Date.now() / 1000)
  if (Math.abs(now - timestamp) > TOLERANCE_SECONDS) {
    res.status(400).json({ success: false, message: "Stale signature" })
    return
  }

  const secret = process.env.INFISEND_WEBHOOK_SECRET
  if (!secret) {
    console.error("[webhook] INFISEND_WEBHOOK_SECRET is not configured")
    res
      .status(500)
      .json({ success: false, message: "Webhook secret not configured" })
    return
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${t}.${rawBody}`)
    .digest("hex")

  const presented = Buffer.from(v1, "utf8")
  const computed = Buffer.from(expected, "utf8")
  if (
    presented.length !== computed.length ||
    !crypto.timingSafeEqual(presented, computed)
  ) {
    res.status(400).json({ success: false, message: "Invalid signature" })
    return
  }

  // Acknowledge first, process after.
  res.sendStatus(200)

  try {
    const event = JSON.parse(rawBody) as ProviderEvent

    if (!event.messageId || !event.status) {
      console.warn("[webhook] Event missing messageId or status — ignoring.")
      return
    }
    if (!event.event?.startsWith("message.")) {
      console.warn(
        `[webhook] Unhandled event type "${event.event}" — ignoring.`
      )
      return
    }
    if (!VALID_STATUSES.includes(event.status as ProviderMessageStatus)) {
      console.warn(`[webhook] Unknown status "${event.status}" — ignoring.`)
      return
    }

    await applyProviderStatus(event)
  } catch (error) {
    console.error("[webhook] Error processing event:", error)
  }
}

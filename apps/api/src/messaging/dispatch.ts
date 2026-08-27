import { MessageBatch, MessageChannel } from "../../prisma/generated/prisma"
import { resolveAudienceContacts, ResolveAudienceInput } from "../audience"
import prisma from "../config"
import {
  cancelScheduledMessage,
  previewBulkCost,
  sendBulkEmail,
  sendBulkSms,
  sendEmail,
  sendSms,
} from "../infisend/client"
import { fireMessageBatch } from "./fan-out"

export type ChannelName = "IN_APP" | "EMAIL" | "SMS"

export interface SendMessageContent {
  inApp?: {
    title?: string
    body?: string
    link?: string | null
  }
  email?: {
    subject?: string
    text?: string
    html?: string
    templateId?: string
    variables?: Record<string, string>
  }
  sms?: {
    message?: string
    templateId?: string
    variables?: Record<string, string>
    senderId?: string
  }
}

export interface SendMessageInput {
  senderId: string
  target: ResolveAudienceInput
  channels: ChannelName[]
  content: SendMessageContent
  scheduledFor?: string | Date | null
}

export interface ChannelResult {
  channel: ChannelName
  status: "sent" | "scheduled" | "skipped" | "failed"
  recipientCount: number
  detail?: string
}

export interface SendMessageResult {
  batch: MessageBatch
  scheduled: boolean
  channels: ChannelResult[]
  invalidPhones: string[]
}

export class MessageValidationError extends Error {
  statusCode = 400
  constructor(message: string) {
    super(message)
    this.name = "MessageValidationError"
  }
}

const ALLOWED_CHANNELS: ChannelName[] = ["IN_APP", "EMAIL", "SMS"]

// ─── Validation ──────────────────────────────────────────────────────────────

export function validateSendMessage(input: SendMessageInput): void {
  const channels = input.channels ?? []

  if (!Array.isArray(channels) || channels.length === 0) {
    throw new MessageValidationError("Select at least one delivery channel.")
  }
  for (const channel of channels) {
    if (!ALLOWED_CHANNELS.includes(channel)) {
      throw new MessageValidationError(`Unknown channel "${channel}".`)
    }
  }

  if (channels.includes("IN_APP")) {
    const inApp = input.content.inApp
    if (!inApp?.title?.trim() || !inApp?.body?.trim()) {
      throw new MessageValidationError(
        "In-app messages need a title and a body."
      )
    }
  }

  if (channels.includes("EMAIL")) {
    const email = input.content.email
    const hasInline = !!(email?.subject || email?.text || email?.html)
    const hasTemplate = !!email?.templateId
    if (hasInline && hasTemplate) {
      throw new MessageValidationError(
        "Email: provide inline content or a templateId, not both."
      )
    }
    if (!hasInline && !hasTemplate) {
      throw new MessageValidationError(
        "Email: provide a subject and body, or a templateId."
      )
    }
    if (hasInline && !email?.subject?.trim()) {
      throw new MessageValidationError("Email: a subject is required.")
    }
  }

  if (channels.includes("SMS")) {
    const sms = input.content.sms
    const hasInline = !!sms?.message
    const hasTemplate = !!sms?.templateId
    if (hasInline && hasTemplate) {
      throw new MessageValidationError(
        "SMS: provide a message or a templateId, not both."
      )
    }
    if (!hasInline && !hasTemplate) {
      throw new MessageValidationError(
        "SMS: provide a message or a templateId."
      )
    }
    if (
      hasInline &&
      (sms!.message!.length < 1 || sms!.message!.length > 10000)
    ) {
      throw new MessageValidationError(
        "SMS: message must be between 1 and 10,000 characters."
      )
    }
  }

  const t = input.target
  if (t.targetType === "INDIVIDUALS") {
    if (!Array.isArray(t.individualIds) || t.individualIds.length === 0) {
      throw new MessageValidationError(
        "Select at least one recipient for an individuals send."
      )
    }
  } else if (!t.targetRef) {
    throw new MessageValidationError(
      "A target is required for group, district and council sends."
    )
  }
}

// ─── Dispatch ────────────────────────────────────────────────────────────────

function parseSchedule(value: string | Date | null | undefined): {
  date: Date | null
  isScheduled: boolean
} {
  if (!value) return { date: null, isScheduled: false }
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) {
    throw new MessageValidationError("scheduledFor must be a valid date.")
  }
  return { date, isScheduled: date.getTime() > Date.now() }
}

/**
 * The single multi-channel send entry point used by POST /admin/messages and
 * by future callers. Creates one MessageBatch, then:
 *  - IN_APP  → fan out InAppMessage rows now, or leave for the sweep if scheduled
 *  - EMAIL   → delegate to InfiSend (scheduledFor passed through natively)
 *  - SMS     → normalize E.164, cost-preview bulk sends, delegate to InfiSend
 */
export async function sendMessage(
  input: SendMessageInput
): Promise<SendMessageResult> {
  validateSendMessage(input)

  const { date: scheduledDate, isScheduled } = parseSchedule(input.scheduledFor)
  const scheduledForIso = isScheduled ? scheduledDate!.toISOString() : undefined
  const channels = input.channels
  const { target, content } = input

  const batch = await prisma.messageBatch.create({
    data: {
      senderId: input.senderId,
      targetType: target.targetType,
      targetRef:
        target.targetType === "INDIVIDUALS" ? null : (target.targetRef ?? null),
      individualIds:
        target.targetType === "INDIVIDUALS" ? (target.individualIds ?? []) : [],
      channels: channels as MessageChannel[],
      inAppTitle: content.inApp?.title ?? null,
      inAppBody: content.inApp?.body ?? null,
      inAppLink: content.inApp?.link ?? null,
      emailSubject: content.email?.subject ?? null,
      emailText: content.email?.text ?? null,
      emailHtml: content.email?.html ?? null,
      emailTemplateId: content.email?.templateId ?? null,
      ...(content.email?.variables
        ? { emailVariables: content.email.variables }
        : {}),
      smsMessage: content.sms?.message ?? null,
      smsTemplateId: content.sms?.templateId ?? null,
      smsSenderId: content.sms?.senderId ?? null,
      ...(content.sms?.variables
        ? { smsVariables: content.sms.variables }
        : {}),
      scheduledFor: scheduledDate,
      status: isScheduled ? "SCHEDULED" : "DRAFT",
    },
  })

  const results: ChannelResult[] = []
  let invalidPhones: string[] = []

  // Resolve contacts once — needed now for EMAIL/SMS regardless of schedule
  // (InfiSend holds scheduled sends itself). IN_APP re-resolves at fire time.
  const needsContacts = channels.includes("EMAIL") || channels.includes("SMS")
  const contacts = needsContacts ? await resolveAudienceContacts(target) : null

  // ── EMAIL ──────────────────────────────────────────────────────────────
  if (channels.includes("EMAIL")) {
    const emails = contacts?.emails ?? []
    if (emails.length === 0) {
      results.push({
        channel: "EMAIL",
        status: "skipped",
        recipientCount: 0,
        detail: "No recipients had an email address.",
      })
    } else {
      try {
        await maybePreviewCost("EMAIL", target.targetType, emails)
        const email = content.email!
        const shared = {
          subject: email.subject,
          text: email.text,
          html: email.html,
          templateId: email.templateId,
          variables: email.variables,
          scheduledFor: scheduledForIso,
        }

        const sentRows: { recipient: string; messageId: string }[] = []
        if (emails.length === 1 && target.targetType === "INDIVIDUALS") {
          const r = await sendEmail({ to: emails[0], ...shared })
          sentRows.push({ recipient: emails[0], messageId: r.messageId })
        } else {
          const r = await sendBulkEmail({ recipients: emails, ...shared })
          for (const m of r.messages) {
            sentRows.push({ recipient: m.to, messageId: m.messageId })
          }
        }

        await prisma.emailMessage.createMany({
          data: sentRows.map((row) => ({
            batchId: batch.id,
            messageId: row.messageId,
            recipient: row.recipient,
            subject: email.subject ?? null,
            templateId: email.templateId ?? null,
            status: "QUEUED" as const,
          })),
        })

        results.push({
          channel: "EMAIL",
          status: isScheduled ? "scheduled" : "sent",
          recipientCount: sentRows.length,
        })
      } catch (error) {
        results.push({
          channel: "EMAIL",
          status: "failed",
          recipientCount: 0,
          detail: error instanceof Error ? error.message : "Email send failed.",
        })
      }
    }
  }

  // ── SMS ────────────────────────────────────────────────────────────────
  if (channels.includes("SMS")) {
    const phones = contacts?.phones ?? []
    invalidPhones = contacts?.invalidPhones ?? []
    if (phones.length === 0) {
      results.push({
        channel: "SMS",
        status: "skipped",
        recipientCount: 0,
        detail: "No recipients had a usable phone number.",
      })
    } else {
      try {
        await maybePreviewCost("SMS", target.targetType, phones)
        const sms = content.sms!
        const shared = {
          message: sms.message,
          templateId: sms.templateId,
          variables: sms.variables,
          senderId: sms.senderId,
          scheduledFor: scheduledForIso,
        }

        const sentRows: { recipient: string; messageId: string }[] = []
        if (phones.length === 1 && target.targetType === "INDIVIDUALS") {
          const r = await sendSms({ to: phones[0], ...shared })
          sentRows.push({ recipient: phones[0], messageId: r.messageId })
        } else {
          const r = await sendBulkSms({ recipients: phones, ...shared })
          for (const m of r.messages) {
            sentRows.push({ recipient: m.to, messageId: m.messageId })
          }
        }

        await prisma.smsMessage.createMany({
          data: sentRows.map((row) => ({
            batchId: batch.id,
            messageId: row.messageId,
            recipient: row.recipient,
            message: sms.message ?? null,
            templateId: sms.templateId ?? null,
            senderId: sms.senderId ?? null,
            status: "QUEUED" as const,
          })),
        })

        results.push({
          channel: "SMS",
          status: isScheduled ? "scheduled" : "sent",
          recipientCount: sentRows.length,
        })
      } catch (error) {
        results.push({
          channel: "SMS",
          status: "failed",
          recipientCount: 0,
          detail: error instanceof Error ? error.message : "SMS send failed.",
        })
      }
    }
  }

  // ── IN_APP ─────────────────────────────────────────────────────────────
  if (channels.includes("IN_APP")) {
    if (isScheduled) {
      results.push({
        channel: "IN_APP",
        status: "scheduled",
        recipientCount: 0,
        detail: "In-app messages are created when the schedule fires.",
      })
    } else {
      await fireMessageBatch(batch.id)
      const recipientCount = await prisma.inAppMessage.count({
        where: { batchId: batch.id },
      })
      results.push({
        channel: "IN_APP",
        status: "sent",
        recipientCount,
      })
    }
  }

  // ── Finalize batch status ──────────────────────────────────────────────
  let finalBatch = await prisma.messageBatch.findUnique({
    where: { id: batch.id },
  })
  if (!isScheduled && finalBatch?.status !== "SENT") {
    finalBatch = await prisma.messageBatch.update({
      where: { id: batch.id },
      data: { status: "SENT" },
    })
  }

  return {
    batch: finalBatch!,
    scheduled: isScheduled,
    channels: results,
    invalidPhones,
  }
}

/**
 * Best-effort cost/validity preview before a group/district/council paid send.
 * InfiSend's bulk-preview may reject API-key auth; a failure here is logged and
 * does not block the send (the acceptance criteria only require that preview is
 * *attempted* for bulk sends).
 */
async function maybePreviewCost(
  channel: "EMAIL" | "SMS",
  targetType: ResolveAudienceInput["targetType"],
  recipients: string[]
): Promise<void> {
  if (targetType === "INDIVIDUALS") return
  try {
    const preview = await previewBulkCost({ channel, recipients })
    if (preview.invalidRecipients?.length) {
      console.warn(
        `[messaging] ${channel} bulk-preview flagged ${preview.invalidRecipients.length} bad recipients.`
      )
    }
  } catch (error) {
    console.warn(
      `[messaging] ${channel} bulk-preview unavailable — proceeding without it:`,
      error instanceof Error ? error.message : error
    )
  }
}

/**
 * Cancels every still-pending provider message (email + SMS) attached to a
 * batch. Called when an admin cancels a scheduled batch. Best-effort per row.
 */
export async function cancelBatchProviderMessages(
  batchId: string
): Promise<void> {
  const [emails, sms] = await Promise.all([
    prisma.emailMessage.findMany({
      where: { batchId, status: { in: ["QUEUED", "SENT"] } },
      select: { messageId: true },
    }),
    prisma.smsMessage.findMany({
      where: { batchId, status: { in: ["QUEUED", "SENT"] } },
      select: { messageId: true },
    }),
  ])

  const ids = [...emails, ...sms]
    .map((r) => r.messageId)
    .filter((id): id is string => !!id)

  await Promise.all(
    ids.map(async (id) => {
      try {
        await cancelScheduledMessage(id)
      } catch (error) {
        console.warn(
          `[messaging] Could not cancel provider message ${id}:`,
          error instanceof Error ? error.message : error
        )
      }
    })
  )
}

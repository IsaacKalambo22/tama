import { Request, Response } from "express"
import { MessageTargetType } from "../../../prisma/generated/prisma"
import { countAudience, resolveAudienceContacts } from "../../audience"
import prisma from "../../config"
import { previewBulkCost } from "../../infisend/client"
import {
  cancelBatchProviderMessages,
  MessageValidationError,
  sendMessage,
} from "../../messaging/dispatch"
import { APIResponse } from "../../types"

const TARGET_TYPES: MessageTargetType[] = [
  "INDIVIDUALS",
  "GROUP",
  "DISTRICT",
  "COUNCIL",
]

function isValidTargetType(value: unknown): value is MessageTargetType {
  return (
    typeof value === "string" &&
    TARGET_TYPES.includes(value as MessageTargetType)
  )
}

/** Attaches per-channel counts to each batch for the sender's history view. */
async function withStats<T extends { id: string }>(batches: T[]) {
  return Promise.all(
    batches.map(async (batch) => {
      const [recipientCount, readCount, emailCount, smsCount] =
        await Promise.all([
          prisma.inAppMessage.count({ where: { batchId: batch.id } }),
          prisma.inAppMessage.count({
            where: { batchId: batch.id, read: true },
          }),
          prisma.emailMessage.count({ where: { batchId: batch.id } }),
          prisma.smsMessage.count({ where: { batchId: batch.id } }),
        ])
      return { ...batch, recipientCount, readCount, emailCount, smsCount }
    })
  )
}

/**
 * POST /admin/messages
 * Composes and sends (or schedules) a multi-channel message. Delegates the
 * whole fan-out to messaging/dispatch.sendMessage.
 */
export const createMessageBatch = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const senderId = req.user!.id
  const {
    targetType,
    targetRef,
    individualIds,
    channels,
    content,
    scheduledFor,
  } = req.body

  if (!isValidTargetType(targetType)) {
    res.status(400).json({
      success: false,
      message:
        "targetType must be one of INDIVIDUALS, GROUP, DISTRICT, COUNCIL.",
    })
    return
  }

  try {
    const result = await sendMessage({
      senderId,
      target: { targetType, targetRef, individualIds },
      channels,
      content: content ?? {},
      scheduledFor,
    })

    res.status(201).json({
      success: true,
      message: result.scheduled
        ? "Message scheduled successfully"
        : "Message sent successfully",
      data: result,
    })
  } catch (error: any) {
    if (error instanceof MessageValidationError) {
      res.status(400).json({ success: false, message: error.message })
      return
    }
    console.error("Error creating message batch:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while sending the message.",
      error: error.message,
    })
  }
}

/**
 * POST /admin/messages/preview-cost
 * Reach + cost/validity preview for the paid channels (email/SMS) before the
 * final confirm. Never sends anything.
 */
export const previewMessageCost = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { targetType, targetRef, individualIds, channels } = req.body

  if (!isValidTargetType(targetType)) {
    res.status(400).json({
      success: false,
      message:
        "targetType must be one of INDIVIDUALS, GROUP, DISTRICT, COUNCIL.",
    })
    return
  }

  const selected: string[] = Array.isArray(channels) ? channels : []

  try {
    const target = { targetType, targetRef, individualIds }
    const reach = await countAudience(target)

    const data: Record<string, unknown> = { reach }

    if (selected.includes("EMAIL") || selected.includes("SMS")) {
      const contacts = await resolveAudienceContacts(target)
      data.emailReach = contacts.emails.length
      data.smsReach = contacts.phones.length
      data.invalidPhones = contacts.invalidPhones

      if (selected.includes("EMAIL") && contacts.emails.length > 0) {
        data.email = await previewSafe("EMAIL", contacts.emails)
      }
      if (selected.includes("SMS") && contacts.phones.length > 0) {
        data.sms = await previewSafe("SMS", contacts.phones)
      }
    }

    res.status(200).json({
      success: true,
      message: "Cost preview retrieved successfully",
      data,
    })
  } catch (error: any) {
    console.error("Error previewing message cost:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while previewing the cost.",
      error: error.message,
    })
  }
}

async function previewSafe(channel: "EMAIL" | "SMS", recipients: string[]) {
  try {
    return {
      available: true,
      ...(await previewBulkCost({ channel, recipients })),
    }
  } catch (error) {
    return {
      available: false,
      reason:
        error instanceof Error
          ? error.message
          : "Cost preview is currently unavailable.",
    }
  }
}

/** GET /admin/messages/batches — the sender's own history with stats. */
export const getMessageBatches = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const senderId = req.user!.id
  const page = Math.max(1, parseInt(req.query.page as string) || 1)
  const limit = Math.min(
    100,
    Math.max(1, parseInt(req.query.limit as string) || 25)
  )
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = { senderId }
  if (req.query.status) where.status = req.query.status as string

  try {
    const [batches, total] = await Promise.all([
      prisma.messageBatch.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.messageBatch.count({ where }),
    ])

    res.status(200).json({
      success: true,
      message: "Message batches retrieved successfully",
      data: {
        batches: await withStats(batches),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error: any) {
    console.error("Error fetching message batches:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching message batches.",
      error: error.message,
    })
  }
}

/**
 * PATCH /admin/messages/batches/:id
 * Edits a still-DRAFT/SCHEDULED batch's schedule. Content/target edits on a
 * scheduled batch are intentionally limited — once channels have been handed to
 * InfiSend, re-composing is a cancel + new send.
 */
export const updateMessageBatch = async (
  req: Request<{ id: string }>,
  res: Response<APIResponse>
): Promise<void> => {
  const senderId = req.user!.id
  const { id } = req.params
  const { scheduledFor } = req.body

  try {
    const existing = await prisma.messageBatch.findUnique({ where: { id } })

    if (!existing || existing.senderId !== senderId) {
      res
        .status(404)
        .json({ success: false, message: "Message batch not found." })
      return
    }

    if (existing.status !== "DRAFT" && existing.status !== "SCHEDULED") {
      res.status(409).json({
        success: false,
        message: "Only draft or scheduled batches can be edited.",
      })
      return
    }

    let scheduledDate: Date | null | undefined
    if (scheduledFor !== undefined) {
      scheduledDate = scheduledFor ? new Date(scheduledFor) : null
      if (scheduledDate && Number.isNaN(scheduledDate.getTime())) {
        res.status(400).json({
          success: false,
          message: "scheduledFor must be a valid date.",
        })
        return
      }
    }

    const updated = await prisma.messageBatch.update({
      where: { id },
      data: {
        scheduledFor:
          scheduledDate !== undefined ? scheduledDate : existing.scheduledFor,
        status:
          scheduledDate !== undefined
            ? scheduledDate && scheduledDate.getTime() > Date.now()
              ? "SCHEDULED"
              : "DRAFT"
            : existing.status,
      },
    })

    res.status(200).json({
      success: true,
      message: "Message batch updated successfully",
      data: updated,
    })
  } catch (error: any) {
    console.error("Error updating message batch:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the message batch.",
      error: error.message,
    })
  }
}

/**
 * POST /admin/messages/batches/:id/cancel
 * Cancels a still-DRAFT/SCHEDULED batch and asks InfiSend to cancel any
 * still-pending scheduled email/SMS from it.
 */
export const cancelMessageBatch = async (
  req: Request<{ id: string }>,
  res: Response<APIResponse>
): Promise<void> => {
  const senderId = req.user!.id
  const { id } = req.params

  try {
    const existing = await prisma.messageBatch.findUnique({ where: { id } })

    if (!existing || existing.senderId !== senderId) {
      res
        .status(404)
        .json({ success: false, message: "Message batch not found." })
      return
    }

    if (existing.status !== "DRAFT" && existing.status !== "SCHEDULED") {
      res.status(409).json({
        success: false,
        message: "Only draft or scheduled batches can be cancelled.",
      })
      return
    }

    await cancelBatchProviderMessages(id)

    const cancelled = await prisma.messageBatch.update({
      where: { id },
      data: { status: "CANCELLED" },
    })

    res.status(200).json({
      success: true,
      message: "Message batch cancelled successfully",
      data: cancelled,
    })
  } catch (error: any) {
    console.error("Error cancelling message batch:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while cancelling the message batch.",
      error: error.message,
    })
  }
}

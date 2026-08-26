import { Request, Response } from "express"
import { NotificationTargetType } from "../../../prisma/generated/prisma"
import prisma from "../../config"
import { fireNotificationBatch } from "../../notifications/fan-out"
import { APIResponse } from "../../types"

const TARGET_TYPES: NotificationTargetType[] = [
  "INDIVIDUALS",
  "GROUP",
  "DISTRICT",
  "COUNCIL",
]

function isValidTargetType(value: unknown): value is NotificationTargetType {
  return (
    typeof value === "string" &&
    TARGET_TYPES.includes(value as NotificationTargetType)
  )
}

/**
 * Attaches recipientCount / readCount to each batch for the sender's
 * "sent to District X, 340 recipients, 12 read" view. Batch volumes here
 * are small (admin-composed sends), so N+1 counts are fine.
 */
async function withStats<T extends { id: string }>(batches: T[]) {
  return Promise.all(
    batches.map(async (batch) => {
      const [recipientCount, readCount] = await Promise.all([
        prisma.inAppNotification.count({ where: { batchId: batch.id } }),
        prisma.inAppNotification.count({
          where: { batchId: batch.id, read: true },
        }),
      ])
      return { ...batch, recipientCount, readCount }
    })
  )
}

/**
 * POST /admin/notifications
 * Composes a notification and either sends it immediately (no scheduledFor,
 * or one in the past) or schedules it for later. Either way, audience
 * resolution happens at fire time via fireNotificationBatch — see
 * apps/api/src/notifications/fan-out.ts.
 */
export const createNotificationBatch = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const senderId = req.user!.id
  const {
    targetType,
    targetRef,
    individualIds,
    title,
    body,
    link,
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

  if (!title || !body) {
    res.status(400).json({
      success: false,
      message: "title and body are required.",
    })
    return
  }

  if (
    targetType === "INDIVIDUALS" &&
    (!Array.isArray(individualIds) || individualIds.length === 0)
  ) {
    res.status(400).json({
      success: false,
      message:
        "individualIds must be a non-empty array for INDIVIDUALS target.",
    })
    return
  }

  if (targetType !== "INDIVIDUALS" && !targetRef) {
    res.status(400).json({
      success: false,
      message:
        "targetRef is required for GROUP, DISTRICT, and COUNCIL targets.",
    })
    return
  }

  let scheduledDate: Date | null = null
  if (scheduledFor) {
    scheduledDate = new Date(scheduledFor)
    if (isNaN(scheduledDate.getTime())) {
      res.status(400).json({
        success: false,
        message: "scheduledFor must be a valid date.",
      })
      return
    }
  }

  const isScheduled = !!scheduledDate && scheduledDate.getTime() > Date.now()

  try {
    const batch = await prisma.notificationBatch.create({
      data: {
        senderId,
        targetType,
        targetRef: targetType === "INDIVIDUALS" ? null : targetRef,
        individualIds: targetType === "INDIVIDUALS" ? individualIds : [],
        title,
        body,
        link: link || null,
        scheduledFor: scheduledDate,
        status: isScheduled ? "SCHEDULED" : "DRAFT",
      },
    })

    if (!isScheduled) {
      await fireNotificationBatch(batch.id)
    }

    const result = await prisma.notificationBatch.findUnique({
      where: { id: batch.id },
    })

    res.status(201).json({
      success: true,
      message: isScheduled
        ? "Notification scheduled successfully"
        : "Notification sent successfully",
      data: result,
    })
  } catch (error: any) {
    console.error("Error creating notification batch:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the notification.",
      error: error.message,
    })
  }
}

/**
 * GET /admin/notifications/batches
 * The authenticated sender's own sent/scheduled batches with delivery/read
 * stats. Query params: page (default 1), limit (default 25), status.
 */
export const getNotificationBatches = async (
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
  if (req.query.status) {
    where.status = req.query.status as string
  }

  try {
    const [batches, total] = await Promise.all([
      prisma.notificationBatch.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.notificationBatch.count({ where }),
    ])

    const batchesWithStats = await withStats(batches)

    res.status(200).json({
      success: true,
      message: "Notification batches retrieved successfully",
      data: {
        batches: batchesWithStats,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error: any) {
    console.error("Error fetching notification batches:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching notification batches.",
      error: error.message,
    })
  }
}

/**
 * PATCH /admin/notifications/batches/:id
 * Edits a still-DRAFT/SCHEDULED batch (title, body, link, target, or
 * schedule). Once SENT or CANCELLED, a batch is immutable history.
 */
export const updateNotificationBatch = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const senderId = req.user!.id
  const { id } = req.params
  const {
    targetType,
    targetRef,
    individualIds,
    title,
    body,
    link,
    scheduledFor,
  } = req.body

  try {
    const existing = await prisma.notificationBatch.findUnique({
      where: { id },
    })

    if (!existing || existing.senderId !== senderId) {
      res
        .status(404)
        .json({ success: false, message: "Notification batch not found." })
      return
    }

    if (existing.status !== "DRAFT" && existing.status !== "SCHEDULED") {
      res.status(409).json({
        success: false,
        message: "Only draft or scheduled batches can be edited.",
      })
      return
    }

    if (targetType !== undefined && !isValidTargetType(targetType)) {
      res.status(400).json({
        success: false,
        message:
          "targetType must be one of INDIVIDUALS, GROUP, DISTRICT, COUNCIL.",
      })
      return
    }

    let scheduledDate: Date | null | undefined = undefined
    if (scheduledFor !== undefined) {
      scheduledDate = scheduledFor ? new Date(scheduledFor) : null
      if (scheduledDate && isNaN(scheduledDate.getTime())) {
        res.status(400).json({
          success: false,
          message: "scheduledFor must be a valid date.",
        })
        return
      }
    }

    const nextTargetType = targetType ?? existing.targetType

    const updated = await prisma.notificationBatch.update({
      where: { id },
      data: {
        targetType: nextTargetType,
        targetRef:
          nextTargetType === "INDIVIDUALS"
            ? null
            : (targetRef ?? existing.targetRef),
        individualIds:
          nextTargetType === "INDIVIDUALS"
            ? (individualIds ?? existing.individualIds)
            : [],
        title: title ?? existing.title,
        body: body ?? existing.body,
        link: link !== undefined ? link : existing.link,
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
      message: "Notification batch updated successfully",
      data: updated,
    })
  } catch (error: any) {
    console.error("Error updating notification batch:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the notification batch.",
      error: error.message,
    })
  }
}

/**
 * POST /admin/notifications/batches/:id/cancel
 * Cancels a still-DRAFT/SCHEDULED batch. The sweep skips CANCELLED batches.
 */
export const cancelNotificationBatch = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const senderId = req.user!.id
  const { id } = req.params

  try {
    const existing = await prisma.notificationBatch.findUnique({
      where: { id },
    })

    if (!existing || existing.senderId !== senderId) {
      res
        .status(404)
        .json({ success: false, message: "Notification batch not found." })
      return
    }

    if (existing.status !== "DRAFT" && existing.status !== "SCHEDULED") {
      res.status(409).json({
        success: false,
        message: "Only draft or scheduled batches can be cancelled.",
      })
      return
    }

    const cancelled = await prisma.notificationBatch.update({
      where: { id },
      data: { status: "CANCELLED" },
    })

    res.status(200).json({
      success: true,
      message: "Notification batch cancelled successfully",
      data: cancelled,
    })
  } catch (error: any) {
    console.error("Error cancelling notification batch:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while cancelling the notification batch.",
      error: error.message,
    })
  }
}

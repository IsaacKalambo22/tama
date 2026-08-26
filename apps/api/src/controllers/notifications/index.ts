import { Request, Response } from "express"
import prisma from "../../config"
import { APIResponse } from "../../types"

/**
 * GET /notifications?cursor=&limit=&unreadOnly=
 * Paginated feed for the current authenticated user, scoped by identity
 * (not role) so any future farmer/manager/district-admin dashboard can call
 * this unchanged.
 */
export const getMyNotifications = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const recipientId = req.user!.id
  const limit = Math.min(
    100,
    Math.max(1, parseInt(req.query.limit as string) || 20)
  )
  const cursor = req.query.cursor as string | undefined
  const unreadOnly = req.query.unreadOnly === "true"

  try {
    const notifications = await prisma.inAppNotification.findMany({
      where: { recipientId, ...(unreadOnly ? { read: false } : {}) },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: limit + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    })

    const hasMore = notifications.length > limit
    const page = hasMore ? notifications.slice(0, limit) : notifications
    const nextCursor = hasMore ? page[page.length - 1].id : null

    res.status(200).json({
      success: true,
      message: "Notifications retrieved successfully",
      data: {
        notifications: page,
        nextCursor,
        hasMore,
      },
    })
  } catch (error: any) {
    console.error("Error fetching notifications:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching notifications.",
      error: error.message,
    })
  }
}

/** GET /notifications/unread-count */
export const getUnreadCount = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const recipientId = req.user!.id

  try {
    const count = await prisma.inAppNotification.count({
      where: { recipientId, read: false },
    })

    res.status(200).json({
      success: true,
      message: "Unread count retrieved successfully",
      data: { count },
    })
  } catch (error: any) {
    console.error("Error fetching unread count:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the unread count.",
      error: error.message,
    })
  }
}

/**
 * GET /notifications/:id
 * What the dedicated notifications page opens. Marks the notification read
 * as a side effect of the fetch — chosen over a separate follow-up PATCH so
 * the bell's "click an item -> land on its detail, marked read" flow is a
 * single request instead of two racing ones.
 */
export const getNotificationById = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const recipientId = req.user!.id
  const { id } = req.params

  try {
    const notification = await prisma.inAppNotification.findUnique({
      where: { id },
    })

    if (!notification || notification.recipientId !== recipientId) {
      res
        .status(404)
        .json({ success: false, message: "Notification not found." })
      return
    }

    const result = notification.read
      ? notification
      : await prisma.inAppNotification.update({
          where: { id },
          data: { read: true, readAt: new Date() },
        })

    res.status(200).json({
      success: true,
      message: "Notification retrieved successfully",
      data: result,
    })
  } catch (error: any) {
    console.error("Error fetching notification:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the notification.",
      error: error.message,
    })
  }
}

/** PATCH /notifications/:id/read */
export const markNotificationRead = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const recipientId = req.user!.id
  const { id } = req.params

  try {
    const notification = await prisma.inAppNotification.findUnique({
      where: { id },
    })

    if (!notification || notification.recipientId !== recipientId) {
      res
        .status(404)
        .json({ success: false, message: "Notification not found." })
      return
    }

    const updated = await prisma.inAppNotification.update({
      where: { id },
      data: { read: true, readAt: notification.readAt ?? new Date() },
    })

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: updated,
    })
  } catch (error: any) {
    console.error("Error marking notification as read:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while marking the notification as read.",
      error: error.message,
    })
  }
}

/** PATCH /notifications/read-all */
export const markAllNotificationsRead = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const recipientId = req.user!.id

  try {
    const result = await prisma.inAppNotification.updateMany({
      where: { recipientId, read: false },
      data: { read: true, readAt: new Date() },
    })

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      data: { updatedCount: result.count },
    })
  } catch (error: any) {
    console.error("Error marking all notifications as read:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while marking all notifications as read.",
      error: error.message,
    })
  }
}

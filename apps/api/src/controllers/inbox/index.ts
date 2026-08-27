import { Request, Response } from "express"
import prisma from "../../config"
import { APIResponse } from "../../types"

/**
 * GET /inbox?cursor=&limit=&unreadOnly=
 * The authenticated user's received in-app messages. Scoped by identity (not
 * role) so any dashboard — farmer, council-admin, district-admin, admin — can
 * call this unchanged.
 */
export const getInbox = async (
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
    const messages = await prisma.inAppMessage.findMany({
      where: { recipientId, ...(unreadOnly ? { read: false } : {}) },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: limit + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    })

    const hasMore = messages.length > limit
    const page = hasMore ? messages.slice(0, limit) : messages
    const nextCursor = hasMore ? page[page.length - 1].id : null

    res.status(200).json({
      success: true,
      message: "Inbox retrieved successfully",
      data: { messages: page, nextCursor, hasMore },
    })
  } catch (error: any) {
    console.error("Error fetching inbox:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the inbox.",
      error: error.message,
    })
  }
}

/** GET /inbox/unread-count */
export const getUnreadCount = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const recipientId = req.user!.id

  try {
    const count = await prisma.inAppMessage.count({
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
 * GET /inbox/:id
 * Opens a message and marks it read as a side effect of the fetch — chosen
 * over a separate follow-up PATCH so "click an item -> land on its detail,
 * marked read" is a single request instead of two racing ones.
 */
export const getInboxMessage = async (
  req: Request<{ id: string }>,
  res: Response<APIResponse>
): Promise<void> => {
  const recipientId = req.user!.id
  const { id } = req.params

  try {
    const message = await prisma.inAppMessage.findUnique({ where: { id } })

    if (!message || message.recipientId !== recipientId) {
      res.status(404).json({ success: false, message: "Message not found." })
      return
    }

    const result = message.read
      ? message
      : await prisma.inAppMessage.update({
          where: { id },
          data: { read: true, readAt: new Date() },
        })

    res.status(200).json({
      success: true,
      message: "Message retrieved successfully",
      data: result,
    })
  } catch (error: any) {
    console.error("Error fetching message:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the message.",
      error: error.message,
    })
  }
}

/** PATCH /inbox/:id/read */
export const markRead = async (
  req: Request<{ id: string }>,
  res: Response<APIResponse>
): Promise<void> => {
  const recipientId = req.user!.id
  const { id } = req.params

  try {
    const message = await prisma.inAppMessage.findUnique({ where: { id } })

    if (!message || message.recipientId !== recipientId) {
      res.status(404).json({ success: false, message: "Message not found." })
      return
    }

    const updated = await prisma.inAppMessage.update({
      where: { id },
      data: { read: true, readAt: message.readAt ?? new Date() },
    })

    res.status(200).json({
      success: true,
      message: "Message marked as read",
      data: updated,
    })
  } catch (error: any) {
    console.error("Error marking message as read:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while marking the message as read.",
      error: error.message,
    })
  }
}

/** PATCH /inbox/read-all */
export const markAllRead = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const recipientId = req.user!.id

  try {
    const result = await prisma.inAppMessage.updateMany({
      where: { recipientId, read: false },
      data: { read: true, readAt: new Date() },
    })

    res.status(200).json({
      success: true,
      message: "All messages marked as read",
      data: { updatedCount: result.count },
    })
  } catch (error: any) {
    console.error("Error marking all messages as read:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while marking all messages as read.",
      error: error.message,
    })
  }
}

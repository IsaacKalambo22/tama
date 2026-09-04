import { Request, Response } from "express"
import prisma from "../../config"
import { APIResponse } from "../../types"

/**
 * GET /notifications?cursor=&limit=
 * The system-wide broadcast feed. No per-user filtering beyond chronological
 * order — every authenticated user sees the same list.
 */
export const getSystemFeed = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const limit = Math.min(
    100,
    Math.max(1, parseInt(req.query.limit as string) || 20)
  )
  const cursor = req.query.cursor as string | undefined

  try {
    const items = await prisma.systemNotification.findMany({
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: limit + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    })

    const hasMore = items.length > limit
    const page = hasMore ? items.slice(0, limit) : items
    const nextCursor = hasMore ? page[page.length - 1].id : null

    res.status(200).json({
      success: true,
      message: "Notifications retrieved successfully",
      data: { notifications: page, nextCursor, hasMore },
    })
  } catch (error: any) {
    console.error("Error fetching system notifications:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching notifications.",
      error: error.message,
    })
  }
}

/**
 * GET /notifications/unseen-count
 * Count of system notifications newer than the caller's
 * lastSeenSystemNotificationAt (all of them if the user has never visited).
 */
export const getUnseenCount = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const userId = req.user!.id

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { lastSeenSystemNotificationAt: true },
    })

    const count = await prisma.systemNotification.count({
      where: user?.lastSeenSystemNotificationAt
        ? { createdAt: { gt: user.lastSeenSystemNotificationAt } }
        : {},
    })

    res.status(200).json({
      success: true,
      message: "Unseen count retrieved successfully",
      data: { count },
    })
  } catch (error: any) {
    console.error("Error fetching unseen count:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the unseen count.",
      error: error.message,
    })
  }
}

/** POST /notifications/mark-seen — stamps "I've seen everything up to now". */
export const markSeen = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const userId = req.user!.id

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { lastSeenSystemNotificationAt: new Date() },
    })

    res.status(200).json({
      success: true,
      message: "Notifications marked as seen",
    })
  } catch (error: any) {
    console.error("Error marking notifications as seen:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while marking notifications as seen.",
      error: error.message,
    })
  }
}

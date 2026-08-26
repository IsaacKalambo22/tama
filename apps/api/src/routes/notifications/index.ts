import { Router } from "express"
import {
  getMyNotifications,
  getNotificationById,
  getUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
} from "../../controllers/notifications"
import { verifyToken } from "../../middlewares/verify-token"

const router = Router()

// Receive-side: role-agnostic, scoped by authenticated identity so any
// dashboard (farmer, manager, district-admin, admin) can call these as-is.
router.get("/unread-count", verifyToken, getUnreadCount)
router.patch("/read-all", verifyToken, markAllNotificationsRead)
router.get("/:id", verifyToken, getNotificationById)
router.patch("/:id/read", verifyToken, markNotificationRead)
router.get("/", verifyToken, getMyNotifications)

export default router

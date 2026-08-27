import { Router } from "express"
import {
  getInbox,
  getInboxMessage,
  getUnreadCount,
  markAllRead,
  markRead,
} from "../../controllers/inbox"
import { verifyToken } from "../../middlewares/verify-token"

const router = Router()

// Receive-side: identity-scoped, role-agnostic — any authenticated dashboard
// can call these as-is.
router.get("/unread-count", verifyToken, getUnreadCount)
router.patch("/read-all", verifyToken, markAllRead)
router.get("/:id", verifyToken, getInboxMessage)
router.patch("/:id/read", verifyToken, markRead)
router.get("/", verifyToken, getInbox)

export default router

import { Router } from "express"
import {
  getSystemFeed,
  getUnseenCount,
  markSeen,
} from "../../controllers/system-notifications"
import { verifyToken } from "../../middlewares/verify-token"

const router = Router()

// System-wide broadcast feed — identity-scoped only for the seen/unseen marker.
router.get("/unseen-count", verifyToken, getUnseenCount)
router.post("/mark-seen", verifyToken, markSeen)
router.get("/", verifyToken, getSystemFeed)

export default router

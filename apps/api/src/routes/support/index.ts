import { Router } from "express"
import {
  createSupportRequest,
  getSupportThread,
  listSupportRequests,
  replyToSupportThread,
  setSupportThreadStatus,
} from "../../controllers/support"
import { verifyToken } from "../../middlewares/verify-token"

const router = Router()

// Identity-scoped: a farmer sees their own requests, a manager sees requests
// from farmers in their council/district. No role gate here — the controller
// branches on req.user.role.
router.post("/", verifyToken, createSupportRequest)
router.get("/", verifyToken, listSupportRequests)
router.get("/:id", verifyToken, getSupportThread)
router.post("/:id/reply", verifyToken, replyToSupportThread)
router.patch("/:id/status", verifyToken, setSupportThreadStatus)

export default router

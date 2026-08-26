import { Router } from "express"
import {
  cancelNotificationBatch,
  createNotificationBatch,
  getNotificationBatches,
  updateNotificationBatch,
} from "../../controllers/admin-notifications"
import { verifyNotificationSender } from "../../middlewares/verify-token"

const router = Router()

router.post("/", verifyNotificationSender, createNotificationBatch)
router.get("/batches", verifyNotificationSender, getNotificationBatches)
router.patch("/batches/:id", verifyNotificationSender, updateNotificationBatch)
router.post(
  "/batches/:id/cancel",
  verifyNotificationSender,
  cancelNotificationBatch
)

export default router

import { Router } from "express"
import {
  cancelMessageBatch,
  createMessageBatch,
  getMessageBatches,
  previewMessageCost,
  updateMessageBatch,
} from "../../controllers/admin-messages"
import { verifyMessageSender } from "../../middlewares/verify-token"

const router = Router()

// Compose/send is gated to SUPER_ADMIN, COUNCIL_ADMIN and DISTRICT_ADMIN.
router.post("/", verifyMessageSender, createMessageBatch)
router.post("/preview-cost", verifyMessageSender, previewMessageCost)
router.get("/batches", verifyMessageSender, getMessageBatches)
router.patch("/batches/:id", verifyMessageSender, updateMessageBatch)
router.post("/batches/:id/cancel", verifyMessageSender, cancelMessageBatch)

export default router

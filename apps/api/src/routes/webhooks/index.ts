import express, { Router } from "express"
import { handleInfiSendWebhook } from "../../controllers/webhooks"

const router = Router()

// Raw body is required for HMAC signature verification.
// This route-level middleware overrides the global express.json() above it.
router.post(
  "/infisend",
  express.raw({ type: "application/json" }),
  handleInfiSendWebhook
)

export default router

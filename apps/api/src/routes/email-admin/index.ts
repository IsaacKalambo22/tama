import { Router } from "express"
import {
  getEmailConfig,
  getEmailLog,
  testSendEmail,
  updateEmailConfig,
} from "../../controllers/email-admin"
import { verifyAdmin } from "../../middlewares/verify-token"

const router = Router()

router.get("/config", verifyAdmin, getEmailConfig)
router.patch("/config", verifyAdmin, updateEmailConfig)
router.post("/test-send", verifyAdmin, testSendEmail)
router.get("/log", verifyAdmin, getEmailLog)

export default router

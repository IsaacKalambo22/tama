import { Router } from "express"
import { getSmsLog, testSendSms } from "../../controllers/sms-admin"
import { verifyAdmin } from "../../middlewares/verify-token"

const router = Router()

router.post("/test-send", verifyAdmin, testSendSms)
router.get("/log", verifyAdmin, getSmsLog)

export default router

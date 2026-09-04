import { Router } from "express"
import {
  forgotPassword,
  login,
  registerUser,
  resetPassword,
  setFirstLoginPassword,
  setPassword,
} from "../../controllers/auth"
import { verifyToken } from "../../middlewares/verify-token"

const router = Router()

// Self-service sign-up is not offered; accounts are created by an
// authenticated admin only.
router.post("/register", verifyToken, registerUser)
router.post("/sign-in", login)
router.post("/set-password", setPassword)
router.post("/first-login-set-password", setFirstLoginPassword)
router.post("/reset-password", resetPassword)
router.post("/forgot-password", forgotPassword)

export default router

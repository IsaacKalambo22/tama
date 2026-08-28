import { Router } from "express"
import {
  forgotPassword,
  login,
  registerUser,
  resetPassword,
  setFirstLoginPassword,
  setPassword,
} from "../../controllers/auth"
import { optionalAuth } from "../../middlewares/optional-auth"

const router = Router()

router.post("/sign-up", optionalAuth, registerUser)
router.post("/register", optionalAuth, registerUser)
router.post("/sign-in", login)
router.post("/set-password", setPassword)
router.post("/first-login-set-password", setFirstLoginPassword)
router.post("/reset-password", resetPassword)
router.post("/forgot-password", forgotPassword)

export default router

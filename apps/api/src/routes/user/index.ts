import { Router } from "express"
import {
  deleteUser,
  getAllUsers,
  getUserById,
  sendContactMessage,
  updateUser,
} from "../../controllers/user"
import { verifyAdmin, verifyToken } from "../../middlewares/verify-token"

const router = Router()

router.get("/", getAllUsers)
router.post("/contact-email", sendContactMessage)
router.get("/:id", verifyToken, getUserById)
router.patch("/:id", verifyToken, updateUser)
router.delete("/:id", verifyAdmin, deleteUser)

export default router

import { Router } from "express"
import {
  bulkImportPhoneNumbers,
  bulkImportUsers,
  deleteUser,
  getAllUsers,
  getUserById,
  sendContactMessage,
  updateUser,
} from "../../controllers/user"
import { verifyToken } from "../../middlewares/verify-token"

const router = Router()

router.get("/", verifyToken, getAllUsers)
router.post("/contact-email", sendContactMessage)
router.post("/import/bulk", verifyToken, bulkImportUsers)
router.post("/import/phone/bulk", verifyToken, bulkImportPhoneNumbers)
router.get("/:id", verifyToken, getUserById)
router.patch("/:id", verifyToken, updateUser)
router.delete("/:id", verifyToken, deleteUser)

export default router

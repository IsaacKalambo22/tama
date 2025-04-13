import { Router } from "express"
import {
  createForm,
  deleteForm,
  getAllForms,
  updateForm,
} from "../../controllers/form"
import { verifyAdminAndManager } from "../../middlewares/verify-token"

const router = Router()

router.post("/", verifyAdminAndManager, createForm)
router.get("/", getAllForms)
router.patch("/:id", verifyAdminAndManager, updateForm)
router.delete("/:id", verifyAdminAndManager, deleteForm)

export default router

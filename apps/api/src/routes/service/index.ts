import { Router } from "express"
import {
  createService,
  deleteService,
  getAllService,
  updateService,
} from "../../controllers/service"
import { verifyAdminAndManager } from "../../middlewares/verify-token/index"

const router = Router()

router.post("/", verifyAdminAndManager, createService)
router.get("/", getAllService)
router.patch("/:id", verifyAdminAndManager, updateService)
router.delete("/:id", verifyAdminAndManager, deleteService)

export default router

import { Router } from "express"
import {
  createVacancy,
  deleteVacancy,
  getAllVacancies,
  getVacancyById,
  updateVacancy,
} from "../../controllers/vacancy"
import { verifyAdminAndManager } from "../../middlewares/verify-token"

const router = Router()

router.post("/", verifyAdminAndManager, createVacancy)
router.get("/", getAllVacancies)
router.get("/:id", getVacancyById)
router.patch("/:id", verifyAdminAndManager, updateVacancy)
router.delete("/:id", verifyAdminAndManager, deleteVacancy)

export default router

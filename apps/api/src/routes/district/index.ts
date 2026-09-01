import { Router } from "express"
import {
  createDistrict,
  deleteDistrict,
  getAllDistricts,
  getDistrictById,
  updateDistrict,
} from "../../controllers/district"
import { verifySuperAdmin } from "../../middlewares/verify-token/index"

const router = Router()

router.get("/", getAllDistricts)
router.get("/:id", getDistrictById)
router.post("/", verifySuperAdmin, createDistrict)
router.patch("/:id", verifySuperAdmin, updateDistrict)
router.delete("/:id", verifySuperAdmin, deleteDistrict)

export default router

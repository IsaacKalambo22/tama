import { Router } from "express"
import {
  createCouncil,
  deleteCouncil,
  getAllCouncils,
  getCouncilById,
  getCouncilDistricts,
  updateCouncil,
} from "../../controllers/council"
import {
  verifySuperAdmin,
  verifyToken,
} from "../../middlewares/verify-token/index"

const router = Router()

router.get("/", verifyToken, getAllCouncils)
router.get("/:id", verifyToken, getCouncilById)
router.get("/:id/districts", verifyToken, getCouncilDistricts)
router.post("/", verifySuperAdmin, createCouncil)
router.patch("/:id", verifySuperAdmin, updateCouncil)
router.delete("/:id", verifySuperAdmin, deleteCouncil)

export default router

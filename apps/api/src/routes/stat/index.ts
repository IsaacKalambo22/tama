import { Router } from "express"
import {
  createStat,
  deleteStat,
  getStat,
  updateStat,
} from "../../controllers/stat"
import { verifyAdminAndManager } from "../../middlewares/verify-token/index"

const router = Router()

router.post(
  "/",
  verifyAdminAndManager, // Admin and Manager authorization
  createStat
)

router.get("/", getStat)

router.patch(
  "/:id",
  verifyAdminAndManager, // Admin and Manager authorization
  updateStat
)

router.delete(
  "/:id",
  verifyAdminAndManager, // Admin and Manager authorization
  deleteStat
)

export default router

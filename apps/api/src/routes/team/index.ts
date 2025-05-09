import { Router } from "express"
import {
  createTeam,
  deleteTeam,
  getTeam,
  getTeamById,
  updateTeam,
} from "../../controllers/team"
import { verifyAdminAndManager } from "../../middlewares/verify-token"

const router = Router()

router.post("/", verifyAdminAndManager, createTeam)
router.get("/", getTeam)
router.get("/:id", getTeamById)
router.patch("/:id", verifyAdminAndManager, updateTeam)
router.delete("/:id", verifyAdminAndManager, deleteTeam)

export default router

import { Router } from "express"
import {
  createCouncilList,
  deleteCouncilList,
  getAllCouncilLists,
  getCouncilListsByScope,
  updateCouncilList,
} from "../../controllers/council-list"
import { verifyScope } from "../../middlewares/verify-scope/index"
import {
  verifySuperAdmin,
  verifyToken,
} from "../../middlewares/verify-token/index"

const router = Router()

router.get("/", getAllCouncilLists)
router.get("/scoped", verifyToken, getCouncilListsByScope)
router.post("/", verifySuperAdmin, createCouncilList)
router.patch(
  "/:id",
  verifyToken,
  verifyScope({ resourceType: "councilList" }),
  updateCouncilList
)
router.delete(
  "/:id",
  verifyToken,
  verifyScope({ resourceType: "councilList" }),
  deleteCouncilList
)

export default router

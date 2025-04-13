import { Router } from "express"
import {
  createShop,
  deleteShop,
  getAllShops,
  updateShop,
} from "../../controllers/shop"
import { verifyAdminAndManager } from "../../middlewares/verify-token/index"

const router = Router()

router.post("/", verifyAdminAndManager, createShop)
router.get("/", getAllShops)
router.patch("/:id", verifyAdminAndManager, updateShop)
router.delete("/:id", verifyAdminAndManager, deleteShop)

export default router

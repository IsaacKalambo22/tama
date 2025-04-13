import { Router } from "express"
import {
  createCarousel,
  createImageText,
  deleteCarousel,
  deleteImageText,
  getCarousel,
  getHomeData,
  getImageText,
  updateCarousel,
  updateImageText,
} from "../../controllers/home"
import { verifyAdminAndManager } from "../../middlewares/verify-token/index"

const router = Router()

router.post("/carousel", verifyAdminAndManager, createCarousel)
router.get("/carousel", getCarousel)
router.get("/", getHomeData)
router.patch("/carousel/:id", verifyAdminAndManager, updateCarousel)
router.delete("/carousel/:id", verifyAdminAndManager, deleteCarousel)

router.post("/image-text", verifyAdminAndManager, createImageText)
router.get("/image-text", getImageText)
router.patch("/image-text/:id", verifyAdminAndManager, updateImageText)
router.delete("/image-text/:id", verifyAdminAndManager, deleteImageText)

export default router

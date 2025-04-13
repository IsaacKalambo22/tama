import { Router } from "express"
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
} from "../../controllers/blog"
import { verifyAdminAndManager } from "../../middlewares/verify-token/index"

const router = Router()

router.post("/", verifyAdminAndManager, createBlog)
router.get("/", getAllBlogs)
router.get("/:id", getBlogById)
router.patch("/:id", verifyAdminAndManager, updateBlog)
router.delete("/:id", verifyAdminAndManager, deleteBlog)

export default router

import { Router } from 'express';
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
} from '../../controllers/blog';
import { verifyToken } from '../../middlewares/verify-token/index';

const router = Router();

router.post('/', verifyToken, createBlog);
router.get('/', getAllBlogs);
router.get('/:id', getBlogById);
router.patch('/:id', verifyToken, updateBlog);
router.delete('/:id', verifyToken, deleteBlog);

export default router;

import { Router } from 'express';
import {
  createBlog,
  getAllBlogs,
  updateBlog,
} from '../../controllers/blog';
import { verifyToken } from '../../middlewares/verify-token/index';

const router = Router();

router.post('/', verifyToken, createBlog);
router.get('/', getAllBlogs);
router.patch('/:id', verifyToken, updateBlog);

export default router;

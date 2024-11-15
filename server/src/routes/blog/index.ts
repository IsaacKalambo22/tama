import { Router } from 'express';
import {
  createBlog,
  getAllBlogs,
} from '../../controllers/blog';
import { verifyToken } from '../../middlewares/verify-token/index';

const router = Router();

router.post('/', verifyToken, createBlog);
router.get('/', getAllBlogs);

export default router;

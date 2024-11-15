import { Router } from 'express';
import { createBlog } from '../../controllers/blog';
import { verifyToken } from '../../middlewares/verify-token/index';

const router = Router();

router.post('/', verifyToken, createBlog);

export default router;

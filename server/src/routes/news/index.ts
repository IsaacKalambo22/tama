import { Router } from 'express';
import {
  createNews,
  getAllNews,
  getNewsById,
} from '../../controllers/news';
import { verifyToken } from '../../middlewares/verify-token/index';

const router = Router();

router.post('/', verifyToken, createNews);
router.get('/', getAllNews);
router.get('/:id', getNewsById);

export default router;

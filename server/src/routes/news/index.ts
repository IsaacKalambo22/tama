import { Router } from 'express';
import {
  createNews,
  getAllNews,
  getNewsById,
  updateNews,
} from '../../controllers/news';
import { verifyToken } from '../../middlewares/verify-token/index';

const router = Router();

router.post('/', verifyToken, createNews);
router.get('/', getAllNews);
router.get('/:id', getNewsById);
router.patch('/:id', updateNews);

export default router;

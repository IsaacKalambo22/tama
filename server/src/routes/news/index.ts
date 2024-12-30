import { Router } from 'express';
import {
  createNews,
  deleteNews,
  getAllNews,
  getNewsById,
  updateNews,
} from '../../controllers/news';
import { verifyAdminAndManager } from '../../middlewares/verify-token/index';

const router = Router();

router.post(
  '/',
  verifyAdminAndManager,
  createNews
);
router.get('/', getAllNews);
router.get('/:id', getNewsById);
router.patch(
  '/:id',
  verifyAdminAndManager,
  updateNews
);
router.delete(
  '/:id',
  verifyAdminAndManager,
  deleteNews
);

export default router;

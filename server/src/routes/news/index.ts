import { Router } from 'express';
import {
  createNews,
<<<<<<< HEAD
  deleteNews,
  getAllNews,
  getNewsById,
  updateNews,
=======
  getAllNews,
>>>>>>> 9a3f3d0 (get all news)
} from '../../controllers/news';
import { verifyToken } from '../../middlewares/verify-token/index';

const router = Router();

router.post('/', verifyToken, createNews);
<<<<<<< HEAD
router.get('/', getAllNews);
router.get('/:id', getNewsById);
router.patch('/:id', verifyToken, updateNews);
router.delete('/:id', verifyToken, deleteNews);
=======
router.get('/', verifyToken, getAllNews);
>>>>>>> 9a3f3d0 (get all news)

export default router;

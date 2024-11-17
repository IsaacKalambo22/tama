import { Router } from 'express';
import {
  createShop,
  deleteShop,
  getAllShops,
  updateShop,
} from '../../controllers/shop';
import { verifyToken } from '../../middlewares/verify-token/index';

const router = Router();

router.post('/', verifyToken, createShop);
router.get('/', getAllShops);
router.patch('/:id', verifyToken, updateShop);
router.delete('/:id', verifyToken, deleteShop);

export default router;

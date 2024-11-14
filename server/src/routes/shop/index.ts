import { Router } from 'express';
import {
  createShop,
  deleteShop,
  getAllShops,
  updateShop,
} from '../../controllers/shop';
import { verifyAdmin } from '../../middlewares/verify-token/index';

const router = Router();

router.post('/', verifyAdmin, createShop);
router.get('/', getAllShops);
router.patch('/:id', verifyAdmin, updateShop);
router.delete('/:id', verifyAdmin, deleteShop);

export default router;

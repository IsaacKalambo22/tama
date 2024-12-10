import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
} from '../../controllers/user';
import { verifyToken } from '../../middlewares/verify-token';

const router = Router();

router.get('/', verifyToken, getAllUsers);
router.get('/:id', verifyToken, getUserById);

export default router;

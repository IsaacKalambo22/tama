import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
} from '../../controllers/user';
import { verifyToken } from '../../middlewares/verify-token';

const router = Router();

router.get('/', verifyToken, getAllUsers);
router.get('/:id', verifyToken, getUserById);
router.patch('/:id', verifyToken, updateUser);

export default router;

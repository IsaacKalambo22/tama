import { Router } from 'express';
import {
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from '../../controllers/user';
import { verifyToken } from '../../middlewares/verify-token';

const router = Router();

router.get('/', verifyToken, getAllUsers);
router.get('/:id', verifyToken, getUserById);
router.patch('/:id', verifyToken, updateUser);
router.delete('/:id', verifyToken, deleteUser);

export default router;

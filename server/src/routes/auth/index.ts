import { Router } from 'express';
import {
  login,
  registerUser,
} from '../../controllers/auth';
import { verifyAdmin } from '../../middlewares/verify-token';

const router = Router();

router.post(
  '/register',
  verifyAdmin,
  registerUser
);
router.post('/login', login);

export default router;

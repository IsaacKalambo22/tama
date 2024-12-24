import { Router } from 'express';
import {
  login,
  registerUser,
  setPassword,
} from '../../controllers/auth';
import { verifyAdmin } from '../../middlewares/verify-token';

const router = Router();

router.post(
  '/register',
  verifyAdmin,
  registerUser
);
router.post('/login', login);
router.post('/set-password', setPassword);

export default router;

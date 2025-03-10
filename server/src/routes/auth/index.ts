import { Router } from 'express';
import {
  forgotPassword,
  login,
  registerUser,
  resetPassword,
  setPassword,
} from '../../controllers/auth';

const router = Router();

router.post(
  '/sign-up',
  // verifyAdmin,
  registerUser
);
router.post('/login', login);
router.post('/set-password', setPassword);
router.post('/reset-password', resetPassword);
router.post('/forgot-password', forgotPassword);

export default router;

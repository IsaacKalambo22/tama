import { Router } from 'express';
import {
  createReportAndPublication,
  deleteReportAndPublication,
  getAllReportsAndPublications,
  updateReportAndPublication,
} from '../../controllers/reports-publications';
import { verifyToken } from '../../middlewares/verify-token/index';

const router = Router();

router.post(
  '/',
  verifyToken,
  createReportAndPublication
);
router.get('/', getAllReportsAndPublications);
router.patch(
  '/:id',
  verifyToken,
  updateReportAndPublication
);
router.delete(
  '/:id',
  verifyToken,
  deleteReportAndPublication
);

export default router;

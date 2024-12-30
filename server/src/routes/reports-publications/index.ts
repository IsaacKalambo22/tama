import { Router } from 'express';
import {
  createReportAndPublication,
  deleteReportAndPublication,
  getAllReportsAndPublications,
  updateReportAndPublication,
} from '../../controllers/reports-publications';
import { verifyAdminAndManager } from '../../middlewares/verify-token/index';

const router = Router();

router.post(
  '/',
  verifyAdminAndManager,
  createReportAndPublication
);
router.get('/', getAllReportsAndPublications);
router.patch(
  '/:id',
  verifyAdminAndManager,
  updateReportAndPublication
);
router.delete(
  '/:id',
  verifyAdminAndManager,
  deleteReportAndPublication
);

export default router;

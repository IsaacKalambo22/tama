import { Router } from 'express';
import {
  createCouncilList,
  deleteCouncilList,
  getAllCouncilLists,
  updateCouncilList,
} from '../../controllers/council-list';
import { verifyAdminAndManager } from '../../middlewares/verify-token/index';

const router = Router();

router.post(
  '/',
  verifyAdminAndManager,
  createCouncilList
);
router.get('/', getAllCouncilLists);
router.patch(
  '/:id',
  verifyAdminAndManager,
  updateCouncilList
);
router.delete(
  '/:id',
  verifyAdminAndManager,
  deleteCouncilList
);

export default router;

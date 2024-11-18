import { Router } from 'express';
import {
  createCouncilList,
  deleteCouncilList,
  updateCouncilList,
} from '../../controllers/council-list';
import { verifyToken } from '../../middlewares/verify-token/index';

const router = Router();

router.post('/', verifyToken, createCouncilList);
router.get('/', createCouncilList);
router.patch(
  '/:id',
  verifyToken,
  updateCouncilList
);
router.delete(
  '/:id',
  verifyToken,
  deleteCouncilList
);

export default router;

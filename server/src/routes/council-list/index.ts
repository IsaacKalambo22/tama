import { Router } from 'express';
<<<<<<< HEAD
import {
  createCouncilList,
  deleteCouncilList,
  updateCouncilList,
} from '../../controllers/council-list';
=======
import { createCouncilList } from '../../controllers/council-list';
>>>>>>> 64fdc74 (create council list)
import { verifyToken } from '../../middlewares/verify-token/index';

const router = Router();

router.post('/', verifyToken, createCouncilList);
<<<<<<< HEAD
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
=======
>>>>>>> 64fdc74 (create council list)

export default router;

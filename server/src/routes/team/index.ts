import { Router } from 'express';
import {
  createTeam,
  deleteTeam,
  getTeam,
  updateTeam,
} from '../../controllers/team';
import { verifyAdminAndManager } from '../../middlewares/verify-token';

const router = Router();

router.post('/', verifyAdminAndManager, createTeam);
router.get('/', verifyAdminAndManager, getTeam);
router.patch('/:id', verifyAdminAndManager, updateTeam);
router.delete('/:id', verifyAdminAndManager, deleteTeam);

export default router;

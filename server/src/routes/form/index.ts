import { Router } from 'express';
import {
  createForm,
  deleteForm,
  getAllForms,
  updateForm,
} from '../../controllers/form';
import { verifyToken } from '../../middlewares/verify-token/index';

const router = Router();

router.post('/', verifyToken, createForm);
router.get('/', getAllForms);
router.patch('/:id', verifyToken, updateForm);
router.delete('/:id', verifyToken, deleteForm);

export default router;

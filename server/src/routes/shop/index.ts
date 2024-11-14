import { Router } from 'express';
import { createShop } from '../../controllers/shop';

const router = Router();

router.post('/', createShop);

export default router;

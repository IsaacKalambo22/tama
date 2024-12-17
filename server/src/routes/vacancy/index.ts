import { Router } from 'express';
import {
    createVacancy,
    deleteVacancy,
    getAllVacancies,
    getVacancyById,
    updateVacancy,
} from '../../controllers/vacancy';

const router = Router();

router.post('/', createVacancy);
router.get('/', getAllVacancies);
router.get('/:id', getVacancyById);
router.put('/:id', updateVacancy);
router.delete('/:id', deleteVacancy);

export default router;

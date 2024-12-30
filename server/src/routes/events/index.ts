import { Router } from 'express';
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  updateEvent,
} from '../../controllers/events';
import { verifyAdminAndManager } from '../../middlewares/verify-token';

const router = Router();

router.post(
  '/',
  verifyAdminAndManager,
  createEvent
); // Create a new event
router.get('/', getAllEvents); // Get all events
router.get('/:id', getEventById); // Get a specific event by ID
router.put(
  '/:id',
  verifyAdminAndManager,
  updateEvent
); // Update a specific event
router.delete(
  '/:id',
  verifyAdminAndManager,
  deleteEvent
); // Delete a specific event

export default router;

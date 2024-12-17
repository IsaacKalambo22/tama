import { Router } from 'express';
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  updateEvent,
} from '../../controllers/events';

const router = Router();

router.post('/', createEvent); // Create a new event
router.get('/', getAllEvents); // Get all events
router.get('/:id', getEventById); // Get a specific event by ID
router.put('/:id', updateEvent); // Update a specific event
router.delete('/:id', deleteEvent); // Delete a specific event

export default router;

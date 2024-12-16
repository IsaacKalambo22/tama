import { Router } from 'express';
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  updateEvent,
} from '../../controllers/events';

const router = Router();

router.post('/events', createEvent); // Create a new event
router.get('/events', getAllEvents); // Get all events
router.get('/events/:id', getEventById); // Get a specific event by ID
router.put('/events/:id', updateEvent); // Update a specific event
router.delete('/events/:id', deleteEvent); // Delete a specific event

export default router;

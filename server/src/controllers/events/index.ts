import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { APIResponse } from '../../types';

const prisma = new PrismaClient();

// Create an Event
export const createEvent = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { title, description, date, imageUrl } =
    req.body;

  // Validate input
  if (
    !title ||
    !description ||
    !date ||
    !imageUrl
  ) {
    res.status(400).json({
      success: false,
      message:
        'All fields are required: title, description, date, imageUrl, and location.',
      error: 'Validation error',
    });
    return;
  }

  try {
    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
      },
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: newEvent,
    });
  } catch (error: any) {
    console.error(
      'Error creating event:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while creating the event.',
      error: error.message,
    });
  }
};

// Get All Events
export const getAllEvents = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  try {
    const events = await prisma.event.findMany();
    res.status(200).json({
      success: true,
      message: 'Events retrieved successfully',
      data: events,
    });
  } catch (error: any) {
    console.error(
      'Error fetching events:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while fetching events.',
      error: error.message,
    });
  }
};

// Get Event by ID
export const getEventById = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      success: false,
      message: 'Event ID is required.',
      error: 'Validation error',
    });
    return;
  }

  try {
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Event retrieved successfully',
      data: event,
    });
  } catch (error: any) {
    console.error(
      'Error fetching event:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while fetching the event.',
      error: error.message,
    });
  }
};

// Update an Event
export const updateEvent = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params;
  const { title, description, date, location } =
    req.body;

  if (!id) {
    res.status(400).json({
      success: false,
      message: 'Event ID is required.',
      error: 'Validation error',
    });
    return;
  }

  try {
    const existingEvent =
      await prisma.event.findUnique({
        where: { id },
      });

    if (!existingEvent) {
      res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
      return;
    }

    const updatedEvent =
      await prisma.event.update({
        where: { id },
        data: {
          title:
            title?.trim() || existingEvent.title,
          description:
            description?.trim() ||
            existingEvent.description,
          date: date
            ? new Date(date)
            : existingEvent.date,

          location:
            location?.trim() ||
            existingEvent.location,
        },
      });

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent,
    });
  } catch (error: any) {
    console.error(
      'Error updating event:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while updating the event.',
      error: error.message,
    });
  }
};

// Delete an Event
export const deleteEvent = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      success: false,
      message: 'Event ID is required.',
      error: 'Validation error',
    });
    return;
  }

  try {
    const existingEvent =
      await prisma.event.findUnique({
        where: { id },
      });

    if (!existingEvent) {
      res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
      return;
    }

    await prisma.event.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error: any) {
    console.error(
      'Error deleting event:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while deleting the event.',
      error: error.message,
    });
  }
};

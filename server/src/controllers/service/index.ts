import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { APIResponse } from '../../types';

const prisma = new PrismaClient();

export const createService = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { title, imageUrl, description } =
    req.body;

  // Validate input
  if (!title || !imageUrl || !description) {
    res.status(400).json({
      success: false,
      message:
        'Title, description, & image URLs are required.',
      error: 'Validation error',
    });
    return;
  }

  try {
    // Create the new service
    const newService =
      await prisma.service.create({
        data: {
          title,
          imageUrl,
          description,
        },
      });

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: newService,
    });
  } catch (error: any) {
    console.error(
      'Error creating service:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while creating the service. Please try again later.',
      error: error.message,
    });
  }
};

export const getAllService = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  try {
    const service = await prisma.service.findMany(
      {
        orderBy: { createdAt: 'desc' },
      }
    );

    res.status(200).json({
      success: true,
      message: 'Service retrieved successfully',
      data: service,
    });
  } catch (error: any) {
    console.error(
      'Error fetching service:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while fetching service. Please try again later.',
      error: error.message,
    });
  }
};

export const updateService = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params;
  const { title, imageUrl, description } =
    req.body;

  if (!id) {
    res.status(400).json({
      success: false,
      message: 'Service ID is required.',
      error: 'Validation error',
    });
    return;
  }

  try {
    const existingService =
      await prisma.service.findUnique({
        where: { id },
      });

    if (!existingService) {
      res.status(404).json({
        success: false,
        message: 'Service not found.',
      });
      return;
    }

    const updatedData: any = {
      title:
        title?.trim() || existingService.title,
      description:
        description?.trim() ||
        existingService.description,
      imageUrl:
        imageUrl?.trim() ||
        existingService.imageUrl,
    };

    const updatedService =
      await prisma.service.update({
        where: { id },
        data: updatedData,
      });

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: updatedService,
    });
  } catch (error: any) {
    console.error(
      'Error updating service:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while updating the service. Please try again later.',
      error: error.message,
    });
  }
};

export const deleteService = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      success: false,
      message: 'Service ID is required.',
      error: 'Validation error',
    });
    return;
  }

  try {
    const existingService =
      await prisma.service.findUnique({
        where: { id },
      });

    if (!existingService) {
      res.status(404).json({
        success: false,
        message: 'Service not found.',
      });
      return;
    }

    await prisma.service.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error: any) {
    console.error(
      'Error deleting service:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while deleting the service. Please try again later.',
      error: error.message,
    });
  }
};

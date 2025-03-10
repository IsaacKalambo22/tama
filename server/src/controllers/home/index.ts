import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { APIResponse } from '../../types';

const prisma = new PrismaClient();

export const createCarousel = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { title, coverUrl, description } =
    req.body;

  // Validate input
  if (!title || !coverUrl || !description) {
    res.status(400).json({
      success: false,
      message:
        'Title, description, & cover URL are required.',
      error: 'Validation error',
    });
    return;
  }

  try {
    // Create the new carousel
    const newCarousel =
      await prisma.carousel.create({
        data: {
          title,
          coverUrl,
          description,
        },
      });

    res.status(201).json({
      success: true,
      message: 'Carousel created successfully',
      data: newCarousel,
    });
  } catch (error: any) {
    console.error(
      'Error creating carousel:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while creating the carousel. Please try again later.',
      error: error.message,
    });
  }
};

export const getCarousel = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  try {
    const carousel =
      await prisma.carousel.findMany();

    res.status(200).json({
      success: true,
      message: 'Carousel retrieved successfully',
      data: carousel,
    });
  } catch (error: any) {
    console.error(
      'Error fetching carousel:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while fetching carousel. Please try again later.',
      error: error.message,
    });
  }
};

export const getHomeData = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  try {
    const carousel =
      await prisma.carousel.findMany();
    const imageText =
      await prisma.imageText.findMany();

    res.status(200).json({
      success: true,
      message:
        'Carousel & image text retrieved successfully',
      data: { carousel, imageText },
    });
  } catch (error: any) {
    console.error(
      'Error fetching carousel & image text:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while fetching carousel & image text. Please try again later.',
      error: error.message,
    });
  }
};

export const updateCarousel = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params;
  const { title, coverUrl, description } =
    req.body;

  if (!id) {
    res.status(400).json({
      success: false,
      message: 'Carousel ID is required.',
      error: 'Validation error',
    });
    return;
  }

  try {
    const existingCarousel =
      await prisma.carousel.findUnique({
        where: { id },
      });

    if (!existingCarousel) {
      res.status(404).json({
        success: false,
        message: 'Carousel not found.',
      });
      return;
    }

    const updatedData: any = {
      title:
        title?.trim() || existingCarousel.title,
      description:
        description?.trim() ||
        existingCarousel.description,
      coverUrl:
        coverUrl?.trim() ||
        existingCarousel.coverUrl,
    };

    const updatedCarousel =
      await prisma.carousel.update({
        where: { id },
        data: updatedData,
      });

    res.status(200).json({
      success: true,
      message: 'Carousel updated successfully',
      data: updatedCarousel,
    });
  } catch (error: any) {
    console.error(
      'Error updating carousel:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while updating the carousel. Please try again later.',
      error: error.message,
    });
  }
};

export const deleteCarousel = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      success: false,
      message: 'Carousel ID is required.',
      error: 'Validation error',
    });
    return;
  }

  try {
    const existingCarousel =
      await prisma.carousel.findUnique({
        where: { id },
      });

    if (!existingCarousel) {
      res.status(404).json({
        success: false,
        message: 'Carousel not found.',
      });
      return;
    }

    await prisma.carousel.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Carousel deleted successfully',
    });
  } catch (error: any) {
    console.error(
      'Error deleting carousel:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while deleting the carousel. Please try again later.',
      error: error.message,
    });
  }
};

export const createImageText = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { heading, imageUrl, description } =
    req.body;

  // Validate input
  if (!heading || !imageUrl || !description) {
    res.status(400).json({
      success: false,
      message:
        'Heading, description, & cover URL are required.',
      error: 'Validation error',
    });
    return;
  }

  try {
    // Create the new imageText
    const newImageText =
      await prisma.imageText.create({
        data: {
          heading,
          imageUrl,
          description,
        },
      });

    res.status(201).json({
      success: true,
      message: 'ImageText created successfully',
      data: newImageText,
    });
  } catch (error: any) {
    console.error(
      'Error creating imageText:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while creating the imageText. Please try again later.',
      error: error.message,
    });
  }
};

export const getImageText = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  try {
    const imageText =
      await prisma.imageText.findMany();

    res.status(200).json({
      success: true,
      message: 'ImageText retrieved successfully',
      data: imageText,
    });
  } catch (error: any) {
    console.error(
      'Error fetching imageText:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while fetching imageText. Please try again later.',
      error: error.message,
    });
  }
};

export const updateImageText = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params;
  const { heading, imageUrl, description } =
    req.body;

  if (!id) {
    res.status(400).json({
      success: false,
      message: 'ImageText ID is required.',
      error: 'Validation error',
    });
    return;
  }

  try {
    const existingImageText =
      await prisma.imageText.findUnique({
        where: { id },
      });

    if (!existingImageText) {
      res.status(404).json({
        success: false,
        message: 'ImageText not found.',
      });
      return;
    }

    const updatedData: any = {
      heading:
        heading?.trim() ||
        existingImageText.heading,
      description:
        description?.trim() ||
        existingImageText.description,
      imageUrl:
        imageUrl?.trim() ||
        existingImageText.imageUrl,
    };

    const updatedImageText =
      await prisma.imageText.update({
        where: { id },
        data: updatedData,
      });

    res.status(200).json({
      success: true,
      message: 'ImageText updated successfully',
      data: updatedImageText,
    });
  } catch (error: any) {
    console.error(
      'Error updating imageText:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while updating the imageText. Please try again later.',
      error: error.message,
    });
  }
};

export const deleteImageText = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      success: false,
      message: 'ImageText ID is required.',
      error: 'Validation error',
    });
    return;
  }

  try {
    const existingImageText =
      await prisma.imageText.findUnique({
        where: { id },
      });

    if (!existingImageText) {
      res.status(404).json({
        success: false,
        message: 'ImageText not found.',
      });
      return;
    }

    await prisma.imageText.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'ImageText deleted successfully',
    });
  } catch (error: any) {
    console.error(
      'Error deleting imageText:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while deleting the imageText. Please try again later.',
      error: error.message,
    });
  }
};

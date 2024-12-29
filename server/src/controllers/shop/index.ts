import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { APIResponse } from '../../types';

const prisma = new PrismaClient();

export const createShop = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { name, imageUrl, address, openHours } =
    req.body;

  // Validate input
  if (
    !name ||
    !imageUrl ||
    !address ||
    !openHours
  ) {
    res.status(400).json({
      success: false,
      message:
        'Name, address, and open hours are required.',
      error: 'Validation error',
    });
    return;
  }

  try {
    // Create the new shop
    const newShop = await prisma.shop.create({
      data: {
        name,
        imageUrl,
        address,
        openHours,
      },
    });

    // Respond with success
    res.status(201).json({
      success: true,
      message: 'Shop created successfully',
      data: newShop,
    });
  } catch (error: any) {
    console.error(
      'Error creating shop:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while creating the shop. Please try again later.',
      error: error.message,
    });
  }
};

export const getAllShops = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  try {
    // Fetch all shops from the database sorted by createdAt
    const shops = await prisma.shop.findMany({
      orderBy: { createdAt: 'asc' }, // Sort by createdAt in ascending order
    });

    // Respond with success
    res.status(200).json({
      success: true,
      message: 'Shops retrieved successfully',
      data: shops,
    });
  } catch (error: any) {
    console.error(
      'Error fetching shops:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while fetching shops. Please try again later.',
      error: error.message,
    });
  }
};

export const updateShop = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params;
  const { name, imageUrl, address, openHours } =
    req.body;
  console.log(req.body);

  // Validate input
  if (!id) {
    res.status(400).json({
      success: false,
      message: 'Shop ID is required.',
      error: 'Validation error',
    });
    return;
  }

  try {
    // Check if the shop exists
    const existingShop =
      await prisma.shop.findUnique({
        where: { id },
      });

    if (!existingShop) {
      res.status(404).json({
        success: false,
        message: 'Shop not found.',
      });
      return;
    }
    // Prepare updated data, ignoring empty strings
    const updatedData = {
      name:
        name?.trim() === ''
          ? existingShop.name
          : name,
      imageUrl:
        imageUrl?.trim() === ''
          ? existingShop.imageUrl
          : imageUrl,
      address:
        address?.trim() === ''
          ? existingShop.address
          : address,
      openHours:
        openHours?.trim() === ''
          ? existingShop.openHours
          : openHours,
    };

    // Update the shop details
    const updatedShop = await prisma.shop.update({
      where: { id },
      data: updatedData,
    });
    // Respond with success
    res.status(200).json({
      success: true,
      message: 'Shop updated successfully',
      data: updatedShop,
    });
  } catch (error: any) {
    console.error(
      'Error updating shop:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while updating the shop. Please try again later.',
      error: error.message,
    });
  }
};

export const deleteShop = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params;

  // Validate input
  if (!id) {
    res.status(400).json({
      success: false,
      message: 'Shop ID is required.',
      error: 'Validation error',
    });
    return;
  }

  try {
    // Check if the shop exists
    const existingShop =
      await prisma.shop.findUnique({
        where: { id },
      });

    if (!existingShop) {
      res.status(404).json({
        success: false,
        message: 'Shop not found.',
      });
      return;
    }

    // Delete the shop
    await prisma.shop.delete({
      where: { id },
    });

    // Respond with success
    res.status(200).json({
      success: true,
      message: 'Shop deleted successfully',
    });
  } catch (error: any) {
    console.error(
      'Error deleting shop:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while deleting the shop. Please try again later.',
      error: error.message,
    });
  }
};

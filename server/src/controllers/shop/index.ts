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
    // Fetch all shops from the database
    const shops = await prisma.shop.findMany();

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
export const deleteShop = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {};
export const updateShop = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {};

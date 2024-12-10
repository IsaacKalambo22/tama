import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { APIResponse } from '../../types';

const prisma = new PrismaClient();

export const getAllUsers = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  try {
    const users = await prisma.user.findMany();

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users,
    });
  } catch (error: any) {
    console.error(
      'Error fetching users:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while fetching users. Please try again later.',
      error: error.message,
    });
  }
};

export const getUserById = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params;

  // Validate input
  if (!id) {
    res.status(400).json({
      success: false,
      message: 'User ID is required.',
      error: 'Validation error',
    });
    return;
  }

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found.',
      });
      return;
    }

    // Respond with success
    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: user,
    });
  } catch (error: any) {
    console.error(
      'Error fetching users:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while fetching users. Please try again later.',
      error: error.message,
    });
  }
};

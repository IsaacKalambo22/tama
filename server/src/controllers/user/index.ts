import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { APIResponse } from '../../types';

const prisma = new PrismaClient();

export const getAllUsers = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }, // Sort users by most recent creation date
      select: {
        id: true,
        email: true,
        phoneNumber: true,
        name: true,
        role: true,
        lastLogin: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

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

export const updateUser = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params;
  console.log(req.body);
  const {
    name,
    email,
    password,
    role,
    phoneNumber,
    district,
    avatar,
    about,
  } = req.body;

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
    const existingUser =
      await prisma.user.findUnique({
        where: { id },
      });

    if (!existingUser) {
      res.status(404).json({
        success: false,
        message: 'User not found.',
      });
      return;
    }

    // Prepare updated data
    const updatedData: Partial<
      typeof existingUser
    > = {
      name: name?.trim() || existingUser.name,
      district:
        district?.trim() || existingUser.district,
      avatar:
        avatar?.trim() || existingUser.avatar,
      about: about?.trim() || existingUser.about,
      email: email?.trim() || existingUser.email,
      role: role?.trim() || existingUser.role,
      phoneNumber:
        phoneNumber?.trim() ||
        existingUser.phoneNumber,
    };

    // Hash the password if it's being updated
    if (password?.trim()) {
      const saltRounds = 10;
      updatedData.password = await bcrypt.hash(
        password,
        saltRounds
      );
    }

    // Update the user details
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updatedData,
    });

    // Respond with success
    res.status(200).json({
      success: true,
      message: 'User updated successfully.',
      data: updatedUser,
    });
  } catch (error: any) {
    console.error(
      'Error updating user:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while updating the user. Please try again later.',
      error: error.message,
    });
  }
};

export const deleteUser = async (
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
    const existingUser =
      await prisma.user.findUnique({
        where: { id },
      });

    if (!existingUser) {
      res.status(404).json({
        success: false,
        message: 'User not found.',
      });
      return;
    }

    // Delete the user
    await prisma.user.delete({
      where: { id },
    });

    // Respond with success
    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error: any) {
    console.error(
      'Error deleting user:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while deleting the user. Please try again later.',
      error: error.message,
    });
  }
};

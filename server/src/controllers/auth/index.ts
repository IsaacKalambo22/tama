import {
  PrismaClient,
  Role,
} from '@prisma/client';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { APIResponse } from '../../types';

const prisma = new PrismaClient();

export const registerUser = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { name, email, password, role } =
    req.body;

  // Validate user input
  if (!name || !email || !password) {
    res.status(400).json({
      success: false,
      message:
        'Name, email, and password are required.',
    });
    return; // Ensure early exit after sending response
  }

  try {
    // Check if the email already exists
    const existingUser =
      await prisma.user.findUnique({
        where: { email },
      });
    if (existingUser) {
      res.status(409).json({
        success: false,
        message:
          'Email already in use. Please use a different email.',
      });
      return; // Ensure early exit after sending response
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || Role.USER,
      },
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message:
        'An error occurred while creating the user. Please try again later.',
    });
  }
};

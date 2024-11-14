import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const registerUser = async (
  req: Request,
  res: Response
) => {
  const { name, email, password, role } =
    req.body;

  // Validate user input
  if (!name || !email || !password) {
    return res.status(400).json({
      message:
        'Name, email, and password are required.',
    });
  }

  try {
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
        role,
      },
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      }, // Exclude the hashed password
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      // Unique constraint error (e.g., email already exists)
      return res.status(409).json({
        message:
          'Email already in use. Please use a different email.',
      });
    }
    console.error(
      'Error creating user:',
      error.message
    );
    res.status(500).json({
      message:
        'An error occurred while creating the user. Please try again later.',
    });
  } finally {
    await prisma.$disconnect();
  }
};

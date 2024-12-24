import {
  PrismaClient,
  Role,
} from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Request, Response } from 'express';
import { setPasswordRequestEmail } from '../../mailtrap/emails';
import { APIResponse } from '../../types';
import { generateTokens } from '../../utils/generate-tokens';

const prisma = new PrismaClient();

export const registerUser = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const {
    name,
    email,
    password,
    role,
    phoneNumber,
  } = req.body;

  // Validate user input
  if (
    !name ||
    !email ||
    !password ||
    !phoneNumber
  ) {
    res.status(400).json({
      success: false,
      message:
        'Name, email, phoneNumber and password are required.',
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

    const verificationToken = crypto
      .randomBytes(32)
      .toString('hex');

    const hashedToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');

    const verificationTokenExpiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    ); // 24 hours from now

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phoneNumber,
        password: hashedPassword,
        role: role || Role.USER,
        verificationToken: hashedToken,
        verificationTokenExpiresAt, // 24 hours
      },
    });
    // await sendVerificationEmail(
    //   email,
    //   verificationToken
    // );
    // await sendVerificationEmail(
    //   email,
    //   verificationToken
    // );
    await setPasswordRequestEmail(
      email,
      `${process.env.CLIENT_BASE_URL}/set-password/${verificationToken}`
    );

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

export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  // Validate user input
  if (!email || !password) {
    res.status(400).json({
      success: false,
      message: 'Email and password are required.',
    });
    return;
  }

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message:
          'User not found. Please check your email.',
      });
      return;
    }

    // Compare the provided password with the stored hash
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message:
          'Invalid credentials. Please check your password.',
      });
      return;
    }

    const { access_token, refresh_token } =
      generateTokens(
        user.id,
        user.email,
        user.role
      );

    // Update the user's last login timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });
    // Set the refresh token as an HTTP-only cookie for secure token refreshing
    res.cookie('jwt-refresh', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: true,
      maxAge: 1000 * 60 * 60 * 1,
    });

    // Return a success response with the generated token
    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken: access_token,
      },
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({
      success: false,
      message:
        'An error occurred while logging in. Please try again later.',
    });
  }
};

export const setPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { verificationToken, password } =
    req.body;

  // Validate input
  if (!verificationToken || !password) {
    res.status(400).json({
      success: false,
      message:
        'Token and new password are required.',
    });
    return;
  }

  try {
    // Hash the token to match database storage
    const hashedToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');

    // Find the user with the matching token and ensure it's not expired
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: hashedToken,
        verificationTokenExpiresAt: {
          gte: new Date(), // Ensure the token has not expired
        },
      },
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: 'Invalid or expired token.',
      });
      return;
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Update the user's record
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        verificationToken: null, // Clear the token
        verificationTokenExpiresAt: null,
      },
    });

    // Return success response
    res.status(200).json({
      success: true,
      message:
        'Password updated successfully. You can now log in.',
    });
  } catch (error) {
    console.error(
      'Error updating password:',
      error
    );

    res.status(500).json({
      success: false,
      message:
        'An error occurred while updating the password. Please try again later.',
    });
  }
};

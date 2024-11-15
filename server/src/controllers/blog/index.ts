import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { APIResponse } from '../../types';

const prisma = new PrismaClient();

export const createBlog = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { title, content, imageUrl, author } =
    req.body;

  // Validate input
  if (
    !title ||
    !imageUrl ||
    !content ||
    !author
  ) {
    res.status(400).json({
      success: false,
      message:
        'Title, content, imageUrl, and author are required.',
      error: 'Validation error',
    });
    return;
  }

  try {
    // Create the new blog
    const newBlog = await prisma.blog.create({
      data: {
        title,
        content,
        imageUrl,
        author,
      },
    });

    // Respond with success
    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: newBlog,
    });
  } catch (error: any) {
    console.error(
      'Error creating blog:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while creating the blog. Please try again later.',
      error: error.message,
    });
  }
};

export const getAllBlogs = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  try {
    // Fetch all blogs from the database
    const blogs = await prisma.blog.findMany();

    // Respond with success
    res.status(200).json({
      success: true,
      message: 'Blogs retrieved successfully',
      data: blogs,
    });
  } catch (error: any) {
    console.error(
      'Error fetching blogs:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while fetching blogs. Please try again later.',
      error: error.message,
    });
  }
};

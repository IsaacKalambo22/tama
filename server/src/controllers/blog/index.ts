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
  console.log(req.body);
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
export const getBlogById = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params;

  // Validate input
  if (!id) {
    res.status(400).json({
      success: false,
      message: 'Blog ID is required.',
      error: 'Validation error',
    });
    return;
  }

  try {
    // Check if the blog exists
    const blog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      res.status(404).json({
        success: false,
        message: 'Blog not found.',
      });
      return;
    }

    // Respond with success
    res.status(200).json({
      success: true,
      message: 'Blog retrieved successfully',
      data: blog,
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

export const updateBlog = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params;
  const { title, content, imageUrl, author } =
    req.body;

  // Validate input
  if (!id) {
    res.status(400).json({
      success: false,
      message: 'Blog ID is required.',
      error: 'Validation error',
    });
    return;
  }

  try {
    // Check if the blog exists
    const existingBlog =
      await prisma.blog.findUnique({
        where: { id },
      });

    if (!existingBlog) {
      res.status(404).json({
        success: false,
        message: 'Blog not found.',
      });
      return;
    }

    // Update the blog details
    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: {
        title: title ?? existingBlog.title,
        imageUrl:
          imageUrl ?? existingBlog.imageUrl,
        content: content ?? existingBlog.content,
        author: author ?? existingBlog.author,
      },
    });

    // Respond with success
    res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      data: updatedBlog,
    });
  } catch (error: any) {
    console.error(
      'Error updating blog:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while updating the blog. Please try again later.',
      error: error.message,
    });
  }
};

export const deleteBlog = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params;

  // Validate input
  if (!id) {
    res.status(400).json({
      success: false,
      message: 'Blog ID is required.',
      error: 'Validation error',
    });
    return;
  }

  try {
    // Check if the blog exists
    const existingBlog =
      await prisma.blog.findUnique({
        where: { id },
      });

    if (!existingBlog) {
      res.status(404).json({
        success: false,
        message: 'Blog not found.',
      });
      return;
    }

    // Delete the blog
    await prisma.blog.delete({
      where: { id },
    });

    // Respond with success
    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully',
    });
  } catch (error: any) {
    console.error(
      'Error deleting blog:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while deleting the blog. Please try again later.',
      error: error.message,
    });
  }
};

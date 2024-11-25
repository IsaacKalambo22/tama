import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { APIResponse } from '../../types';

const prisma = new PrismaClient();

export const createNews = async (
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
    // Calculate reading time
    const calculateReadingTime = (
      text: string
    ): number => {
      const words = text.split(/\s+/).length;
      const wordsPerMinute = 200; // Average reading speed
      return Math.ceil(words / wordsPerMinute);
    };

    const readingTime =
      calculateReadingTime(content);

    // Create the new news
    const newNews = await prisma.news.create({
      data: {
        title,
        content,
        imageUrl,
        author,
        readingTime,
      },
    });

    // Respond with success
    res.status(201).json({
      success: true,
      message: 'News created successfully',
      data: newNews,
    });
  } catch (error: any) {
    console.error(
      'Error creating news:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while creating the news. Please try again later.',
      error: error.message,
    });
  }
};
export const getAllNews = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  try {
    // Fetch all news from the database
    const news = await prisma.news.findMany();

    // Respond with success
    res.status(200).json({
      success: true,
      message: 'News retrieved successfully',
      data: news,
    });
  } catch (error: any) {
    console.error(
      'Error fetching news:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while fetching news. Please try again later.',
      error: error.message,
    });
  }
};

export const getNewsById = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params;

  // Validate input
  if (!id) {
    res.status(400).json({
      success: false,
      message: 'News ID is required.',
      error: 'Validation error',
    });
    return;
  }

  try {
    // Check if the news exists
    const news = await prisma.news.findUnique({
      where: { id },
    });

    if (!news) {
      res.status(404).json({
        success: false,
        message: 'News not found.',
      });
      return;
    }

    // Respond with success
    res.status(200).json({
      success: true,
      message: 'News retrieved successfully',
      data: news,
    });
  } catch (error: any) {
    console.error(
      'Error fetching news:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while fetching news. Please try again later.',
      error: error.message,
    });
  }
};

export const updateNews = async (
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
      message: 'News ID is required.',
      error: 'Validation error',
    });
    return;
  }

  try {
    // Check if the news exists
    const existingNews =
      await prisma.news.findUnique({
        where: { id },
      });

    if (!existingNews) {
      res.status(404).json({
        success: false,
        message: 'News not found.',
      });
      return;
    }

    // Update the news details
    const updatedNews = await prisma.news.update({
      where: { id },
      data: {
        title: title ?? existingNews.title,
        imageUrl:
          imageUrl ?? existingNews.imageUrl,
        content: content ?? existingNews.content,
        author: author ?? existingNews.author,
      },
    });

    // Respond with success
    res.status(200).json({
      success: true,
      message: 'News updated successfully',
      data: updatedNews,
    });
  } catch (error: any) {
    console.error(
      'Error updating news:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while updating the news. Please try again later.',
      error: error.message,
    });
  }
};

export const deleteNews = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params;

  // Validate input
  if (!id) {
    res.status(400).json({
      success: false,
      message: 'News ID is required.',
      error: 'Validation error',
    });
    return;
  }

  try {
    // Check if the news exists
    const existingNews =
      await prisma.news.findUnique({
        where: { id },
      });

    if (!existingNews) {
      res.status(404).json({
        success: false,
        message: 'News not found.',
      });
      return;
    }

    // Delete the news
    await prisma.news.delete({
      where: { id },
    });

    // Respond with success
    res.status(200).json({
      success: true,
      message: 'News deleted successfully',
    });
  } catch (error: any) {
    console.error(
      'Error deleting news:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while deleting the news. Please try again later.',
      error: error.message,
    });
  }
};

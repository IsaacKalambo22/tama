import { Request, Response } from 'express';
import { APIResponse } from '../../types';
import prisma from '../../config';



export const search = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { query } = req.query;
  console.log({ query });

  try {
    const shops = await prisma.shop.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query as string,
              mode: 'insensitive',
            },
          },
          {
            address: {
              contains: query as string,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
    const blogs = await prisma.blog.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query as string,
              mode: 'insensitive',
            },
          },
          {
            content: {
              contains: query as string,
              mode: 'insensitive',
            },
          },
          {
            author: {
              contains: query as string,
              mode: 'insensitive',
            },
          },
        ],
      },
    });

    const news = await prisma.news.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query as string,
              mode: 'insensitive',
            },
          },
          {
            content: {
              contains: query as string,
              mode: 'insensitive',
            },
          },
          {
            author: {
              contains: query as string,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
    const events = await prisma.event.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query as string,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query as string,
              mode: 'insensitive',
            },
          },
          {
            location: {
              contains: query as string,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
    const vacancies =
      await prisma.vacancy.findMany({
        where: {
          OR: [
            {
              title: {
                contains: query as string,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: query as string,
                mode: 'insensitive',
              },
            },
          ],
        },
      });
    const forms = await prisma.form.findMany({
      where: {
        OR: [
          {
            filename: {
              contains: query as string,
              mode: 'insensitive',
            },
          },
        ],
      },
    });

    const publications =
      await prisma.reportAndPublication.findMany({
        where: {
          OR: [
            {
              filename: {
                contains: query as string,
                mode: 'insensitive',
              },
            },
          ],
        },
      });

    res.status(200).json({
      success: true,
      message: 'Data retrieved successfully',
      data: {
        shops,
        blogs,
        news,
        events,
        vacancies,
        forms,
        publications,
      },
    });
  } catch (error: any) {
    console.error(
      'Error fetching searching:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while searching. Please try again later.',
      error: error.message,
    });
  }
};

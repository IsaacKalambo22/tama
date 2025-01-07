import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { APIResponse } from '../../types';

const prisma = new PrismaClient();

export const createReportAndPublication = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const {
    fileUrl,
    filename,
    size,
    type,
    extension,
  } = req.body;
  // Validate input
  if (
    !fileUrl ||
    !filename ||
    !size ||
    !type ||
    !extension
  ) {
    res.status(400).json({
      success: false,
      message:
        'fileUrl, filename, type, extension and size are required.',
      error: 'Validation error',
    });
    return;
  }

  try {
    // Create the new reportAndPublication
    const newReportAndPublication =
      await prisma.reportAndPublication.create({
        data: {
          fileUrl,
          filename,
          type,
          extension,
          size: Number(size),
        },
      });

    // Respond with success
    res.status(201).json({
      success: true,
      message:
        'ReportAndPublication created successfully',
      data: newReportAndPublication,
    });
  } catch (error: any) {
    console.error(
      'Error creating reportAndPublication:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while creating the reportAndPublication. Please try again later.',
      error: error.message,
    });
  }
};

export const getAllReportsAndPublications =
  async (
    req: Request,
    res: Response<APIResponse>
  ): Promise<void> => {
    try {
      // Fetch all reportAndPublication from the database
      const reportAndPublication =
        await prisma.reportAndPublication.findMany(
          {
            orderBy: { createdAt: 'desc' }, // Sort by createdAt in descending order
          }
        );

      // Respond with success
      res.status(200).json({
        success: true,
        message:
          'ReportAndPublication retrieved successfully',
        data: reportAndPublication,
      });
    } catch (error: any) {
      console.error(
        'Error fetching reportAndPublication:',
        error.message
      );
      res.status(500).json({
        success: false,
        message:
          'An error occurred while fetching reportAndPublication. Please try again later.',
        error: error.message,
      });
    }
  };

export const updateReportAndPublication = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params;
  const {
    filename,
    fileUrl,
    size,
    type,
    extension,
  } = req.body;

  // Validate input
  if (!id) {
    res.status(400).json({
      success: false,
      message:
        'ReportAndPublication ID is required.',
      error: 'Validation error',
    });
    return;
  }

  try {
    // Check if the reportAndPublication exists
    const existingReportAndPublication =
      await prisma.reportAndPublication.findUnique(
        {
          where: { id },
        }
      );

    if (!existingReportAndPublication) {
      res.status(404).json({
        success: false,
        message:
          'ReportAndPublication not found.',
      });
      return;
    }

    // Prepare updated data, including only fields provided and valid
    const updatedData: any = {
      filename:
        filename?.trim() === ''
          ? existingReportAndPublication.filename
          : filename,
      fileUrl:
        fileUrl?.trim() === ''
          ? existingReportAndPublication.fileUrl
          : fileUrl,
      type:
        type?.trim() === ''
          ? existingReportAndPublication.type
          : type,
      extension:
        extension?.trim() === ''
          ? existingReportAndPublication.extension
          : extension,
    };

    // Add `size` only if it's provided and valid
    if (size !== undefined && size !== '') {
      updatedData.size = Number(size);
    }

    // Update the reports details
    const updatedReportAndPublication =
      await prisma.reportAndPublication.update({
        where: { id },
        data: updatedData,
      });

    // Respond with success
    res.status(200).json({
      success: true,
      message:
        'ReportAndPublication updated successfully',
      data: updatedReportAndPublication,
    });
  } catch (error: any) {
    console.error(
      'Error updating reportAndPublication:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while updating the reportAndPublication. Please try again later.',
      error: error.message,
    });
  }
};

export const deleteReportAndPublication = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params;

  // Validate input
  if (!id) {
    res.status(400).json({
      success: false,
      message:
        'ReportAndPublication ID is required.',
      error: 'Validation error',
    });
    return;
  }

  try {
    // Check if the reportAndPublication exists
    const existingReportAndPublication =
      await prisma.reportAndPublication.findUnique(
        {
          where: { id },
        }
      );

    if (!existingReportAndPublication) {
      res.status(404).json({
        success: false,
        message:
          'ReportAndPublication not found.',
      });
      return;
    }

    // Delete the reportAndPublication
    await prisma.reportAndPublication.delete({
      where: { id },
    });

    // Respond with success
    res.status(200).json({
      success: true,
      message:
        'ReportAndPublication deleted successfully',
    });
  } catch (error: any) {
    console.error(
      'Error deleting reportAndPublication:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while deleting the reportAndPublication. Please try again later.',
      error: error.message,
    });
  }
};

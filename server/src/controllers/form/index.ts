import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { APIResponse } from '../../types';

const prisma = new PrismaClient();

export const createForm = async (
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
    // Create the new form
    const newForm = await prisma.form.create({
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
      message: 'Form created successfully',
      data: newForm,
    });
  } catch (error: any) {
    console.error(
      'Error creating form:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while creating the form. Please try again later.',
      error: error.message,
    });
  }
};

export const getAllForms = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  try {
    // Fetch all form from the database
    const form = await prisma.form.findMany({
      orderBy: { createdAt: 'desc' }, // Sort by createdAt in descending order
    });

    // Respond with success
    res.status(200).json({
      success: true,
      message: 'Form retrieved successfully',
      data: form,
    });
  } catch (error: any) {
    console.error(
      'Error fetching form:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while fetching form. Please try again later.',
      error: error.message,
    });
  }
};

export const updateForm = async (
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
  console.log('Forms controller', req.body);
  // Validate input
  if (!id) {
    res.status(400).json({
      success: false,
      message: 'Form ID is required.',
      error: 'Validation error',
    });
    return;
  }

  try {
    // Check if the form exists
    const existingForm =
      await prisma.form.findUnique({
        where: { id },
      });

    if (!existingForm) {
      res.status(404).json({
        success: false,
        message: 'Form not found.',
      });
      return;
    }

    // Prepare updated data, including only fields provided and valid
    const updatedData: any = {
      filename:
        filename?.trim() === ''
          ? existingForm.filename
          : filename,
      fileUrl:
        fileUrl?.trim() === ''
          ? existingForm.fileUrl
          : fileUrl,
      type:
        type?.trim() === ''
          ? existingForm.type
          : type,
      extension:
        extension?.trim() === ''
          ? existingForm.extension
          : extension,
    };

    // Add `size` only if it's provided and valid
    if (size !== undefined && size !== '') {
      updatedData.size = Number(size);
    }

    // Update the reports details
    const updatedForm = await prisma.form.update({
      where: { id },
      data: updatedData,
    });

    // Respond with success
    res.status(200).json({
      success: true,
      message: 'Form updated successfully',
      data: updatedForm,
    });
  } catch (error: any) {
    console.error(
      'Error updating form:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while updating the form. Please try again later.',
      error: error.message,
    });
  }
};

export const deleteForm = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params;

  // Validate input
  if (!id) {
    res.status(400).json({
      success: false,
      message: 'Form ID is required.',
      error: 'Validation error',
    });
    return;
  }

  try {
    // Check if the form exists
    const existingForm =
      await prisma.form.findUnique({
        where: { id },
      });

    if (!existingForm) {
      res.status(404).json({
        success: false,
        message: 'Form not found.',
      });
      return;
    }

    // Delete the form
    await prisma.form.delete({
      where: { id },
    });

    // Respond with success
    res.status(200).json({
      success: true,
      message: 'Form deleted successfully',
    });
  } catch (error: any) {
    console.error(
      'Error deleting form:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while deleting the form. Please try again later.',
      error: error.message,
    });
  }
};

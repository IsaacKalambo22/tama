import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { APIResponse } from '../../types';

const prisma = new PrismaClient();

// Create Vacancy
export const createVacancy = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const {
    title,
    description,
    company,
    location,
    status,
    applicationDeadline,
    salary,
    duties,
    qualifications,
    howToApply,
  } = req.body;

  // Validate input
  if (
    !title ||
    !description ||
    !company ||
    !location ||
    !status ||
    !applicationDeadline
  ) {
    res.status(400).json({
      success: false,
      message:
        'Title, description, company, location, status, and application deadline are required.',
      error: 'Validation error',
    });
    return;
  }

  try {
    // Create the new vacancy
    const newVacancy =
      await prisma.vacancy.create({
        data: {
          title,
          description,
          company,
          location,
          status,
          applicationDeadline: new Date(
            applicationDeadline
          ),
          salary,
          duties,
          qualifications,
          howToApply,
        },
      });

    // Respond with success
    res.status(201).json({
      success: true,
      message: 'Vacancy created successfully',
      data: newVacancy,
    });
  } catch (error: any) {
    console.error(
      'Error creating vacancy:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while creating the vacancy. Please try again later.',
      error: error.message,
    });
  }
};

// Get All Vacancies
export const getAllVacancies = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  try {
    // Fetch all vacancies from the database
    const vacancies =
      await prisma.vacancy.findMany({
        orderBy: { createdAt: 'asc' }, // Sort by createdAt in ascending order
      });

    // Respond with success
    res.status(200).json({
      success: true,
      message: 'Vacancies retrieved successfully',
      data: vacancies,
    });
  } catch (error: any) {
    console.error(
      'Error fetching vacancies:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while fetching vacancies. Please try again later.',
      error: error.message,
    });
  }
};

// Get Vacancy By ID
export const getVacancyById = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params;

  // Validate input
  if (!id) {
    res.status(400).json({
      success: false,
      message: 'Vacancy ID is required.',
      error: 'Validation error',
    });
    return;
  }

  try {
    // Fetch the vacancy by its ID
    const vacancy =
      await prisma.vacancy.findUnique({
        where: { id: id },
      });

    if (!vacancy) {
      res.status(404).json({
        success: false,
        message: 'Vacancy not found.',
      });
      return;
    }

    // Respond with success
    res.status(200).json({
      success: true,
      message: 'Vacancy retrieved successfully',
      data: vacancy,
    });
  } catch (error: any) {
    console.error(
      'Error fetching vacancy by ID:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while fetching the vacancy. Please try again later.',
      error: error.message,
    });
  }
};

// Update Vacancy
export const updateVacancy = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params;
  const {
    title,
    description,
    company,
    location,
    status,
    applicationDeadline,
    salary,
    duties,
    qualifications,
    howToApply,
  } = req.body;

  // Validate input
  if (!id) {
    res.status(400).json({
      success: false,
      message: 'Vacancy ID is required.',
      error: 'Validation error',
    });
    return;
  }

  try {
    // Check if the vacancy exists
    const existingVacancy =
      await prisma.vacancy.findUnique({
        where: { id: id },
      });

    if (!existingVacancy) {
      res.status(404).json({
        success: false,
        message: 'Vacancy not found.',
      });
      return;
    }

    // Prepare updated data, ignoring empty strings
    const updatedData = {
      title:
        title?.trim() === ''
          ? existingVacancy.title
          : title,
      description:
        description?.trim() === ''
          ? existingVacancy.description
          : description,
      company:
        company?.trim() === ''
          ? existingVacancy.company
          : company,
      location:
        location?.trim() === ''
          ? existingVacancy.location
          : location,
      status:
        status?.trim() === ''
          ? existingVacancy.status
          : status,
      applicationDeadline: applicationDeadline
        ? new Date(applicationDeadline)
        : existingVacancy.applicationDeadline,
      salary:
        salary?.trim() === ''
          ? existingVacancy.salary
          : salary,
      duties:
        duties?.trim() === ''
          ? existingVacancy.duties
          : duties,
      qualifications:
        qualifications?.trim() === ''
          ? existingVacancy.qualifications
          : qualifications,
      howToApply:
        howToApply?.trim() === ''
          ? existingVacancy.howToApply
          : howToApply,
    };

    // Update the vacancy details
    const updatedVacancy =
      await prisma.vacancy.update({
        where: { id: id },
        data: updatedData,
      });

    // Respond with success
    res.status(200).json({
      success: true,
      message: 'Vacancy updated successfully',
      data: updatedVacancy,
    });
  } catch (error: any) {
    console.error(
      'Error updating vacancy:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while updating the vacancy. Please try again later.',
      error: error.message,
    });
  }
};

// Delete Vacancy
export const deleteVacancy = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params;

  // Validate input
  if (!id) {
    res.status(400).json({
      success: false,
      message: 'Vacancy ID is required.',
      error: 'Validation error',
    });
    return;
  }

  try {
    // Check if the vacancy exists
    const existingVacancy =
      await prisma.vacancy.findUnique({
        where: { id: id },
      });

    if (!existingVacancy) {
      res.status(404).json({
        success: false,
        message: 'Vacancy not found.',
      });
      return;
    }

    // Delete the vacancy
    await prisma.vacancy.delete({
      where: { id: id },
    });

    // Respond with success
    res.status(200).json({
      success: true,
      message: 'Vacancy deleted successfully',
    });
  } catch (error: any) {
    console.error(
      'Error deleting vacancy:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while deleting the vacancy. Please try again later.',
      error: error.message,
    });
  }
};

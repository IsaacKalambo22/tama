import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { APIResponse } from '../../types';

const prisma = new PrismaClient();

export const createCouncilList = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const {
    demarcation,
    tobaccoType,
    councillor,
    firstAlternateCouncillor,
    secondAlternateCouncillor,
  } = req.body;
  console.log(req.body);
  // Validate input
  if (
    !demarcation ||
    !tobaccoType ||
    !councillor ||
    !firstAlternateCouncillor ||
    !secondAlternateCouncillor
  ) {
    res.status(400).json({
      success: false,
      message:
        'Demarcation, tobacco type, councillor, first alternate councillor, and second alternate councillor are required.',
      error: 'Validation error',
    });
    return;
  }

  try {
    // Create the new councilList
    const newCouncilList =
      await prisma.councilList.create({
        data: {
          demarcation,
          tobaccoType,
          councillor,
          firstAlternateCouncillor,
          secondAlternateCouncillor,
        },
      });

    // Respond with success
    res.status(201).json({
      success: true,
      message: 'CouncilList created successfully',
      data: newCouncilList,
    });
  } catch (error: any) {
    console.error(
      'Error creating councilList:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while creating the councilList. Please try again later.',
      error: error.message,
    });
  }
};

export const getAllCouncilLists = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  try {
    // Fetch all councilLists from the database
    const councilLists =
      await prisma.councilList.findMany({
        orderBy: { createdAt: 'asc' }, // Sort by createdAt in ascending order
      });

    // Respond with success
    res.status(200).json({
      success: true,
      message:
        'CouncilLists retrieved successfully',
      data: councilLists,
    });
  } catch (error: any) {
    console.error(
      'Error fetching councilLists:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while fetching councilLists. Please try again later.',
      error: error.message,
    });
  }
};

export const updateCouncilList = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params;
  const {
    demarcation,
    tobaccoType,
    councillor,
    firstAlternateCouncillor,
    secondAlternateCouncillor,
  } = req.body;

  // Validate input
  if (!id) {
    res.status(400).json({
      success: false,
      message: 'CouncilList ID is required.',
      error: 'Validation error',
    });
    return;
  }

  try {
    // Check if the councilList exists
    const existingCouncilList =
      await prisma.councilList.findUnique({
        where: { id },
      });

    if (!existingCouncilList) {
      res.status(404).json({
        success: false,
        message: 'CouncilList not found.',
      });
      return;
    }

    // Update the councilList details
    const updatedCouncilList =
      await prisma.councilList.update({
        where: { id },
        data: {
          demarcation:
            demarcation ??
            existingCouncilList.demarcation,
          tobaccoType:
            tobaccoType ??
            existingCouncilList.tobaccoType,
          councillor:
            councillor ??
            existingCouncilList.councillor,
          firstAlternateCouncillor:
            firstAlternateCouncillor ??
            existingCouncilList.firstAlternateCouncillor,
          secondAlternateCouncillor:
            secondAlternateCouncillor ??
            existingCouncilList.secondAlternateCouncillor,
        },
      });

    // Respond with success
    res.status(200).json({
      success: true,
      message: 'CouncilList updated successfully',
      data: updatedCouncilList,
    });
  } catch (error: any) {
    console.error(
      'Error updating councilList:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while updating the councilList. Please try again later.',
      error: error.message,
    });
  }
};

export const deleteCouncilList = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params;

  // Validate input
  if (!id) {
    res.status(400).json({
      success: false,
      message: 'CouncilList ID is required.',
      error: 'Validation error',
    });
    return;
  }

  try {
    // Check if the councilList exists
    const existingCouncilList =
      await prisma.councilList.findUnique({
        where: { id },
      });

    if (!existingCouncilList) {
      res.status(404).json({
        success: false,
        message: 'CouncilList not found.',
      });
      return;
    }

    // Delete the councilList
    await prisma.councilList.delete({
      where: { id },
    });

    // Respond with success
    res.status(200).json({
      success: true,
      message: 'CouncilList deleted successfully',
    });
  } catch (error: any) {
    console.error(
      'Error deleting councilList:',
      error.message
    );
    res.status(500).json({
      success: false,
      message:
        'An error occurred while deleting the councilList. Please try again later.',
      error: error.message,
    });
  }
};

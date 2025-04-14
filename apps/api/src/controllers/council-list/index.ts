import { Request, Response } from "express"
import prisma from "../../config"
import { APIResponse } from "../../types"

export const createCouncilList = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const {
    demarcation,
    councilArea,
    council,
    imageUrl,
    firstAlternateCouncillor,
    secondAlternateCouncillor,
  } = req.body
  if (
    !demarcation ||
    !councilArea ||
    !council ||
    !firstAlternateCouncillor ||
    !secondAlternateCouncillor
  ) {
    res.status(400).json({
      success: false,
      message:
        "Demarcation, council area, council, first alternate council, and second alternate council are required.",
      error: "Validation error",
    })
    return
  }

  try {
    const newCouncilList = await prisma.councilList.create({
      data: {
        demarcation,
        councilArea,
        council,
        imageUrl,
        firstAlternateCouncillor,
        secondAlternateCouncillor,
      },
    })

    // Respond with success
    res.status(201).json({
      success: true,
      message: "CouncilList created successfully",
      data: newCouncilList,
    })
  } catch (error: any) {
    console.error("Error creating councilList:", error.message)
    res.status(500).json({
      success: false,
      message:
        "An error occurred while creating the councilList. Please try again later.",
      error: error.message,
    })
  }
}

export const getAllCouncilLists = async (
  _req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  try {
    // Fetch all councilLists from the database
    const councilLists = await prisma.councilList.findMany({
      orderBy: { createdAt: "asc" }, // Sort by createdAt in ascending order
    })

    // Respond with success
    res.status(200).json({
      success: true,
      message: "CouncilLists retrieved successfully",
      data: councilLists,
    })
  } catch (error: any) {
    console.error("Error fetching councilLists:", error.message)
    res.status(500).json({
      success: false,
      message:
        "An error occurred while fetching councilLists. Please try again later.",
      error: error.message,
    })
  }
}

export const updateCouncilList = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params
  const {
    demarcation,
    councilArea,
    council,
    imageUrl,
    firstAlternateCouncillor,
    secondAlternateCouncillor,
  } = req.body

  // Validate input
  if (!id) {
    res.status(400).json({
      success: false,
      message: "CouncilList ID is required.",
      error: "Validation error",
    })
    return
  }

  try {
    // Check if the councilList exists
    const existingCouncilList = await prisma.councilList.findUnique({
      where: { id },
    })

    if (!existingCouncilList) {
      res.status(404).json({
        success: false,
        message: "CouncilList not found.",
      })
      return
    }

    // Update the councilList details
    const updatedCouncilList = await prisma.councilList.update({
      where: { id },
      data: {
        demarcation: demarcation ?? existingCouncilList.demarcation,
        councilArea: councilArea ?? existingCouncilList.councilArea,
        council: council ?? existingCouncilList.council,
        imageUrl:
          imageUrl?.trim() === "" ? existingCouncilList.imageUrl : imageUrl,
        firstAlternateCouncillor:
          firstAlternateCouncillor ??
          existingCouncilList.firstAlternateCouncillor,
        secondAlternateCouncillor:
          secondAlternateCouncillor ??
          existingCouncilList.secondAlternateCouncillor,
      },
    })

    // Respond with success
    res.status(200).json({
      success: true,
      message: "CouncilList updated successfully",
      data: updatedCouncilList,
    })
  } catch (error: any) {
    console.error("Error updating councilList:", error.message)
    res.status(500).json({
      success: false,
      message:
        "An error occurred while updating the councilList. Please try again later.",
      error: error.message,
    })
  }
}

export const deleteCouncilList = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params

  // Validate input
  if (!id) {
    res.status(400).json({
      success: false,
      message: "CouncilList ID is required.",
      error: "Validation error",
    })
    return
  }

  try {
    // Check if the councilList exists
    const existingCouncilList = await prisma.councilList.findUnique({
      where: { id },
    })

    if (!existingCouncilList) {
      res.status(404).json({
        success: false,
        message: "CouncilList not found.",
      })
      return
    }

    // Delete the councilList
    await prisma.councilList.delete({
      where: { id },
    })

    // Respond with success
    res.status(200).json({
      success: true,
      message: "CouncilList deleted successfully",
    })
  } catch (error: any) {
    console.error("Error deleting councilList:", error.message)
    res.status(500).json({
      success: false,
      message:
        "An error occurred while deleting the councilList. Please try again later.",
      error: error.message,
    })
  }
}

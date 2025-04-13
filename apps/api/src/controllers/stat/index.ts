import { Request, Response } from "express"
import prisma from "../../config"
import { APIResponse } from "../../types"

export const createStat = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { registeredCustomers, shops, councilors, cooperatives } = req.body

  // Validate input
  if (!registeredCustomers || !shops || !councilors || !cooperatives) {
    res.status(400).json({
      success: false,
      message:
        "Registered customers, shops, councilors, and cooperatives are required.",
      error: "Validation error",
    })
    return
  }

  try {
    // Create the new stat entry
    const newStat = await prisma.stat.create({
      data: {
        registeredCustomers,
        shops,
        councilors,
        cooperatives,
      },
    })

    // Respond with success
    res.status(201).json({
      success: true,
      message: "Stat created successfully",
      data: newStat,
    })
  } catch (error: any) {
    console.error("Error creating stat:", error.message)
    res.status(500).json({
      success: false,
      message:
        "An error occurred while creating the stat. Please try again later.",
      error: error.message,
    })
  }
}

export const getStat = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  try {
    const stat = await prisma.stat.findMany()

    res.status(200).json({
      success: true,
      message: "Stat retrieved successfully",
      data: stat,
    })
  } catch (error: any) {
    console.error("Error fetching stat:", error.message)
    res.status(500).json({
      success: false,
      message:
        "An error occurred while fetching the stat. Please try again later.",
      error: error.message,
    })
  }
}

export const updateStat = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params
  const { registeredCustomers, shops, councilors, cooperatives } = req.body

  // Validate input
  if (!id) {
    res.status(400).json({
      success: false,
      message: "Stat ID is required.",
      error: "Validation error",
    })
    return
  }

  try {
    // Check if the stat exists
    const existingStat = await prisma.stat.findUnique({
      where: { id },
    })

    if (!existingStat) {
      res.status(404).json({
        success: false,
        message: "Stat not found.",
      })
      return
    }

    // Update the stat details
    const updatedStat = await prisma.stat.update({
      where: { id },
      data: {
        registeredCustomers:
          registeredCustomers ?? existingStat.registeredCustomers,
        shops: shops ?? existingStat.shops,
        councilors: councilors ?? existingStat.councilors,
        cooperatives: cooperatives ?? existingStat.cooperatives,
      },
    })

    // Respond with success
    res.status(200).json({
      success: true,
      message: "Stat updated successfully",
      data: updatedStat,
    })
  } catch (error: any) {
    console.error("Error updating stat:", error.message)
    res.status(500).json({
      success: false,
      message:
        "An error occurred while updating the stat. Please try again later.",
      error: error.message,
    })
  }
}

export const deleteStat = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params

  // Validate input
  if (!id) {
    res.status(400).json({
      success: false,
      message: "Stat ID is required.",
      error: "Validation error",
    })
    return
  }

  try {
    // Check if the stat exists
    const existingStat = await prisma.stat.findUnique({
      where: { id },
    })

    if (!existingStat) {
      res.status(404).json({
        success: false,
        message: "Stat not found.",
      })
      return
    }

    // Delete the stat
    await prisma.stat.delete({
      where: { id },
    })

    // Respond with success
    res.status(200).json({
      success: true,
      message: "Stat deleted successfully",
    })
  } catch (error: any) {
    console.error("Error deleting stat:", error.message)
    res.status(500).json({
      success: false,
      message:
        "An error occurred while deleting the stat. Please try again later.",
      error: error.message,
    })
  }
}

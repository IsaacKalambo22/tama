import { Request, Response } from "express"
import prisma from "../../config"
import { APIResponse } from "../../types"

export const getAllDistricts = async (
  _req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  try {
    const districts = await prisma.district.findMany({
      include: {
        council: { select: { id: true, name: true } },
        _count: { select: { users: true } },
      },
      orderBy: { name: "asc" },
    })

    res.status(200).json({
      success: true,
      message: "Districts retrieved successfully",
      data: districts,
    })
  } catch (error: any) {
    console.error("Error fetching districts:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching districts.",
    })
  }
}

export const getDistrictById = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const id = String(req.params.id)

  try {
    const district = await prisma.district.findUnique({
      where: { id },
      include: {
        council: true,
        _count: { select: { users: true } },
      },
    })

    if (!district) {
      res.status(404).json({
        success: false,
        message: "District not found.",
      })
      return
    }

    res.status(200).json({
      success: true,
      message: "District retrieved successfully",
      data: district,
    })
  } catch (error: any) {
    console.error("Error fetching district:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the district.",
    })
  }
}

export const createDistrict = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { name, councilId } = req.body

  if (!name || !councilId) {
    res.status(400).json({
      success: false,
      message: "District name and councilId are required.",
    })
    return
  }

  try {
    const council = await prisma.council.findUnique({
      where: { id: councilId },
    })
    if (!council) {
      res.status(404).json({
        success: false,
        message: "Council not found.",
      })
      return
    }

    const existing = await prisma.district.findUnique({
      where: { name_councilId: { name, councilId } },
    })
    if (existing) {
      res.status(409).json({
        success: false,
        message: "A district with this name already exists in this council.",
      })
      return
    }

    const district = await prisma.district.create({
      data: { name, councilId },
      include: { council: { select: { name: true } } },
    })

    res.status(201).json({
      success: true,
      message: "District created successfully",
      data: district,
    })
  } catch (error: any) {
    console.error("Error creating district:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the district.",
    })
  }
}

export const updateDistrict = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const id = String(req.params.id)
  const { name, councilId } = req.body

  try {
    const existing = await prisma.district.findUnique({ where: { id } })
    if (!existing) {
      res.status(404).json({
        success: false,
        message: "District not found.",
      })
      return
    }

    const updatedName = name ?? existing.name
    const updatedCouncilId = councilId ?? existing.councilId

    if (name || councilId) {
      const nameTaken = await prisma.district.findFirst({
        where: {
          name: updatedName,
          councilId: updatedCouncilId,
          id: { not: id },
        },
      })
      if (nameTaken) {
        res.status(409).json({
          success: false,
          message: "A district with this name already exists in this council.",
        })
        return
      }
    }

    const district = await prisma.district.update({
      where: { id },
      data: { name: updatedName, councilId: updatedCouncilId },
      include: { council: { select: { name: true } } },
    })

    res.status(200).json({
      success: true,
      message: "District updated successfully",
      data: district,
    })
  } catch (error: any) {
    console.error("Error updating district:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the district.",
    })
  }
}

export const deleteDistrict = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const id = String(req.params.id)

  try {
    const existing = await prisma.district.findUnique({ where: { id } })
    if (!existing) {
      res.status(404).json({
        success: false,
        message: "District not found.",
      })
      return
    }

    await prisma.district.delete({ where: { id } })

    res.status(200).json({
      success: true,
      message: "District deleted successfully",
    })
  } catch (error: any) {
    console.error("Error deleting district:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the district.",
    })
  }
}

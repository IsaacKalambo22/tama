import { Request, Response } from "express"
import prisma from "../../config"
import { APIResponse } from "../../types"

const numericSort = (a: { name: string }, b: { name: string }) => {
  const numA = parseInt(a.name.replace(/\D/g, ""), 10)
  const numB = parseInt(b.name.replace(/\D/g, ""), 10)
  const aIsNum = !Number.isNaN(numA)
  const bIsNum = !Number.isNaN(numB)
  if (aIsNum && bIsNum && numA !== numB) return numA - numB
  return a.name.localeCompare(b.name)
}

export const getAllCouncils = async (
  _req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  try {
    const councils = await prisma.council.findMany({
      include: {
        _count: { select: { districts: true, users: true } },
      },
    })

    councils.sort(numericSort)

    res.status(200).json({
      success: true,
      message: "Councils retrieved successfully",
      data: councils,
    })
  } catch (error: any) {
    console.error("Error fetching councils:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching councils.",
    })
  }
}

export const getCouncilById = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const id = String(req.params.id)

  try {
    const council = await prisma.council.findUnique({
      where: { id },
      include: {
        districts: {
          include: {
            _count: { select: { users: true } },
          },
          orderBy: { name: "asc" },
        },
        _count: { select: { users: true } },
      },
    })

    if (!council) {
      res.status(404).json({
        success: false,
        message: "Council not found.",
      })
      return
    }

    res.status(200).json({
      success: true,
      message: "Council retrieved successfully",
      data: council,
    })
  } catch (error: any) {
    console.error("Error fetching council:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the council.",
    })
  }
}

export const createCouncil = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { name, description } = req.body

  if (!name) {
    res.status(400).json({
      success: false,
      message: "Council name is required.",
    })
    return
  }

  try {
    const existing = await prisma.council.findUnique({ where: { name } })
    if (existing) {
      res.status(409).json({
        success: false,
        message: "A council with this name already exists.",
      })
      return
    }

    const council = await prisma.council.create({
      data: { name, description },
    })

    res.status(201).json({
      success: true,
      message: "Council created successfully",
      data: council,
    })
  } catch (error: any) {
    console.error("Error creating council:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the council.",
    })
  }
}

export const updateCouncil = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const id = String(req.params.id)
  const { name, description } = req.body

  try {
    const existing = await prisma.council.findUnique({ where: { id } })
    if (!existing) {
      res.status(404).json({
        success: false,
        message: "Council not found.",
      })
      return
    }

    if (name && name !== existing.name) {
      const nameTaken = await prisma.council.findUnique({ where: { name } })
      if (nameTaken) {
        res.status(409).json({
          success: false,
          message: "A council with this name already exists.",
        })
        return
      }
    }

    const council = await prisma.council.update({
      where: { id },
      data: {
        name: name ?? existing.name,
        description: description ?? existing.description,
      },
    })

    res.status(200).json({
      success: true,
      message: "Council updated successfully",
      data: council,
    })
  } catch (error: any) {
    console.error("Error updating council:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the council.",
    })
  }
}

export const deleteCouncil = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const id = String(req.params.id)

  try {
    const existing = await prisma.council.findUnique({ where: { id } })
    if (!existing) {
      res.status(404).json({
        success: false,
        message: "Council not found.",
      })
      return
    }

    await prisma.council.delete({ where: { id } })

    res.status(200).json({
      success: true,
      message: "Council deleted successfully",
    })
  } catch (error: any) {
    console.error("Error deleting council:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the council.",
    })
  }
}

export const getCouncilDistricts = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const id = String(req.params.id)

  try {
    const council = await prisma.council.findUnique({ where: { id } })
    if (!council) {
      res.status(404).json({
        success: false,
        message: "Council not found.",
      })
      return
    }

    const districts = await prisma.district.findMany({
      where: { councilId: id },
      include: {
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

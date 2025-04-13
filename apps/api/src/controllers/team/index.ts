import { Request, Response } from "express"
import prisma from "../../config"
import { APIResponse } from "../../types"

export const createTeam = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const {
    name,
    position,
    imageUrl,
    facebookUrl,
    linkedInProfile,
    twitterUrl,
    description,
  } = req.body

  if (!name || !position || !imageUrl || !description) {
    res.status(400).json({
      success: false,
      message: "Name, position, imageUrl, and description are required.",
      error: "Validation error",
    })
    return
  }

  try {
    const newTeamMember = await prisma.team.create({
      data: {
        name,
        position,
        imageUrl,
        facebookUrl,
        linkedInProfile,
        twitterUrl,
        description,
      },
    })

    res.status(201).json({
      success: true,
      message: "Team member created successfully",
      data: newTeamMember,
    })
  } catch (error: any) {
    console.error("Error creating team member:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the team member.",
      error: error.message,
    })
  }
}
export const getTeam = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  try {
    const teamMembers = await prisma.team.findMany()
    res.status(200).json({
      success: true,
      message: "Team members retrieved successfully",
      data: teamMembers,
    })
  } catch (error: any) {
    console.error("Error fetching team members:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the team members.",
      error: error.message,
    })
  }
}

export const updateTeam = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params
  const {
    name,
    position,
    imageUrl,
    facebookUrl,
    linkedInProfile,
    twitterUrl,
    description,
  } = req.body

  if (!id) {
    res.status(400).json({
      success: false,
      message: "Team ID is required.",
      error: "Validation error",
    })
    return
  }

  try {
    const existingTeam = await prisma.team.findUnique({ where: { id } })

    if (!existingTeam) {
      res.status(404).json({
        success: false,
        message: "Team member not found.",
      })
      return
    }

    const updatedTeam = await prisma.team.update({
      where: { id },
      data: {
        name: name ?? existingTeam.name,
        position: position ?? existingTeam.position,
        imageUrl: imageUrl?.trim() === "" ? existingTeam.imageUrl : imageUrl,
        facebookUrl: facebookUrl ?? existingTeam.facebookUrl,
        linkedInProfile: linkedInProfile ?? existingTeam.linkedInProfile,
        twitterUrl: twitterUrl ?? existingTeam.twitterUrl,
        description: description ?? existingTeam.description,
      },
    })

    res.status(200).json({
      success: true,
      message: "Team member updated successfully",
      data: updatedTeam,
    })
  } catch (error: any) {
    console.error("Error updating team member:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the team member.",
      error: error.message,
    })
  }
}

export const deleteTeam = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params

  if (!id) {
    res.status(400).json({
      success: false,
      message: "Team ID is required.",
      error: "Validation error",
    })
    return
  }

  try {
    const existingTeam = await prisma.team.findUnique({ where: { id } })

    if (!existingTeam) {
      res.status(404).json({
        success: false,
        message: "Team member not found.",
      })
      return
    }

    await prisma.team.delete({ where: { id } })

    res.status(200).json({
      success: true,
      message: "Team member deleted successfully",
    })
  } catch (error: any) {
    console.error("Error deleting team member:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the team member.",
      error: error.message,
    })
  }
}

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

  if (!name || !position || !description) {
    res.status(400).json({
      success: false,
      message: "Name, position, and description are required.",
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

export const getTeamById = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params

  try {
    const teamMember = await prisma.team.findUnique({ where: { id } })

    if (!teamMember) {
      res.status(404).json({
        success: false,
        message: "Team member not found.",
      })
      return
    }

    res.status(200).json({
      success: true,
      message: "Team member retrieved successfully",
      data: teamMember,
    })
  } catch (error: any) {
    console.error("Error fetching team member:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the team member.",
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
  console.log(req.body)
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

    // Update the team member with the provided data
    // If a field is not provided, keep the existing value
    const updatedData: any = {
      name: name?.trim() === "" ? existingTeam.name : name,
      position: position?.trim() === "" ? existingTeam.position : position,
      imageUrl: imageUrl?.trim() === "" ? existingTeam.imageUrl : imageUrl,
      facebookUrl:
        facebookUrl?.trim() === "" ? existingTeam.facebookUrl : facebookUrl,
      linkedInProfile:
        linkedInProfile?.trim() === ""
          ? existingTeam.linkedInProfile
          : linkedInProfile,
      twitterUrl:
        twitterUrl?.trim() === "" ? existingTeam.twitterUrl : twitterUrl,
      description:
        description?.trim() === "" ? existingTeam.description : description,
    }

    // Add `size` only if it's provided and valid
    //  if (size !== undefined && size !== "") {
    //   updatedData.size = Number(size)
    // }

    const updatedTeam = await prisma.team.update({
      where: { id },
      data: updatedData,
    })

    res.status(200).json({
      success: true,
      message: "Team member updated successfully",
      data: updatedTeam,
    })
    console.log({ updatedData })
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

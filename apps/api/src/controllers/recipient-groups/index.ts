import { Request, Response } from "express"
import prisma from "../../config"
import { APIResponse } from "../../types"

/** GET /admin/recipient-groups — every sender can see and reuse any saved group. */
export const getRecipientGroups = async (
  _req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  try {
    const groups = await prisma.recipientGroup.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { members: true } } },
    })

    res.status(200).json({
      success: true,
      message: "Recipient groups retrieved successfully",
      data: groups.map(({ _count, ...group }) => ({
        ...group,
        memberCount: _count.members,
      })),
    })
  } catch (error: any) {
    console.error("Error fetching recipient groups:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching recipient groups.",
      error: error.message,
    })
  }
}

/** GET /admin/recipient-groups/:id — includes full member list. */
export const getRecipientGroupById = async (
  req: Request<{ id: string }>,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params

  try {
    const group = await prisma.recipientGroup.findUnique({
      where: { id },
      include: { members: { include: { user: true } } },
    })

    if (!group) {
      res
        .status(404)
        .json({ success: false, message: "Recipient group not found." })
      return
    }

    res.status(200).json({
      success: true,
      message: "Recipient group retrieved successfully",
      data: group,
    })
  } catch (error: any) {
    console.error("Error fetching recipient group:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the recipient group.",
      error: error.message,
    })
  }
}

/** POST /admin/recipient-groups — creates a group, optionally with initial members. */
export const createRecipientGroup = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const createdBy = req.user!.id
  const { name, memberIds } = req.body

  if (!name || typeof name !== "string" || !name.trim()) {
    res.status(400).json({ success: false, message: "name is required." })
    return
  }

  try {
    const ids: string[] = Array.isArray(memberIds) ? memberIds : []

    const group = await prisma.recipientGroup.create({
      data: {
        name: name.trim(),
        createdBy,
        members: {
          create: ids.map((userId: string) => ({ userId })),
        },
      },
      include: { _count: { select: { members: true } } },
    })

    res.status(201).json({
      success: true,
      message: "Recipient group created successfully",
      data: group,
    })
  } catch (error: any) {
    console.error("Error creating recipient group:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the recipient group.",
      error: error.message,
    })
  }
}

/** PATCH /admin/recipient-groups/:id — rename a group. */
export const updateRecipientGroup = async (
  req: Request<{ id: string }>,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params
  const { name } = req.body

  try {
    const existing = await prisma.recipientGroup.findUnique({ where: { id } })
    if (!existing) {
      res
        .status(404)
        .json({ success: false, message: "Recipient group not found." })
      return
    }

    const updated = await prisma.recipientGroup.update({
      where: { id },
      data: { name: name?.trim() || existing.name },
    })

    res.status(200).json({
      success: true,
      message: "Recipient group updated successfully",
      data: updated,
    })
  } catch (error: any) {
    console.error("Error updating recipient group:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the recipient group.",
      error: error.message,
    })
  }
}

/** DELETE /admin/recipient-groups/:id */
export const deleteRecipientGroup = async (
  req: Request<{ id: string }>,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params

  try {
    const existing = await prisma.recipientGroup.findUnique({ where: { id } })
    if (!existing) {
      res
        .status(404)
        .json({ success: false, message: "Recipient group not found." })
      return
    }

    await prisma.recipientGroup.delete({ where: { id } })

    res
      .status(200)
      .json({ success: true, message: "Recipient group deleted successfully" })
  } catch (error: any) {
    console.error("Error deleting recipient group:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the recipient group.",
      error: error.message,
    })
  }
}

/** POST /admin/recipient-groups/:id/members — bulk add members. */
export const addRecipientGroupMembers = async (
  req: Request<{ id: string }>,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params
  const { memberIds } = req.body

  if (!Array.isArray(memberIds) || memberIds.length === 0) {
    res
      .status(400)
      .json({ success: false, message: "memberIds must be a non-empty array." })
    return
  }

  try {
    const group = await prisma.recipientGroup.findUnique({ where: { id } })
    if (!group) {
      res
        .status(404)
        .json({ success: false, message: "Recipient group not found." })
      return
    }

    await prisma.recipientGroupMember.createMany({
      data: memberIds.map((userId: string) => ({ groupId: id, userId })),
      skipDuplicates: true,
    })

    const updated = await prisma.recipientGroup.findUnique({
      where: { id },
      include: { members: { include: { user: true } } },
    })

    res.status(200).json({
      success: true,
      message: "Members added successfully",
      data: updated,
    })
  } catch (error: any) {
    console.error("Error adding recipient group members:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while adding members.",
      error: error.message,
    })
  }
}

/** DELETE /admin/recipient-groups/:id/members/:userId */
export const removeRecipientGroupMember = async (
  req: Request<{ id: string; userId: string }>,
  res: Response<APIResponse>
): Promise<void> => {
  const { id, userId } = req.params

  try {
    await prisma.recipientGroupMember.deleteMany({
      where: { groupId: id, userId },
    })

    res
      .status(200)
      .json({ success: true, message: "Member removed successfully" })
  } catch (error: any) {
    console.error("Error removing recipient group member:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while removing the member.",
      error: error.message,
    })
  }
}

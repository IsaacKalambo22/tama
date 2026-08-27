import prisma from "@/config"
import { sendContactEmail } from "@/nodemailer/emails"
import { APIResponse } from "@/types"
import bcrypt from "bcryptjs"
import { Request, Response } from "express"
import { Role } from "../../../prisma/generated/prisma"
import { filterByScope } from "../../middlewares/verify-scope/index"
import {
  canAssignRole,
  canManageUser,
  ScopeUser,
  scopeWhereForUsers,
} from "../../permissions"

export const getAllUsers = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  try {
    const actor = req.user as ScopeUser
    const where = await filterByScope(actor, {})

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" }, // Sort users by most recent creation date
      select: {
        id: true,
        email: true,
        phoneNumber: true,
        name: true,
        avatar: true,
        about: true,
        role: true,
        councilId: true,
        districtId: true,
        council: { select: { id: true, name: true } },
        districtRel: { select: { id: true, name: true } },
        lastLogin: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    const data = users.map((u) => ({
      ...u,
      councilName: u.council?.name ?? null,
      districtName: u.districtRel?.name ?? null,
      council: undefined,
      districtRel: undefined,
    }))

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data,
    })
  } catch (error: any) {
    console.error("Error fetching users:", error.message)
    res.status(500).json({
      success: false,
      message:
        "An error occurred while fetching users. Please try again later.",
      error: error.message,
    })
  }
}

export const getUserById = async (
  req: Request<{ id: string }>,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params
  const actor = req.user as ScopeUser

  // Validate input
  if (!id) {
    res.status(400).json({
      success: false,
      message: "User ID is required.",
      error: "Validation error",
    })
    return
  }

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        phoneNumber: true,
        name: true,
        avatar: true,
        about: true,
        role: true,
        councilId: true,
        districtId: true,
        council: { select: { id: true, name: true } },
        districtRel: { select: { id: true, name: true } },
        lastLogin: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      })
      return
    }

    const scopeCheck =
      actor.role === Role.SUPER_ADMIN ||
      (actor.role === Role.COUNCIL_ADMIN &&
        user.councilId &&
        user.councilId === actor.councilId) ||
      (actor.role === Role.DISTRICT_ADMIN &&
        ((user.districtId && user.districtId === actor.districtId) ||
          (user.councilId && user.councilId === actor.councilId))) ||
      (actor.role === Role.FARMER && actor.id === user.id)

    if (!scopeCheck) {
      res.status(403).json({
        success: false,
        message: "Forbidden: You cannot view this user.",
      })
      return
    }

    // Respond with success
    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: {
        ...user,
        councilName: user.council?.name ?? null,
        districtName: user.districtRel?.name ?? null,
        council: undefined,
        districtRel: undefined,
      },
    })
  } catch (error: any) {
    console.error("Error fetching users:", error.message)
    res.status(500).json({
      success: false,
      message:
        "An error occurred while fetching users. Please try again later.",
      error: error.message,
    })
  }
}

export const updateUser = async (
  req: Request<{ id: string }>,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params
  const actor = req.user as ScopeUser

  const {
    name,
    email,
    password,
    role,
    phoneNumber,
    district,
    avatar,
    about,
    districtId,
  } = req.body

  // Validate input
  if (!id) {
    res.status(400).json({
      success: false,
      message: "User ID is required.",
      error: "Validation error",
    })
    return
  }

  try {
    // Check if the user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        role: true,
        councilId: true,
        districtId: true,
        avatar: true,
        about: true,
        password: true,
        district: true,
        isVerified: true,
        verificationToken: true,
        verificationTokenExpiresAt: true,
        resetPasswordToken: true,
        resetPasswordExpiresAt: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!existingUser) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      })
      return
    }

    const isOwnRecord = actor.id === existingUser.id

    // SCOPE ENFORCEMENT
    if (actor.role === Role.FARMER) {
      if (!isOwnRecord) {
        res.status(403).json({
          success: false,
          message: "Forbidden: You can only update your own profile.",
        })
        return
      }
      if (role || districtId || req.body.councilId !== undefined) {
        res.status(403).json({
          success: false,
          message: "Forbidden: You cannot change role or assigned scope.",
        })
        return
      }
    } else if (!canManageUser(actor, existingUser)) {
      if (!isOwnRecord) {
        res.status(403).json({
          success: false,
          message: "Forbidden: You cannot update this user.",
        })
        return
      }
    }

    // ROLE ESCALATION GUARD
    const requestedRole = role?.trim()
      ? (role.trim().toUpperCase() as Role)
      : existingUser.role
    if (
      requestedRole !== existingUser.role &&
      !canAssignRole(actor, requestedRole)
    ) {
      res.status(403).json({
        success: false,
        message: `Forbidden: Your role cannot assign ${requestedRole}.`,
      })
      return
    }

    // Prepare updated data
    const updatedData: Partial<typeof existingUser> = {
      name: name?.trim() || existingUser.name,
      district: district?.trim() || existingUser.district,
      avatar: avatar?.trim() || existingUser.avatar,
      about: about?.trim() || existingUser.about,
      email: email?.trim() || existingUser.email,
      role: requestedRole,
      phoneNumber: phoneNumber?.trim() || existingUser.phoneNumber,
    }

    // SCOPE REASSIGNMENT GUARD (non-super-admins stay within their scope)
    if (actor.role === Role.COUNCIL_ADMIN) {
      updatedData.councilId = existingUser.councilId ?? actor.councilId
      if (req.body.councilId && req.body.councilId !== actor.councilId) {
        res.status(403).json({
          success: false,
          message: "Forbidden: You cannot move a user to another council.",
        })
        return
      }
      if (districtId) {
        const district = await prisma.district.findUnique({
          where: { id: districtId },
          select: { councilId: true },
        })
        if (!district || district.councilId !== actor.councilId) {
          res.status(403).json({
            success: false,
            message: "Forbidden: District must be within your council.",
          })
          return
        }
        updatedData.districtId = districtId
      }
    } else if (actor.role === Role.DISTRICT_ADMIN) {
      updatedData.councilId = existingUser.councilId ?? actor.councilId ?? null
      if (districtId && districtId !== actor.districtId) {
        res.status(403).json({
          success: false,
          message: "Forbidden: You cannot move a user to another district.",
        })
        return
      }
      if (
        existingUser.districtId &&
        existingUser.districtId !== actor.districtId
      ) {
        res.status(403).json({
          success: false,
          message: "Forbidden: You cannot update users outside your district.",
        })
        return
      }
    }
    if (actor.role === Role.SUPER_ADMIN) {
      if (req.body.councilId !== undefined)
        updatedData.councilId = req.body.councilId || null
      if (districtId !== undefined) updatedData.districtId = districtId || null
    }

    // Hash the password if it's being updated
    if (password?.trim()) {
      const saltRounds = 10
      updatedData.password = await bcrypt.hash(password, saltRounds)
    }

    // Update the user details
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updatedData,
    })

    // Respond with success
    res.status(200).json({
      success: true,
      message: "User updated successfully.",
      data: updatedUser,
    })
  } catch (error: any) {
    console.error("Error updating user:", error.message)
    res.status(500).json({
      success: false,
      message:
        "An error occurred while updating the user. Please try again later.",
      error: error.message,
    })
  }
}

export const deleteUser = async (
  req: Request<{ id: string }>,
  res: Response<APIResponse>
): Promise<void> => {
  const { id } = req.params
  const actor = req.user as ScopeUser

  // Validate input
  if (!id) {
    res.status(400).json({
      success: false,
      message: "User ID is required.",
      error: "Validation error",
    })
    return
  }

  try {
    // Check if the user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true, councilId: true, districtId: true },
    })

    if (!existingUser) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      })
      return
    }

    if (!canManageUser(actor, existingUser)) {
      res.status(403).json({
        success: false,
        message: "Forbidden: You cannot delete this user.",
      })
      return
    }

    // Delete the user
    await prisma.user.delete({
      where: { id },
    })

    // Respond with success
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error: any) {
    console.error("Error deleting user:", error.message)
    res.status(500).json({
      success: false,
      message:
        "An error occurred while deleting the user. Please try again later.",
      error: error.message,
    })
  }
}

export const sendContactMessage = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { name, email, phoneNumber, message } = req.body

  // Validate user input
  if (!name || !email || !phoneNumber || !message) {
    res.status(400).json({
      success: false,
      message: "Name, email, phone number, and message are required.",
    })
    return
  }

  try {
    // Format email body using template

    // Send email
    const result = await sendContactEmail(email, name, message, phoneNumber)

    if (result.success) {
      console.log("Contact email sent successfully")
      res.status(200).json({
        success: true,
        message: "Email sent successfully!",
      })
    } else {
      console.error("Failed to send contact email:", result.message)
      res.status(500).json({
        success: false,
        message: result.message,
      })
    }
  } catch (error) {
    console.error("Error sending email:", error)
    res.status(500).json({
      success: false,
      message: "An error occurred while sending email. Please try again later.",
    })
  }
}

export const IMPORT_ROLES: Role[] = [
  Role.SUPER_ADMIN,
  Role.COUNCIL_ADMIN,
  Role.DISTRICT_ADMIN,
  Role.FARMER,
]
const ROLE_VALUES: Role[] = Object.values(Role)

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidPhone(phone: string): boolean {
  return /^(\+265(9|8)\d{8}|0(9|8)\d{8})$/.test(phone.trim())
}

function normalizePhone(phone: string): string {
  const trimmed = phone.trim()
  if (trimmed.startsWith("+265")) return trimmed
  if (trimmed.startsWith("09") || trimmed.startsWith("08")) {
    return "+265" + trimmed.slice(1)
  }
  return trimmed
}

interface ImportRow {
  name?: string
  email?: string
  phoneNumber?: string
  role?: string
  district?: string
}

interface ImportResult {
  row: number
  email: string
  status: "success" | "failed"
  reason?: string
  userId?: string
  message?: string
}

export const bulkImportUsers = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const actor = req.user as ScopeUser | undefined
  const { users } = req.body as { users: ImportRow[] }

  if (!Array.isArray(users) || users.length === 0) {
    res.status(400).json({
      success: false,
      message: "Users array is required and must not be empty.",
    })
    return
  }

  const results: ImportResult[] = []
  const seenEmails = new Set<string>()
  const seenPhones = new Set<string>()

  // Collect all emails from the file to check against DB in bulk
  const fileEmails = users
    .map((u) => u.email?.trim().toLowerCase())
    .filter(Boolean) as string[]

  const existingUsers = await prisma.user.findMany({
    where: { email: { in: fileEmails } },
    select: { email: true },
  })
  const existingEmailSet = new Set(
    existingUsers.map((u) => u.email.toLowerCase())
  )

  for (let i = 0; i < users.length; i++) {
    const row = i + 1
    const user = users[i]
    const email = user.email?.trim().toLowerCase() || ""
    const phoneNumber = user.phoneNumber?.trim() || ""
    const name = user.name?.trim() || ""
    const role = (user.role?.trim().toUpperCase() || "FARMER") as string
    const district = user.district?.trim() || ""

    // Validate required fields
    if (!name || name.length < 2) {
      results.push({
        row,
        email: email || "(missing)",
        status: "failed",
        reason: "Name is required (minimum 2 characters)",
      })
      continue
    }

    if (!email || !isValidEmail(email)) {
      results.push({
        row,
        email: email || "(missing)",
        status: "failed",
        reason: "A valid email address is required",
      })
      continue
    }

    if (!phoneNumber || !isValidPhone(phoneNumber)) {
      results.push({
        row,
        email,
        status: "failed",
        reason:
          "A valid TNM or Airtel phone number is required (e.g., +2659XXXXXXXX or 09XXXXXXXX)",
      })
      continue
    }

    if (!ROLE_VALUES.includes(role as Role)) {
      results.push({
        row,
        email,
        status: "failed",
        reason: `Invalid role '${user.role}'. Must be one of: ${IMPORT_ROLES.join(", ")}`,
      })
      continue
    }

    // Role must be assignable by the importing actor
    const targetRole = role as Role
    if (actor && !canAssignRole(actor, targetRole)) {
      results.push({
        row,
        email,
        status: "failed",
        reason: `Role '${targetRole}' is not permitted for your account scope`,
      })
      continue
    }

    // Duplicate email check within file
    if (seenEmails.has(email)) {
      results.push({
        row,
        email,
        status: "failed",
        reason: "Duplicate email within the uploaded file",
      })
      continue
    }

    // Duplicate phone check within file
    if (seenPhones.has(phoneNumber)) {
      results.push({
        row,
        email,
        status: "failed",
        reason: "Duplicate phone number within the uploaded file",
      })
      continue
    }

    // Email already exists in DB
    if (existingEmailSet.has(email)) {
      results.push({
        row,
        email,
        status: "failed",
        reason: "Email already exists in the database",
      })
      continue
    }

    seenEmails.add(email)
    seenPhones.add(phoneNumber)

    // Scope auto-assignment from the actor
    let councilId: string | null | undefined
    let districtId: string | null | undefined
    if (actor) {
      councilId =
        actor.role === Role.COUNCIL_ADMIN || actor.role === Role.DISTRICT_ADMIN
          ? (actor.councilId ?? null)
          : null
      if (actor.role === Role.DISTRICT_ADMIN) {
        districtId = actor.districtId ?? null
      }
    }

    // Create user
    try {
      const defaultPassword = await bcrypt.hash("Welcome@123", 10)
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          phoneNumber: normalizePhone(phoneNumber),
          role: targetRole,
          district: district || null,
          councilId: councilId ?? null,
          districtId: districtId ?? null,
          password: defaultPassword,
          isVerified: false,
        },
      })
      results.push({
        row,
        email,
        status: "success",
        userId: newUser.id,
        message: "Created",
      })
    } catch (error: any) {
      results.push({
        row,
        email,
        status: "failed",
        reason: error.message || "Database error",
      })
    }
  }

  const succeeded = results.filter((r) => r.status === "success").length
  const failed = results.filter((r) => r.status === "failed").length

  res.status(200).json({
    success: true,
    message: "Import completed",
    data: {
      total: users.length,
      succeeded,
      failed,
      results,
    },
  })
}

interface PhoneUpdateRow {
  name?: string
  email?: string
  phoneNumber: string
}

interface PhoneImportResult {
  row: number
  email?: string
  name?: string
  phoneNumber: string
  status: "success" | "failed" | "unmatched" | "ambiguous"
  reason?: string
  matchedUserId?: string
  message?: string
}

export const bulkImportPhoneNumbers = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const actor = req.user as ScopeUser | undefined
  const { phoneUpdates } = req.body as { phoneUpdates: PhoneUpdateRow[] }

  if (!Array.isArray(phoneUpdates) || phoneUpdates.length === 0) {
    res.status(400).json({
      success: false,
      message: "Phone updates array is required and must not be empty.",
    })
    return
  }

  const scopeFilter = actor ? scopeWhereForUsers(actor) : {}

  const results: PhoneImportResult[] = []

  for (let i = 0; i < phoneUpdates.length; i++) {
    const row = i + 1
    const update = phoneUpdates[i]
    const phoneNumber = update.phoneNumber?.trim() || ""
    const email = update.email?.trim().toLowerCase() || ""
    const name = update.name?.trim() || ""

    if (!phoneNumber || !isValidPhone(phoneNumber)) {
      results.push({
        row,
        email,
        name,
        phoneNumber,
        status: "failed",
        reason:
          "A valid TNM or Airtel phone number is required (e.g., +2659XXXXXXXX or 09XXXXXXXX)",
      })
      continue
    }

    let matchedUser = null
    let matchMethod = ""

    // Try exact email match first (restricted to actor scope)
    if (email) {
      const emailMatch = await prisma.user.findUnique({
        where: { email },
      })
      if (emailMatch) {
        if (Object.keys(scopeFilter).length === 0) {
          matchedUser = emailMatch
          matchMethod = "email"
        } else {
          const scoped = await prisma.user.findFirst({
            where: { email, ...scopeFilter },
          })
          if (scoped) {
            matchedUser = scoped
            matchMethod = "email"
          } else {
            results.push({
              row,
              email,
              name,
              phoneNumber,
              status: "unmatched",
              reason: `User with email '${email}' exists but is outside your scope`,
            })
            continue
          }
        }
      }
    }

    // If no email match, try fuzzy name match (restricted to actor scope)
    if (!matchedUser && name) {
      const nameMatches = await prisma.user.findMany({
        where: {
          name: {
            contains: name,
            mode: "insensitive",
          },
          ...scopeFilter,
        },
      })

      if (nameMatches.length === 1) {
        matchedUser = nameMatches[0]
        matchMethod = "name"
      } else if (nameMatches.length > 1) {
        results.push({
          row,
          email,
          name,
          phoneNumber,
          status: "ambiguous",
          reason: `Multiple users found matching name '${name}'. Manual review required.`,
        })
        continue
      }
    }

    if (!matchedUser) {
      results.push({
        row,
        email,
        name,
        phoneNumber,
        status: "unmatched",
        reason: email
          ? `No user found with email '${email}'`
          : name
            ? `No user found matching name '${name}'`
            : "No email or name provided to match against",
      })
      continue
    }

    // Update phone number
    try {
      await prisma.user.update({
        where: { id: matchedUser.id },
        data: { phoneNumber: normalizePhone(phoneNumber) },
      })
      results.push({
        row,
        email: matchedUser.email,
        name: matchedUser.name,
        phoneNumber,
        status: "success",
        matchedUserId: matchedUser.id,
        message: `Updated via ${matchMethod} match`,
      })
    } catch (error: any) {
      results.push({
        row,
        email: matchedUser.email,
        name: matchedUser.name,
        phoneNumber,
        status: "failed",
        reason: error.message || "Database error",
      })
    }
  }

  const succeeded = results.filter((r) => r.status === "success").length
  const failed = results.filter((r) => r.status === "failed").length
  const unmatched = results.filter((r) => r.status === "unmatched").length
  const ambiguous = results.filter((r) => r.status === "ambiguous").length

  res.status(200).json({
    success: true,
    message: "Phone import completed",
    data: {
      total: phoneUpdates.length,
      succeeded,
      failed,
      unmatched,
      ambiguous,
      results,
    },
  })
}

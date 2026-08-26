import prisma from "@/config"
import { sendContactEmail } from "@/nodemailer/emails"
import { APIResponse } from "@/types"
import bcrypt from "bcryptjs"
import { Request, Response } from "express"
import { parsePhoneNumberFromString } from "libphonenumber-js"

export const getAllUsers = async (
  _req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" }, // Sort users by most recent creation date
      select: {
        id: true,
        email: true,
        phoneNumber: true,
        name: true,
        role: true,
        lastLogin: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
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
    })

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      })
      return
    }

    // Respond with success
    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: user,
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

  const { name, email, password, role, phoneNumber, district, avatar, about } =
    req.body

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
    })

    if (!existingUser) {
      res.status(404).json({
        success: false,
        message: "User not found.",
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
      role: role?.trim() || existingUser.role,
      phoneNumber: phoneNumber?.trim() || existingUser.phoneNumber,
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
    })

    if (!existingUser) {
      res.status(404).json({
        success: false,
        message: "User not found.",
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

const VALID_ROLES = ["ADMIN", "MANAGER", "USER"] as const

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidE164Phone(phone: string): boolean {
  const parsed = parsePhoneNumberFromString(phone)
  return parsed ? parsed.isValid() && parsed.number === phone : false
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
    const role = (user.role?.trim().toUpperCase() || "USER") as string
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

    if (!phoneNumber || !isValidE164Phone(phoneNumber)) {
      results.push({
        row,
        email,
        status: "failed",
        reason:
          "A valid phone number in E.164 format is required (e.g., +1234567890)",
      })
      continue
    }

    if (!VALID_ROLES.includes(role as (typeof VALID_ROLES)[number])) {
      results.push({
        row,
        email,
        status: "failed",
        reason: `Invalid role '${user.role}'. Must be one of: ADMIN, MANAGER, USER`,
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

    // Create user
    try {
      const defaultPassword = await bcrypt.hash("Welcome@123", 10)
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          phoneNumber,
          role: role as "ADMIN" | "MANAGER" | "USER",
          district: district || null,
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
  const { phoneUpdates } = req.body as { phoneUpdates: PhoneUpdateRow[] }

  if (!Array.isArray(phoneUpdates) || phoneUpdates.length === 0) {
    res.status(400).json({
      success: false,
      message: "Phone updates array is required and must not be empty.",
    })
    return
  }

  const results: PhoneImportResult[] = []

  for (let i = 0; i < phoneUpdates.length; i++) {
    const row = i + 1
    const update = phoneUpdates[i]
    const phoneNumber = update.phoneNumber?.trim() || ""
    const email = update.email?.trim().toLowerCase() || ""
    const name = update.name?.trim() || ""

    if (!phoneNumber || !isValidE164Phone(phoneNumber)) {
      results.push({
        row,
        email,
        name,
        phoneNumber,
        status: "failed",
        reason: "A valid phone number in E.164 format is required",
      })
      continue
    }

    let matchedUser = null
    let matchMethod = ""

    // Try exact email match first
    if (email) {
      matchedUser = await prisma.user.findUnique({
        where: { email },
      })
      if (matchedUser) {
        matchMethod = "email"
      }
    }

    // If no email match, try fuzzy name match
    if (!matchedUser && name) {
      const nameMatches = await prisma.user.findMany({
        where: {
          name: {
            contains: name,
            mode: "insensitive",
          },
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
        data: { phoneNumber },
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

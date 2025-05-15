import bcrypt from "bcryptjs"
import dotenv from "dotenv"
import { Role } from "../../prisma/generated/prisma"
import prisma from "../config"

dotenv.config()

/**
 * Bootstraps an admin user if none exists in the system
 * Uses environment variables SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD
 */
export const bootstrapAdmin = async (): Promise<void> => {
  try {
    // Check if any admin user exists
    const adminExists = await prisma.user.findFirst({
      where: {
        role: Role.ADMIN,
      },
    })

    // If admin already exists, no need to create one
    if (adminExists) {
      console.log("✅ Admin user already exists, skipping bootstrap")
      return
    }

    // Get admin credentials from environment variables
    const adminEmail = process.env.SUPER_ADMIN_EMAIL
    const adminPassword = process.env.SUPER_ADMIN_PASSWORD

    // Validate environment variables
    if (!adminEmail || !adminPassword) {
      console.error(
        "❌ Cannot bootstrap admin: SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD must be set in environment variables"
      )
      return
    }

    // Check if the email is already in use (could be a non-admin user)
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    })

    if (existingUser) {
      // If user exists but is not an admin, upgrade their role
      if (existingUser.role !== Role.ADMIN) {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { role: Role.ADMIN },
        })
        console.log(`✅ Upgraded existing user ${adminEmail} to ADMIN role`)
      }
      return
    }

    // Hash the password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds)

    // Create the admin user
    const newAdmin = await prisma.user.create({
      data: {
        name: "System Administrator",
        email: adminEmail,
        password: hashedPassword,
        phoneNumber: "0000000000", // Default phone number
        role: Role.ADMIN,
        isVerified: true, // Admin is automatically verified
      },
    })

    console.log(`✅ Successfully created admin user: ${newAdmin.email}`)
  } catch (error) {
    console.error("❌ Error bootstrapping admin user:", error)
  }
}

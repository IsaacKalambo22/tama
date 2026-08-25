import bcrypt from "bcryptjs"
import { Role } from "../prisma/generated/prisma"
import prisma from "./config"

async function seed() {
  console.log("🌱 Seeding users...")

  const hashedUserPassword = await bcrypt.hash("User@123456", 10)
  const hashedManagerPassword = await bcrypt.hash("Manager@123456", 10)

  // Create normal user
  const normalUser = await prisma.user.upsert({
    where: { email: "user@tamalawi.com" },
    update: {},
    create: {
      name: "John Banda",
      email: "user@tamalawi.com",
      password: hashedUserPassword,
      phoneNumber: "+265881234567",
      role: Role.USER,
      isVerified: true,
    },
  })
  console.log(`✅ Normal user created: ${normalUser.email}`)

  // Create manager user
  const managerUser = await prisma.user.upsert({
    where: { email: "manager@tamalawi.com" },
    update: {},
    create: {
      name: "Mary Phiri",
      email: "manager@tamalawi.com",
      password: hashedManagerPassword,
      phoneNumber: "+265882345678",
      role: Role.MANAGER,
      isVerified: true,
    },
  })
  console.log(`✅ Manager user created: ${managerUser.email}`)

  console.log("\n🎉 Seeding completed!")
  console.log("\n--- User Credentials ---")
  console.log("Normal User:")
  console.log("  Email: user@tamalawi.com")
  console.log("  Password: User@123456")
  console.log("\nManager User:")
  console.log("  Email: manager@tamalawi.com")
  console.log("  Password: Manager@123456")
}

seed()
  .catch((e) => {
    console.error("❌ Seeding failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

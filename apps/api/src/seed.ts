import bcrypt from "bcryptjs"
import { Role } from "../prisma/generated/prisma"
import prisma from "./config"

const COUNCILS_DATA = [
  { name: "Area 2", description: "Area 2 Council" },
  { name: "Area 3", description: "Area 3 Council" },
  { name: "Area 4", description: "Area 4 Council" },
  { name: "Area 5", description: "Area 5 Council" },
  { name: "Area 6", description: "Area 6 Council" },
  { name: "Area 7", description: "Area 7 Council" },
  { name: "Area 8", description: "Area 8 Council" },
  { name: "Area 9", description: "Area 9 Council" },
  { name: "Area 10", description: "Area 10 Council" },
  { name: "Area 11", description: "Area 11 Council" },
]

const DISTRICTS_DATA: Record<string, string[]> = {
  "Area 2": ["District 1", "District 2"],
  "Area 3": ["District 1", "District 2"],
  "Area 4": ["District 1", "District 2"],
  "Area 5": ["District 1", "District 2", "District 3"],
  "Area 6": ["District 1", "District 2"],
  "Area 7": ["District 1", "District 2"],
  "Area 8": ["District 1", "District 2"],
  "Area 9": ["District 1", "District 2"],
  "Area 10": ["District 1", "District 2"],
  "Area 11": ["District 1", "District 2"],
}

async function seed() {
  console.log("🌱 Seeding councils and districts...")

  const councilMap: Record<string, string> = {}

  for (const councilData of COUNCILS_DATA) {
    const council = await prisma.council.upsert({
      where: { name: councilData.name },
      update: { description: councilData.description },
      create: councilData,
    })
    councilMap[council.name] = council.id
    console.log(`  ✅ Council: ${council.name} (${council.id})`)
  }

  console.log("\n🌱 Seeding districts...")

  for (const [councilName, districtNames] of Object.entries(DISTRICTS_DATA)) {
    const councilId = councilMap[councilName]
    for (const districtName of districtNames) {
      const district = await prisma.district.upsert({
        where: {
          name_councilId: { name: districtName, councilId },
        },
        update: {},
        create: { name: districtName, councilId },
      })
      console.log(
        `  ✅ District: ${district.name} in ${councilName} (${district.id})`
      )
    }
  }

  console.log("\n🌱 Seeding users...")

  const hashedUserPassword = await bcrypt.hash("User@123456", 10)
  const hashedManagerPassword = await bcrypt.hash("Manager@123456", 10)
  const hashedAdminPassword = await bcrypt.hash("Admin@123456", 10)

  const area2Id = councilMap["Area 2"]
  const area2Districts = await prisma.district.findMany({
    where: { councilId: area2Id },
  })
  const firstDistrictId = area2Districts[0]?.id

  const farmerUser = await prisma.user.upsert({
    where: { email: "user@tamalawi.com" },
    update: {
      role: Role.FARMER,
      councilId: area2Id,
      districtId: firstDistrictId,
    },
    create: {
      name: "John Banda",
      email: "user@tamalawi.com",
      password: hashedUserPassword,
      phoneNumber: "+265881234567",
      role: Role.FARMER,
      councilId: area2Id,
      districtId: firstDistrictId,
      isVerified: true,
    },
  })
  console.log(`✅ Farmer user created: ${farmerUser.email}`)

  const councilAdminUser = await prisma.user.upsert({
    where: { email: "manager@tamalawi.com" },
    update: {
      role: Role.COUNCIL_ADMIN,
      councilId: area2Id,
    },
    create: {
      name: "Mary Phiri",
      email: "manager@tamalawi.com",
      password: hashedManagerPassword,
      phoneNumber: "+265882345678",
      role: Role.COUNCIL_ADMIN,
      councilId: area2Id,
      isVerified: true,
    },
  })
  console.log(`✅ Council Admin user created: ${councilAdminUser.email}`)

  const area5Id = councilMap["Area 5"]
  const area5Districts = await prisma.district.findMany({
    where: { councilId: area5Id },
  })
  const districtAdminDistrictId = area5Districts[0]?.id

  const districtAdminUser = await prisma.user.upsert({
    where: { email: "districtadmin@tamalawi.com" },
    update: {
      role: Role.DISTRICT_ADMIN,
      councilId: area5Id,
      districtId: districtAdminDistrictId,
    },
    create: {
      name: "Chikondi Msukwa",
      email: "districtadmin@tamalawi.com",
      password: hashedAdminPassword,
      phoneNumber: "+265883456789",
      role: Role.DISTRICT_ADMIN,
      councilId: area5Id,
      districtId: districtAdminDistrictId,
      isVerified: true,
    },
  })
  console.log(`✅ District Admin user created: ${districtAdminUser.email}`)

  const superAdminUser = await prisma.user.upsert({
    where: { email: "admin@tamalawi.com" },
    update: { role: Role.SUPER_ADMIN },
    create: {
      name: "Super Admin",
      email: "admin@tamalawi.com",
      password: hashedAdminPassword,
      phoneNumber: "+265884567890",
      role: Role.SUPER_ADMIN,
      isVerified: true,
    },
  })
  console.log(`✅ Super Admin user created: ${superAdminUser.email}`)

  console.log("\n🎉 Seeding completed!")
  console.log("\n--- User Credentials ---")
  console.log("Farmer:")
  console.log("  Email: user@tamalawi.com")
  console.log("  Password: User@123456")
  console.log("\nCouncil Admin:")
  console.log("  Email: manager@tamalawi.com")
  console.log("  Password: Manager@123456")
  console.log("\nDistrict Admin:")
  console.log("  Email: districtadmin@tamalawi.com")
  console.log("  Password: Admin@123456")
  console.log("\nSuper Admin:")
  console.log("  Email: admin@tamalawi.com")
  console.log("  Password: Admin@123456")
}

seed()
  .catch((e) => {
    console.error("❌ Seeding failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

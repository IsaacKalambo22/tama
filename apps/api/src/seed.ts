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
  { name: "Area 12", description: "Area 12 Council" },
  { name: "Area 13", description: "Area 13 Council" },
  { name: "Area 14", description: "Area 14 Council" },
  { name: "Area 15", description: "Area 15 Council" },
  { name: "Area 16", description: "Area 16 Council" },
  { name: "Area 17", description: "Area 17 Council" },
  { name: "Area 18", description: "Area 18 Council" },
  { name: "Area 19", description: "Area 19 Council" },
  { name: "Area 20", description: "Area 20 Council" },
  { name: "Area 21", description: "Area 21 Council" },
]

const DISTRICTS_DATA: Record<string, string[]> = {
  "Area 2": [
    "Mulanje",
    "Phalombe",
    "Thyolo",
    "Blantyre",
    "Chiradzulu",
    "Zomba",
  ],
  "Area 3": ["Balaka", "Bwanje Valley", "Chilipa", "Nakhumba", "Ntcheu"],
  "Area 4": ["Machinga"],
  "Area 5": ["Mangochi", "Namwera", "Makanjira"],
  "Area 6": ["Dedza", "Part Of Lilongwe East"],
  "Area 7": ["Lilongwe South", "Lilongwe West"],
  "Area 8": ["Lilongwe North East - Nsalu", "Kasiya"],
  "Area 9": ["Mchinji"],
  "Area 10": ["Dowa East"],
  "Area 11": ["Dowa West"],
  "Area 12": ["Nkhotakota", "Salima"],
  "Area 13": ["Ntchisi"],
  "Area 14": ["Kasungu West"],
  "Area 15": ["Kasungu East"],
  "Area 16": ["Mzimba South"],
  "Area 17": ["Mzimba North"],
  "Area 18": ["Rumphi"],
  "Area 19": ["Kalonga", "Chitipa"],
  "Area 20": ["Big Growers Central"],
  "Area 21": ["Big Growers North"],
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

  console.log("\n🧹 Pruning districts not in the canonical list...")

  for (const [councilName, districtNames] of Object.entries(DISTRICTS_DATA)) {
    const councilId = councilMap[councilName]
    const stale = await prisma.district.findMany({
      where: { councilId, name: { notIn: districtNames } },
      select: { id: true, name: true },
    })
    for (const district of stale) {
      await prisma.district.delete({ where: { id: district.id } })
      console.log(
        `  🗑️  Removed stale district: ${district.name} in ${councilName}`
      )
    }
  }

  console.log("\n🌱 Seeding users...")

  const hashedUserPassword = await bcrypt.hash("User@123456", 10)
  const hashedManagerPassword = await bcrypt.hash("Manager@123456", 10)
  const hashedAdminPassword = await bcrypt.hash("Admin@123456", 10)

  const area2Id = councilMap["Area 2"]
  const farmerDistrict = await prisma.district.findUnique({
    where: { name_councilId: { name: "Mulanje", councilId: area2Id! } },
  })
  const firstDistrictId = farmerDistrict?.id

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
  const districtAdminDistrict = await prisma.district.findUnique({
    where: { name_councilId: { name: "Mangochi", councilId: area5Id! } },
  })
  const districtAdminDistrictId = districtAdminDistrict?.id

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

  const area11Id = councilMap["Area 11"]
  const superAdminDistrict = await prisma.district.findUnique({
    where: { name_councilId: { name: "Dowa West", councilId: area11Id! } },
  })
  const superAdminDistrictId = superAdminDistrict?.id

  const superAdminUser = await prisma.user.upsert({
    where: { email: "admin@tamalawi.com" },
    update: {
      role: Role.SUPER_ADMIN,
      councilId: area11Id,
      districtId: superAdminDistrictId,
    },
    create: {
      name: "Super Admin",
      email: "admin@tamalawi.com",
      password: hashedAdminPassword,
      phoneNumber: "+265884567890",
      role: Role.SUPER_ADMIN,
      councilId: area11Id,
      districtId: superAdminDistrictId,
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

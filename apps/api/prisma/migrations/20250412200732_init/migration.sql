/*
  Warnings:

  - Added the required column `imageUrl` to the `CouncilList` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CouncilList" ADD COLUMN     "imageUrl" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "facebookUrl" TEXT,
    "linkedInProfile" TEXT,
    "twitterUrl" TEXT,
    "description" TEXT NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stat" (
    "id" TEXT NOT NULL,
    "registeredCustomers" DOUBLE PRECISION NOT NULL,
    "shops" DOUBLE PRECISION NOT NULL,
    "councilors" DOUBLE PRECISION NOT NULL,
    "cooperatives" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stat_pkey" PRIMARY KEY ("id")
);

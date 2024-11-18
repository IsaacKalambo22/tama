/*
  Warnings:

  - Added the required column `councillor` to the `CouncilList` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CouncilList" ADD COLUMN     "councillor" TEXT NOT NULL;

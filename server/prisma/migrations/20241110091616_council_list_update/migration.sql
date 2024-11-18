/*
  Warnings:

  - The primary key for the `CouncilList` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "CouncilList" DROP CONSTRAINT "CouncilList_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "CouncilList_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "CouncilList_id_seq";

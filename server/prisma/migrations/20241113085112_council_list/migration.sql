-- CreateTable
CREATE TABLE "CouncilList" (
    "id" SERIAL NOT NULL,
    "demarcation" TEXT NOT NULL,
    "tobaccoType" TEXT NOT NULL,
    "firstAlternateCouncillor" TEXT NOT NULL,
    "secondAlternateCouncillor" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CouncilList_pkey" PRIMARY KEY ("id")
);

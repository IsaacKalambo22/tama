-- CreateEnum
CREATE TYPE "NotificationTargetType" AS ENUM ('INDIVIDUALS', 'GROUP', 'DISTRICT', 'COUNCIL');

-- CreateEnum
CREATE TYPE "NotificationBatchStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'SENT', 'CANCELLED');

-- CreateTable
CREATE TABLE "NotificationBatch" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "targetType" "NotificationTargetType" NOT NULL,
    "targetRef" TEXT,
    "individualIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "link" TEXT,
    "scheduledFor" TIMESTAMP(3),
    "status" "NotificationBatchStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InAppNotification" (
    "id" TEXT NOT NULL,
    "batchId" TEXT,
    "senderId" TEXT,
    "recipientId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "link" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "event" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InAppNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipientGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecipientGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipientGroupMember" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecipientGroupMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NotificationBatch_senderId_idx" ON "NotificationBatch"("senderId");

-- CreateIndex
CREATE INDEX "NotificationBatch_status_scheduledFor_idx" ON "NotificationBatch"("status", "scheduledFor");

-- CreateIndex
CREATE INDEX "InAppNotification_recipientId_read_createdAt_idx" ON "InAppNotification"("recipientId", "read", "createdAt");

-- CreateIndex
CREATE INDEX "InAppNotification_batchId_idx" ON "InAppNotification"("batchId");

-- CreateIndex
CREATE UNIQUE INDEX "RecipientGroupMember_groupId_userId_key" ON "RecipientGroupMember"("groupId", "userId");

-- CreateIndex
CREATE INDEX "RecipientGroupMember_userId_idx" ON "RecipientGroupMember"("userId");

-- AddForeignKey
ALTER TABLE "NotificationBatch" ADD CONSTRAINT "NotificationBatch_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InAppNotification" ADD CONSTRAINT "InAppNotification_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "NotificationBatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InAppNotification" ADD CONSTRAINT "InAppNotification_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InAppNotification" ADD CONSTRAINT "InAppNotification_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipientGroup" ADD CONSTRAINT "RecipientGroup_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipientGroupMember" ADD CONSTRAINT "RecipientGroupMember_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "RecipientGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipientGroupMember" ADD CONSTRAINT "RecipientGroupMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

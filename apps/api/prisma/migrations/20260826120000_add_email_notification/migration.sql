-- CreateEnum
CREATE TYPE "EmailNotificationStatus" AS ENUM ('QUEUED', 'SENT', 'DELIVERED', 'FAILED', 'REJECTED', 'CANCELLED');

-- CreateTable
CREATE TABLE "EmailNotification" (
    "id" TEXT NOT NULL,
    "messageId" TEXT,
    "event" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "templateId" TEXT,
    "subject" TEXT,
    "status" "EmailNotificationStatus" NOT NULL DEFAULT 'QUEUED',
    "failureCode" TEXT,
    "failureReason" TEXT,
    "costCharged" TEXT,
    "providerMessageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailNotification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailNotification_messageId_key" ON "EmailNotification"("messageId");

-- CreateIndex
CREATE INDEX "EmailNotification_recipient_idx" ON "EmailNotification"("recipient");

-- CreateIndex
CREATE INDEX "EmailNotification_event_idx" ON "EmailNotification"("event");

-- CreateIndex
CREATE INDEX "EmailNotification_status_idx" ON "EmailNotification"("status");

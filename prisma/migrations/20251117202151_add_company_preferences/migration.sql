-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "defaultTheme" TEXT NOT NULL DEFAULT 'system',
ADD COLUMN     "notificationNewRequestEmail" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notificationPendingReminder" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notificationPush" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "leave_policies" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "requiresDocument" BOOLEAN NOT NULL DEFAULT false,
    "maxConsecutiveDays" DOUBLE PRECISION,
    "blackoutDates" TIMESTAMP(3)[] DEFAULT ARRAY[]::TIMESTAMP(3)[],
    "autoApprovalThreshold" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leave_policies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "leave_policies_companyId_idx" ON "leave_policies"("companyId");

-- AddForeignKey
ALTER TABLE "leave_policies" ADD CONSTRAINT "leave_policies_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

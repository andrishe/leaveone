-- Add optional contact details to companies
ALTER TABLE "companies"
  ADD COLUMN "contactEmail" TEXT,
  ADD COLUMN "contactPhone" TEXT,
  ADD COLUMN "address" TEXT;

-- Add workingDays column to companies table to store allowed business days
ALTER TABLE "companies"
ADD COLUMN "workingDays" INTEGER[] NOT NULL DEFAULT ARRAY[1,2,3,4,5];

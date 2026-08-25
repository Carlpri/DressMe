-- Keep migration history aligned with schema changes that already exist in some dev databases.
ALTER TYPE "AccountStatus" ADD VALUE IF NOT EXISTS 'DELETED';

ALTER TABLE "Vendor" ADD COLUMN IF NOT EXISTS "address" TEXT NOT NULL DEFAULT '';

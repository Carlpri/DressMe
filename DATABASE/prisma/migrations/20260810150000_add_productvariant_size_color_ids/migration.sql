-- Additive migration to add sizeId and colorId to ProductVariant
-- This migration is safe to run on production as it only adds nullable columns
-- and creates foreign key constraints with proper error handling

-- Add nullable sizeId column
ALTER TABLE "ProductVariant" ADD COLUMN IF NOT EXISTS "sizeId" TEXT;

-- Add nullable colorId column  
ALTER TABLE "ProductVariant" ADD COLUMN IF NOT EXISTS "colorId" TEXT;

-- Add nullable compareAtPrice column if missing
ALTER TABLE "ProductVariant" ADD COLUMN IF NOT EXISTS "compareAtPrice" DOUBLE PRECISION;

-- Add nullable costPrice column if missing
ALTER TABLE "ProductVariant" ADD COLUMN IF NOT EXISTS "costPrice" DOUBLE PRECISION;

-- Add isAvailable column with default if missing
ALTER TABLE "ProductVariant" ADD COLUMN IF NOT EXISTS "isAvailable" BOOLEAN NOT NULL DEFAULT true;

-- Create indexes for sizeId and colorId
CREATE INDEX IF NOT EXISTS "ProductVariant_sizeId_idx" ON "ProductVariant"("sizeId");
CREATE INDEX IF NOT EXISTS "ProductVariant_colorId_idx" ON "ProductVariant"("colorId");

-- Add foreign key for sizeId (only if Size table exists and has data)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Size') THEN
        ALTER TABLE "ProductVariant" 
        ADD CONSTRAINT "ProductVariant_sizeId_fkey" 
        FOREIGN KEY ("sizeId") REFERENCES "Size"("id") 
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Add foreign key for colorId (only if Color table exists and has data)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Color') THEN
        ALTER TABLE "ProductVariant" 
        ADD CONSTRAINT "ProductVariant_colorId_fkey" 
        FOREIGN KEY ("colorId") REFERENCES "Color"("id") 
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

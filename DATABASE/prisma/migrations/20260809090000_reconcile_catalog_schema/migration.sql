
ALTER TABLE "Vendor" ALTER COLUMN "businessName" SET NOT NULL;
ALTER TABLE "Vendor" ALTER COLUMN "whatsappNumber" SET NOT NULL;

CREATE TABLE IF NOT EXISTS "ProductCategory" (
    "productId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("productId", "categoryId")
);

INSERT INTO "ProductCategory" ("productId", "categoryId", "isPrimary")
SELECT "id", "categoryId", true
FROM "Product"
ON CONFLICT ("productId", "categoryId") DO NOTHING;

CREATE INDEX IF NOT EXISTS "ProductCategory_productId_idx" ON "ProductCategory"("productId");
CREATE INDEX IF NOT EXISTS "ProductCategory_categoryId_idx" ON "ProductCategory"("categoryId");

DO $$ BEGIN
  ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_categoryId_fkey"
    FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Product variants now expose the values consumed by product, cart, and order APIs.
ALTER TABLE "ProductVariant" ADD COLUMN IF NOT EXISTS "sizeValue" TEXT;
ALTER TABLE "ProductVariant" ADD COLUMN IF NOT EXISTS "colorValue" TEXT;
UPDATE "ProductVariant" SET "sizeValue" = "size" WHERE "sizeValue" IS NULL;
UPDATE "ProductVariant" SET "colorValue" = "color" WHERE "colorValue" IS NULL;
ALTER TABLE "ProductVariant" ALTER COLUMN "sizeValue" SET NOT NULL;
ALTER TABLE "ProductVariant" ALTER COLUMN "colorValue" SET NOT NULL;

-- Reference-data endpoints depend on these tables. They are empty by default and
-- can be managed independently without modifying existing catalog rows.
DO $$ BEGIN
  CREATE TYPE "SizeCategory" AS ENUM ('ADULT', 'NUMERIC', 'FOOTWEAR', 'UNIVERSAL');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "Attribute" (
    "id" TEXT NOT NULL, "name" TEXT NOT NULL, "slug" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Attribute_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Attribute_name_key" ON "Attribute"("name");
CREATE UNIQUE INDEX IF NOT EXISTS "Attribute_slug_key" ON "Attribute"("slug");

CREATE TABLE IF NOT EXISTS "AttributeValue" (
    "id" TEXT NOT NULL, "attributeId" TEXT NOT NULL, "value" TEXT NOT NULL, "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AttributeValue_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "AttributeValue_attributeId_value_key" ON "AttributeValue"("attributeId", "value");
CREATE INDEX IF NOT EXISTS "AttributeValue_attributeId_idx" ON "AttributeValue"("attributeId");
DO $$ BEGIN
  ALTER TABLE "AttributeValue" ADD CONSTRAINT "AttributeValue_attributeId_fkey"
    FOREIGN KEY ("attributeId") REFERENCES "Attribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "Color" (
    "id" TEXT NOT NULL, "name" TEXT NOT NULL, "hexCode" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true, "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Color_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Color_name_key" ON "Color"("name");

CREATE TABLE IF NOT EXISTS "Size" (
    "id" TEXT NOT NULL, "name" TEXT NOT NULL, "category" "SizeCategory" NOT NULL DEFAULT 'ADULT',
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Size_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Size_name_key" ON "Size"("name");

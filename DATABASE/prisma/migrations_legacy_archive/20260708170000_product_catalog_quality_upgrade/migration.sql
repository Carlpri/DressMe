-- Product image improvements
ALTER TABLE "ProductImage" ADD COLUMN IF NOT EXISTS "altText" TEXT;
ALTER TABLE "ProductImage" ADD COLUMN IF NOT EXISTS "displayOrder" INTEGER NOT NULL DEFAULT 0;

-- Product variant improvements
ALTER TABLE "ProductVariant" ADD COLUMN IF NOT EXISTS "price" DOUBLE PRECISION;
ALTER TABLE "ProductVariant" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;

-- Product analytics support
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "views" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "sales" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "reviewCount" INTEGER NOT NULL DEFAULT 0;

-- Category, brand, and vendor catalog/store improvements
ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "image" TEXT;
ALTER TABLE "Brand" ADD COLUMN IF NOT EXISTS "website" TEXT;
ALTER TABLE "Brand" ADD COLUMN IF NOT EXISTS "description" TEXT;
ALTER TABLE "Vendor" ADD COLUMN IF NOT EXISTS "coverImage" TEXT;
ALTER TABLE "Vendor" ADD COLUMN IF NOT EXISTS "businessEmail" TEXT;
ALTER TABLE "Vendor" ADD COLUMN IF NOT EXISTS "facebook" TEXT;
ALTER TABLE "Vendor" ADD COLUMN IF NOT EXISTS "instagram" TEXT;
ALTER TABLE "Vendor" ADD COLUMN IF NOT EXISTS "tiktok" TEXT;
ALTER TABLE "Vendor" ADD COLUMN IF NOT EXISTS "website" TEXT;

-- Filtering/query indexes. Unique constraints already index Product.slug, Category.slug, Brand.slug, and Vendor.userId.
CREATE INDEX IF NOT EXISTS "Product_vendorId_idx" ON "Product"("vendorId");
CREATE INDEX IF NOT EXISTS "Product_categoryId_idx" ON "Product"("categoryId");
CREATE INDEX IF NOT EXISTS "Product_brandId_idx" ON "Product"("brandId");
CREATE INDEX IF NOT EXISTS "Product_status_idx" ON "Product"("status");
CREATE INDEX IF NOT EXISTS "Product_featured_idx" ON "Product"("featured");

/*
  Warnings:

  - You are about to drop the `SiteSettings` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "public"."ProductStatus" ADD VALUE 'HIDDEN';

-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "compareAtPrice" DOUBLE PRECISION,
ADD COLUMN     "isBestSeller" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isNewArrival" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isTrending" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "public"."SiteSettings";

-- CreateTable
CREATE TABLE "public"."AppSettings" (
    "id" TEXT NOT NULL,
    "siteName" TEXT NOT NULL DEFAULT 'DressMe',
    "tagline" TEXT,
    "logoUrl" TEXT,
    "logoDarkUrl" TEXT,
    "faviconUrl" TEXT,
    "heroBannerUrl" TEXT,
    "supportEmail" TEXT,
    "supportPhone" TEXT,
    "whatsappNumber" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "tiktok" TEXT,
    "x" TEXT,
    "linkedin" TEXT,
    "youtube" TEXT,
    "heroTitle" TEXT,
    "heroSubtitle" TEXT,
    "heroCtaText" TEXT,
    "heroCtaLink" TEXT,
    "featuredCategorySlug" TEXT,
    "featuredBrandSlug" TEXT,
    "featuredProductsLimit" INTEGER NOT NULL DEFAULT 8,
    "trendingProductsLimit" INTEGER NOT NULL DEFAULT 8,
    "newArrivalsLimit" INTEGER NOT NULL DEFAULT 8,
    "bestSellersLimit" INTEGER NOT NULL DEFAULT 8,
    "physicalAddress" TEXT,
    "businessHours" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "defaultShippingFee" DOUBLE PRECISION NOT NULL DEFAULT 500,
    "aboutUs" TEXT,
    "privacyPolicy" TEXT,
    "termsOfService" TEXT,
    "refundPolicy" TEXT,
    "shippingPolicy" TEXT,
    "siteTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT,
    "ogImageUrl" TEXT,
    "twitterCardType" TEXT DEFAULT 'summary_large_image',
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "country" TEXT DEFAULT 'Kenya',
    "language" TEXT DEFAULT 'en',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MediaItem" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "folder" TEXT DEFAULT 'general',
    "mimeType" TEXT,
    "size" INTEGER,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaItem_pkey" PRIMARY KEY ("id")
);

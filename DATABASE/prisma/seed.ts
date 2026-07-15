import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { seedUsers } from "./seeds/users.js";
import { seedVendors } from "./seeds/vendors.js";
import { seedBrands } from "./seeds/brands.js";
import { seedCategories } from "./seeds/categories.js";
import { seedProducts } from "./seeds/products.js";
import { seedProductVariants } from "./seeds/productVariants.js";
import { seedAddresses } from "./seeds/addresses.js";
import { seedCarts } from "./seeds/carts.js";
import { seedFavorites } from "./seeds/favorites.js";
import { seedReviews } from "./seeds/reviews.js";
import { seedOutfits } from "./seeds/outfits.js";
import { seedSavedOutfits } from "./seeds/savedOutfits.js";

// Load environment variables for configurable seed counts.
dotenv.config();

const prisma = new PrismaClient();

interface SeedConfig {
  users: number;
  vendors: number;
  brands: number;
  categories: number;
  products: number;
}

function parseSeedCount(key: string, defaultValue: number): number {
  const rawValue = process.env[key];
  const parsed = rawValue ? Number(rawValue) : defaultValue;

  if (!Number.isFinite(parsed) || parsed < 0) {
    console.warn(
      `⚠️ Invalid value for ${key}: ${rawValue}. Falling back to ${defaultValue}.`
    );
    return defaultValue;
  }

  return Math.floor(parsed);
}

const seedConfig: SeedConfig = {
  users: parseSeedCount("SEED_USERS", 20),
  vendors: parseSeedCount("SEED_VENDORS", 5),
  brands: parseSeedCount("SEED_BRANDS", 10),
  categories: parseSeedCount("SEED_CATEGORIES", 8),
  products: parseSeedCount("SEED_PRODUCTS", 100),
};

function logSeedConfiguration(config: SeedConfig) {
  console.log("🚀 Starting DressMe database seeding...");
  console.log("📦 Seed configuration:");
  console.log(`   • Users: ${config.users}`);
  console.log(`   • Vendors: ${config.vendors}`);
  console.log(`   • Brands: ${config.brands}`);
  console.log(`   • Categories: ${config.categories}`);
  console.log(`   • Products: ${config.products}\n`);
}

async function main() {
  logSeedConfiguration(seedConfig);
  const startTime = Date.now();

  const userIds = await seedUsers(prisma, seedConfig.users);
  const vendorIds = await seedVendors(prisma, userIds, seedConfig.vendors);
  const brandIds = await seedBrands(prisma, seedConfig.brands);
  const categoryIds = await seedCategories(prisma, seedConfig.categories);
  const productIds = await seedProducts(
    prisma,
    vendorIds,
    brandIds,
    categoryIds,
    seedConfig.products
  );

  await seedProductVariants(prisma, productIds);
  await seedAddresses(prisma, userIds);
  await seedCarts(prisma, userIds, productIds);
  await seedFavorites(prisma, userIds, productIds);
  await seedReviews(prisma, userIds, productIds);
  await seedOutfits(prisma, userIds, productIds);
  await seedSavedOutfits(prisma, userIds);

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  console.log(`\n✅ Seeding completed successfully in ${duration}s!`);
}

main()
  .catch((error) => {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

const DEFAULT_CATEGORIES = [
  "Dresses",
  "Shirts",
  "Pants",
  "Skirts",
  "Jackets",
  "Accessories",
  "Footwear",
  "Intimates",
];

/**
 * Seed categories with deterministic names and slugs.
 * Uses upsert to preserve idempotency across multiple runs.
 */
export async function seedCategories(
  prisma: PrismaClient,
  count: number
): Promise<string[]> {
  console.log(`🌱 Seeding ${count} categories...`);

  const categoryIds: string[] = [];

  for (let i = 1; i <= count; i++) {
    const index = String(i).padStart(3, "0");
    const name =
      i <= DEFAULT_CATEGORIES.length
        ? DEFAULT_CATEGORIES[i - 1]
        : `CATEGORY${index}`;
    const slug = slugify(name, { lower: true });

    const category = await prisma.category.upsert({
      where: { slug },
      create: {
        name,
        slug,
      },
      update: {
        name,
      },
    });

    categoryIds.push(category.id);
  }

  console.log(`✅ Seeded ${count} categories`);
  return categoryIds;
}

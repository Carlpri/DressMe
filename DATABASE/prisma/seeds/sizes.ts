import { PrismaClient, SizeCategory } from "@prisma/client";
import { randomUUID } from "node:crypto";

const DEFAULT_SIZES = [
  { name: "XS", category: "ADULT" },
  { name: "S", category: "ADULT" },
  { name: "M", category: "ADULT" },
  { name: "L", category: "ADULT" },
  { name: "XL", category: "ADULT" },
  { name: "XXL", category: "ADULT" },
  { name: "3XL", category: "ADULT" },
  { name: "4XL", category: "ADULT" },
  { name: "Newborn", category: "UNIVERSAL" },
  { name: "0-3 Months", category: "UNIVERSAL" },
  { name: "3-6 Months", category: "UNIVERSAL" },
  { name: "6-12 Months", category: "UNIVERSAL" },
  { name: "12-18 Months", category: "UNIVERSAL" },
  { name: "18-24 Months", category: "UNIVERSAL" },
  { name: "2T", category: "UNIVERSAL" },
  { name: "3T", category: "UNIVERSAL" },
  { name: "4T", category: "UNIVERSAL" },
  { name: "5T", category: "UNIVERSAL" },
  { name: "Universal", category: "ADULT" },
];

/**
 * Seed size records with deterministic IDs and names.
 * Uses upsert to avoid duplicate size creation.
 */
export async function seedSizes(
  prisma: PrismaClient,
  count: number
): Promise<string[]> {
  console.log(`🌱 Seeding ${count} sizes...`);

  const sizeIds: string[] = [];

  for (let i = 1; i <= count; i++) {
    const index = String(i).padStart(3, "0");
    const sizeData =
      i <= DEFAULT_SIZES.length
        ? DEFAULT_SIZES[i - 1]
        : { name: `SIZE${index}`, category: "ADULT" as SizeCategory };

    const size = await prisma.size.upsert({
      where: { name: sizeData.name },
      create: {
        id: randomUUID(),
        name: sizeData.name,
        category: sizeData.category,
      },
      update: {
        category: sizeData.category,
      },
    });

    sizeIds.push(size.id);
  }

  console.log(`✅ Seeded ${count} sizes`);
  return sizeIds;
}

import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

/**
 * Seed brand records with deterministic IDs and names.
 * Uses upsert to avoid duplicate brand creation.
 */
export async function seedBrands(
  prisma: PrismaClient,
  count: number
): Promise<string[]> {
  console.log(`🌱 Seeding ${count} brands...`);

  const brandIds: string[] = [];

  for (let i = 1; i <= count; i++) {
    const index = String(i).padStart(3, "0");
    const name = `BRAND${index}`;
    const slug = slugify(name, { lower: true });

    const brand = await prisma.brand.upsert({
      where: { slug },
      create: {
        name,
        slug,
        description: `Premium brand offering quality fashion items for all genders`,
        website: `https://brand${index}.dressme.co.ke`,
      },
      update: {
        name,
        description: `Premium brand offering quality fashion items for all genders`,
        website: `https://brand${index}.dressme.co.ke`,
      },
    });

    brandIds.push(brand.id);
  }

  console.log(`✅ Seeded ${count} brands`);
  return brandIds;
}

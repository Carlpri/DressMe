import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import slugify from "slugify";

const OUTFIT_TITLES = [
  "Campus Fit",
  "Weekend Fit",
  "Streetwear",
  "Business Casual",
  "Date Night",
  "Casual Layering",
];

const OCCASIONS = ["Casual", "Formal", "Party", "Beach", "Office", "Gym"];
const SEASONS = ["Spring", "Summer", "Fall", "Winter"];

export async function seedOutfits(
  prisma: PrismaClient,
  userIds: string[],
  productIds: string[]
): Promise<void> {
  console.log(`🌱 Seeding outfits...`);

  let outfitCount = 0;

  for (const userId of userIds) {
    const userOutfitCount = Math.floor(Math.random() * 3) + 2;

    for (let i = 0; i < userOutfitCount; i++) {
      const title = OUTFIT_TITLES[i % OUTFIT_TITLES.length];
      const slug = slugify(`${title}-${userId}`, { lower: true });
      const occasion = OCCASIONS[Math.floor(Math.random() * OCCASIONS.length)];
      const season = SEASONS[Math.floor(Math.random() * SEASONS.length)];

      const outfit = await prisma.outfit.upsert({
        where: { slug },
        create: {
          title,
          slug,
          description: faker.lorem.sentences(2),
          style: faker.commerce.department(),
          occasion,
          season,
          isPublic: Math.random() > 0.3,
          creatorId: userId,
        },
        update: {
          title,
          description: faker.lorem.sentences(2),
          style: faker.commerce.department(),
          occasion,
          season,
          isPublic: Math.random() > 0.3,
        },
      });

      outfitCount++;

      const existingItemCount = await prisma.outfitItem.count({
        where: { outfitId: outfit.id },
      });

      if (existingItemCount > 0) {
        continue;
      }

      const outfitItemCount = Math.floor(Math.random() * 3) + 2;
      const selectedProducts = new Set<string>();

      while (selectedProducts.size < outfitItemCount) {
        const productId =
          productIds[Math.floor(Math.random() * productIds.length)];

        if (selectedProducts.has(productId)) {
          continue;
        }

        selectedProducts.add(productId);
        await prisma.outfitItem.create({
          data: {
            outfitId: outfit.id,
            productId,
          },
        });
      }
    }
  }

  console.log(`✅ Seeded ${outfitCount} outfits`);
}

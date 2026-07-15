import { PrismaClient } from "@prisma/client";

export async function seedFavorites(
  prisma: PrismaClient,
  userIds: string[],
  productIds: string[]
): Promise<void> {
  console.log(`🌱 Seeding favorites...`);

  let favoriteCount = 0;

  for (const userId of userIds) {
    const existingFavorites = await prisma.favoriteProduct.findMany({
      where: { userId },
      select: { productId: true },
    });

    const existingProductIds = new Set(existingFavorites.map((item) => item.productId));
    const targetCount = Math.max(existingFavorites.length, Math.floor(Math.random() * 10) + 5);

    while (existingProductIds.size < targetCount) {
      const productId =
        productIds[Math.floor(Math.random() * productIds.length)];

      if (existingProductIds.has(productId)) {
        continue;
      }

      await prisma.favoriteProduct.create({
        data: {
          userId,
          productId,
        },
      });
      existingProductIds.add(productId);
      favoriteCount++;
    }
  }

  console.log(`✅ Seeded ${favoriteCount} new favorites`);
}

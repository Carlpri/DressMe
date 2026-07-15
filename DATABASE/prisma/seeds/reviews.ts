import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

export async function seedReviews(
  prisma: PrismaClient,
  userIds: string[],
  productIds: string[]
): Promise<void> {
  console.log(`🌱 Seeding reviews...`);

  let reviewCount = 0;

  for (const userId of userIds) {
    const existingReviews = await prisma.review.findMany({
      where: { userId },
      select: { productId: true },
    });

    const reviewedProductIds = new Set(existingReviews.map((review) => review.productId));
    const targetCount = Math.max(existingReviews.length, Math.floor(Math.random() * 6) + 2);

    for (const productId of productIds) {
      if (reviewedProductIds.size >= targetCount) {
        break;
      }

      if (reviewedProductIds.has(productId)) {
        continue;
      }

      const rating = Math.floor(Math.random() * 5) + 1;
      const comment =
        Math.random() > 0.3
          ? faker.lorem.sentence()
          : faker.lorem.sentences(2);

      await prisma.review.create({
        data: {
          userId,
          productId,
          rating,
          comment,
        },
      });

      reviewedProductIds.add(productId);
      reviewCount++;
    }
  }

  console.log(`✅ Seeded ${reviewCount} new reviews`);
}

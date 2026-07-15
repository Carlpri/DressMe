import { PrismaClient } from "@prisma/client";

export async function seedCarts(
  prisma: PrismaClient,
  userIds: string[],
  productIds: string[]
): Promise<void> {
  console.log(`🌱 Seeding carts for ${userIds.length} users...`);

  for (const userId of userIds) {
    const cart = await prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });

    const existingItems = await prisma.cartItem.count({
      where: { cartId: cart.id },
    });

    if (existingItems > 0) {
      continue;
    }

    const cartItemCount = Math.floor(Math.random() * 5) + 1;
    const addedCombinations = new Set<string>();

    for (let i = 0; i < cartItemCount; i++) {
      const productId =
        productIds[Math.floor(Math.random() * productIds.length)];
      const variants = await prisma.productVariant.findMany({
        where: { productId },
        take: 1,
        skip: Math.floor(Math.random() * 3),
      });
      const variantId = variants.length > 0 ? variants[0].id : null;
      const quantity = Math.floor(Math.random() * 3) + 1;
      const combinationKey = `${productId}-${variantId}`;

      if (addedCombinations.has(combinationKey)) {
        continue;
      }

      addedCombinations.add(combinationKey);

      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          variantId,
          quantity,
        },
      });
    }
  }

  console.log(`✅ Seeded carts for ${userIds.length} users`);
}


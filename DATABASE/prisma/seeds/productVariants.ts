import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const COLORS = [
  "Black",
  "White",
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Purple",
  "Pink",
  "Orange",
  "Brown",
  "Gray",
  "Navy",
];

export async function seedProductVariants(
  prisma: PrismaClient,
  productIds: string[]
): Promise<void> {
  console.log(`🌱 Seeding product variants...`);

  for (const productId of productIds) {
    // Create 3-5 variants per product
    const variantCount = Math.floor(Math.random() * 3) + 3;

    for (let i = 1; i <= variantCount; i++) {
      const size = SIZES[Math.floor(Math.random() * SIZES.length)];
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const variantIndex = String(i).padStart(3, "0");
      const sku = `SKU-${productId}-${variantIndex}`;

      await prisma.productVariant.upsert({
        where: { sku },
        create: {
          size,
          color,
          stock: Math.floor(Math.random() * 200) + 5,
          sku,
          price: parseFloat((Math.random() * 2000 + 200).toFixed(2)),
          productId,
        },
        update: {
          size,
          color,
          stock: Math.floor(Math.random() * 200) + 5,
          price: parseFloat((Math.random() * 2000 + 200).toFixed(2)),
        },
      });
    }
  }

  console.log(`✅ Seeded product variants for ${productIds.length} products`);
}

import { PrismaClient, Gender, ProductStatus } from "@prisma/client";
import { faker } from "@faker-js/faker";
import slugify from "slugify";

const FASHION_PRODUCTS = [
  "Oversized Graphic Hoodie",
  "Relaxed Cargo Pants",
  "Linen Shirt",
  "Air Sneakers",
  "Chelsea Boots",
  "Maxi Dress",
  "Denim Jacket",
  "Tailored Blazer",
  "Pleated Skirt",
  "Leather Crossbody Bag",
  "Sweater Dress",
  "Wide-Leg Trousers",
  "Utility Jumpsuit",
  "Silk Cami Top",
  "Chunky Knit Sweater",
];

const GENDER_OPTIONS: Gender[] = ["MALE", "FEMALE", "UNISEX"];
const STATUS_OPTIONS: ProductStatus[] = ["DRAFT", "ACTIVE", "ARCHIVED"];

/**
 * Seed products while maintaining relationships to vendors, brands, and categories.
 * Uses upsert to avoid duplicate product creation on repeated runs.
 */
export async function seedProducts(
  prisma: PrismaClient,
  vendorIds: string[],
  brandIds: string[],
  categoryIds: string[],
  count: number
): Promise<string[]> {
  console.log(`🌱 Seeding ${count} products...`);

  const productIds: string[] = [];

  for (let i = 1; i <= count; i++) {
    const index = String(i).padStart(3, "0");
    const baseName = FASHION_PRODUCTS[(i - 1) % FASHION_PRODUCTS.length];
    const name = `${baseName} ${index}`;
    const slug = slugify(name, { lower: true });
    const vendorId = vendorIds[Math.floor(Math.random() * vendorIds.length)];
    const brandId = brandIds[Math.floor(Math.random() * brandIds.length)];
    const categoryId =
      categoryIds[Math.floor(Math.random() * categoryIds.length)];
    const gender = GENDER_OPTIONS[Math.floor(Math.random() * GENDER_OPTIONS.length)];
    const status = STATUS_OPTIONS[Math.floor(Math.random() * STATUS_OPTIONS.length)];
    const price = parseFloat((Math.random() * 150 + 20).toFixed(2));
    const stock = Math.floor(Math.random() * 200) + 10;
    const description = faker.commerce.productDescription();
    const sku = `SKU-${slug}`;

    const product = await prisma.product.upsert({
      where: { slug },
      create: {
        name,
        slug,
        description,
        price,
        stock,
        sku,
        featured: Math.random() > 0.7,
        status,
        gender,
        vendorId,
        brandId,
        categoryId,
      },
      update: {
        name,
        description,
        price,
        stock,
        sku,
        featured: Math.random() > 0.7,
        status,
        gender,
        vendorId,
        brandId,
        categoryId,
      },
    });

    productIds.push(product.id);
  }

  console.log(`✅ Seeded ${count} products`);
  return productIds;
}

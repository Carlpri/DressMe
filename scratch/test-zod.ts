import { createProductSchema } from "../DATABASE/src/modules/products/product.validation.js";

const payload = {
  name: "Test Product",
  description: "Test description that is long enough",
  price: 2500,
  compareAtPrice: undefined,
  stock: 10,
  sku: "DM-TEST-1234",
  gender: "UNISEX",
  categoryIds: ["cat_123"],
  brandId: "brand_123",
  status: "ACTIVE",
  featured: false,
  isTrending: false,
  isNewArrival: true,
  isBestSeller: false,
  images: [{ imageUrl: "http://example.com/image.jpg", isPrimary: true, displayOrder: 0 }],
  variants: [
    {
      sizeId: "size_123",
      sizeValue: "M",
      colorId: "color_123",
      colorValue: "Red",
      price: 2500,
      stock: 10,
      isAvailable: true,
      sku: "DM-V-TEST-1234",
    }
  ]
};

const result = createProductSchema.safeParse({ body: payload });
if (!result.success) {
  console.error("Zod Validation Failed:", JSON.stringify(result.error.issues, null, 2));
} else {
  console.log("Zod Validation Passed!");
}

import { Gender, ProductStatus } from "@prisma/client";
import { z } from "zod";

const priceSchema = z.number().positive().finite();

const imagesHaveExactlyOnePrimary = (images?: { isPrimary?: boolean }[]) => {
  if (!images) {
    return true;
  }

  return images.filter((image) => image.isPrimary === true).length === 1;
};

const variantsAreUnique = (variants?: { size: string; color: string }[]) => {
  if (!variants) {
    return true;
  }

  const keys = variants.map(
    (variant) =>
      `${variant.size.trim().toLowerCase()}::${variant.color.trim().toLowerCase()}`
  );

  return new Set(keys).size === keys.length;
};

const imageSchema = z.object({
  id: z.string().min(1).optional(),
  imageUrl: z.string().url("Image must be a valid URL"),
  altText: z.string().trim().max(150).optional(),
  displayOrder: z.number().int().min(0).optional(),
  isPrimary: z.boolean().optional(),
});

const variantSchema = z.object({
  id: z.string().min(1).optional(),
  size: z.string().trim().min(1),
  color: z.string().trim().min(1),
  stock: z.number().int().min(0),
  sku: z.string().trim().min(2),
  price: priceSchema.optional(),
  imageUrl: z.string().url().optional(),
});

const createProductBodySchema = z
  .object({
    name: z.string().trim().min(2).max(150),
    description: z.string().trim().min(5),
    price: priceSchema,
    compareAtPrice: priceSchema.optional().nullable(),
    stock: z.number().int().min(0),
    sku: z.string().trim().min(2),
    gender: z.enum(Gender),
    categoryId: z.string().min(1),
    brandId: z.string().min(1),
    vendorId: z.string().min(1).optional(),
    images: z.array(imageSchema).optional(),
    variants: z.array(variantSchema).optional(),
    featured: z.boolean().optional(),
    isTrending: z.boolean().optional(),
    isNewArrival: z.boolean().optional(),
    isBestSeller: z.boolean().optional(),
    status: z.enum(ProductStatus).optional(),
  })
  .refine((data) => imagesHaveExactlyOnePrimary(data.images), {
    path: ["images"],
    message: "Exactly one product image must be primary.",
  })
  .refine((data) => variantsAreUnique(data.variants), {
    path: ["variants"],
    message: "Variants cannot have duplicate size and color combinations.",
  });

const updateProductBodySchema = z
  .object({
    name: z.string().trim().min(2).max(150).optional(),
    description: z.string().trim().min(5).optional(),
    price: priceSchema.optional(),
    compareAtPrice: priceSchema.optional().nullable(),
    stock: z.number().int().min(0).optional(),
    sku: z.string().trim().min(2).optional(),
    gender: z.enum(Gender).optional(),
    categoryId: z.string().min(1).optional(),
    brandId: z.string().min(1).optional(),
    images: z.array(imageSchema).optional(),
    variants: z.array(variantSchema).optional(),
    featured: z.boolean().optional(),
    isTrending: z.boolean().optional(),
    isNewArrival: z.boolean().optional(),
    isBestSeller: z.boolean().optional(),
    status: z.enum(ProductStatus).optional(),
  })
  .refine((data) => imagesHaveExactlyOnePrimary(data.images), {
    path: ["images"],
    message: "Exactly one product image must be primary.",
  })
  .refine((data) => variantsAreUnique(data.variants), {
    path: ["variants"],
    message: "Variants cannot have duplicate size and color combinations.",
  });

export const createProductSchema = z.object({
  body: createProductBodySchema,
});

export const updateProductSchema = z.object({
  body: updateProductBodySchema,
});

export const productFilterSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    category: z.string().trim().min(1).optional(),
    brand: z.string().trim().min(1).optional(),
    gender: z.enum(Gender).optional(),
    status: z.enum(ProductStatus).optional(),
    featured: z
      .union([z.boolean(), z.enum(["true", "false"])])
      .transform((val) => val === true || val === "true")
      .optional(),
    isTrending: z
      .union([z.boolean(), z.enum(["true", "false"])])
      .transform((val) => val === true || val === "true")
      .optional(),
    isNewArrival: z
      .union([z.boolean(), z.enum(["true", "false"])])
      .transform((val) => val === true || val === "true")
      .optional(),
    isBestSeller: z
      .union([z.boolean(), z.enum(["true", "false"])])
      .transform((val) => val === true || val === "true")
      .optional(),
    priceMin: z.coerce.number().min(0).finite().optional(),
    priceMax: z.coerce.number().min(0).finite().optional(),
    size: z.string().trim().optional(),
    color: z.string().trim().optional(),
    search: z.string().trim().min(1).optional(),
    sort: z
      .enum(["newest", "oldest", "price_asc", "price_desc", "popular", "rating"])
      .default("newest"),
  }),
});

export const productIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const productSlugParamSchema = z.object({
  params: z.object({
    slug: z.string().min(1),
  }),
});

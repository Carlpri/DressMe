import { Prisma, ProductStatus } from "@prisma/client";
import prisma from "../../config/prisma.js";
import { ApiError } from "../../utils/api-error.js";
import type {
  CreateProductDto,
  ProductFilters,
  ProductImageDto,
  ProductVariantDto,
  UpdateProductDto,
} from "./product.types.js";

const productInclude = {
  category: true,
  brand: true,
  vendor: {
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  },
  images: {
    orderBy: {
      displayOrder: "asc",
    },
  },
  variants: true,
} as const;

export class ProductRepository {
  async create(
    vendorId: string,
    slug: string,
    data: CreateProductDto
  ) {
    return prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        price: data.price,
        stock: data.stock,
        sku: data.sku,
        gender: data.gender,
        featured: data.featured,
        status: data.status,
        vendorId,
        categoryId: data.categoryId,
        brandId: data.brandId,
        images: data.images
          ? {
              create: data.images.map((image) => ({
                imageUrl: image.imageUrl,
                altText: image.altText,
                displayOrder: image.displayOrder,
                isPrimary: image.isPrimary,
              })),
            }
          : undefined,
        variants: data.variants
          ? {
              create: data.variants.map((variant) => ({
                size: variant.size,
                color: variant.color,
                stock: variant.stock,
                sku: variant.sku,
                price: variant.price,
                imageUrl: variant.imageUrl,
              })),
            }
          : undefined,
      },
      include: productInclude,
    });
  }

  async findAll(filters: ProductFilters) {
    const where = this.buildWhere(filters);
    const orderBy = this.buildOrderBy(filters.sort);
    const skip = (filters.page - 1) * filters.limit;

    const [items, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        include: productInclude,
        orderBy,
        skip,
        take: filters.limit,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      items,
      page: filters.page,
      limit: filters.limit,
      total,
      totalPages: Math.ceil(total / filters.limit),
    };
  }

  async findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: productInclude,
    });
  }

  async findBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug },
      include: productInclude,
    });
  }

  async findActiveBySlug(slug: string) {
    return prisma.product.findFirst({
      where: {
        slug,
        status: {
          not: ProductStatus.ARCHIVED,
        },
      },
      include: productInclude,
    });
  }

  async findBySku(sku: string) {
    return prisma.product.findUnique({
      where: { sku },
    });
  }

  async findVariantBySku(sku: string) {
    return prisma.productVariant.findUnique({
      where: { sku },
    });
  }

  async findCategoryById(id: string) {
    return prisma.category.findUnique({
      where: { id },
    });
  }

  async findBrandById(id: string) {
    return prisma.brand.findUnique({
      where: { id },
    });
  }

  async findVendorById(id: string) {
    return prisma.vendor.findUnique({
      where: { id },
    });
  }

  async findVendorByUserId(userId: string) {
    return prisma.vendor.findUnique({
      where: { userId },
    });
  }

  async update(
    id: string,
    data: UpdateProductDto & {
      slug?: string;
    }
  ) {
    const {
      images,
      variants,
      ...productData
    } = data;

    return prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id },
        data: productData,
      });

      if (images) {
        await this.syncImages(tx, id, images);
      }

      if (variants) {
        await this.syncVariants(tx, id, variants);
      }

      return tx.product.findUniqueOrThrow({
        where: { id },
        include: productInclude,
      });
    });
  }

  async softDelete(id: string) {
    return prisma.product.update({
      where: { id },
      data: {
        status: ProductStatus.ARCHIVED,
      },
    });
  }

  private async syncImages(
    tx: Prisma.TransactionClient,
    productId: string,
    images: ProductImageDto[]
  ) {
    const existing = await tx.productImage.findMany({
      where: { productId },
      select: { id: true },
    });
    const incomingIds = images
      .map((image) => image.id)
      .filter((id): id is string => Boolean(id));

    await tx.productImage.deleteMany({
      where: {
        productId,
        id: {
          notIn: incomingIds,
        },
      },
    });

    for (const image of images) {
      const imageData = {
        imageUrl: image.imageUrl,
        altText: image.altText,
        displayOrder: image.displayOrder,
        isPrimary: image.isPrimary,
      };

      if (image.id) {
        const result = await tx.productImage.updateMany({
          where: {
            id: image.id,
            productId,
          },
          data: imageData,
        });

        if (result.count === 0) {
          throw new ApiError(400, "Product image is invalid.");
        }
      } else {
        await tx.productImage.create({
          data: {
            ...imageData,
            productId,
          },
        });
      }
    }

    const existingIds = new Set(existing.map((image) => image.id));
    const invalidId = incomingIds.find((id) => !existingIds.has(id));

    if (invalidId) {
      throw new ApiError(400, "Product image is invalid.");
    }
  }

  private async syncVariants(
    tx: Prisma.TransactionClient,
    productId: string,
    variants: ProductVariantDto[]
  ) {
    const existing = await tx.productVariant.findMany({
      where: { productId },
      select: { id: true },
    });
    const incomingIds = variants
      .map((variant) => variant.id)
      .filter((id): id is string => Boolean(id));

    await tx.productVariant.deleteMany({
      where: {
        productId,
        id: {
          notIn: incomingIds,
        },
      },
    });

    for (const variant of variants) {
      const variantData = {
        size: variant.size,
        color: variant.color,
        stock: variant.stock,
        sku: variant.sku,
        price: variant.price,
        imageUrl: variant.imageUrl,
      };

      if (variant.id) {
        const result = await tx.productVariant.updateMany({
          where: {
            id: variant.id,
            productId,
          },
          data: variantData,
        });

        if (result.count === 0) {
          throw new ApiError(400, "Product variant is invalid.");
        }
      } else {
        await tx.productVariant.create({
          data: {
            ...variantData,
            productId,
          },
        });
      }
    }

    const existingIds = new Set(existing.map((variant) => variant.id));
    const invalidId = incomingIds.find((id) => !existingIds.has(id));

    if (invalidId) {
      throw new ApiError(400, "Product variant is invalid.");
    }
  }

  private buildWhere(filters: ProductFilters): Prisma.ProductWhereInput {
    const and: Prisma.ProductWhereInput[] = [];

    if (filters.status) {
      and.push({ status: filters.status });
    } else {
      and.push({
        status: {
          not: ProductStatus.ARCHIVED,
        },
      });
    }

    if (filters.category) {
      and.push({
        OR: [
          { categoryId: filters.category },
          { category: { slug: filters.category } },
        ],
      });
    }

    if (filters.brand) {
      and.push({
        OR: [
          { brandId: filters.brand },
          { brand: { slug: filters.brand } },
        ],
      });
    }

    if (filters.gender) {
      and.push({ gender: filters.gender });
    }

    if (filters.featured !== undefined) {
      and.push({ featured: filters.featured });
    }

    if (
      filters.priceMin !== undefined ||
      filters.priceMax !== undefined
    ) {
      and.push({
        price: {
          gte: filters.priceMin,
          lte: filters.priceMax,
        },
      });
    }

    if (filters.search) {
      and.push({
        OR: [
          {
            name: {
              contains: filters.search,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: filters.search,
              mode: "insensitive",
            },
          },
        ],
      });
    }

    return {
      AND: and,
    };
  }

  private buildOrderBy(
    sort: ProductFilters["sort"]
  ): Prisma.ProductOrderByWithRelationInput[] {
    switch (sort) {
      case "oldest":
        return [{ createdAt: "asc" }];
      case "price_asc":
        return [{ price: "asc" }];
      case "price_desc":
        return [{ price: "desc" }];
      case "popular":
        return [{ sales: "desc" }, { views: "desc" }];
      case "newest":
      default:
        return [{ createdAt: "desc" }];
    }
  }
}

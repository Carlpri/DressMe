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
  ProductCategory: {
    include: {
      Category: true,
    },
  },
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
    return prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name: data.name,
          slug,
          description: data.description,
          price: data.price,
          compareAtPrice: data.compareAtPrice,
          stock: data.stock,
          sku: data.sku,
          gender: data.gender,
          featured: data.featured,
          isTrending: data.isTrending,
          isNewArrival: data.isNewArrival,
          isBestSeller: data.isBestSeller,
          status: data.status,
          vendorId,
          brandId: data.brandId,
          ProductCategory: {
            create: data.categoryIds.map((categoryId) => ({
              categoryId,
              isPrimary: categoryId === data.categoryIds[0],
            })),
          },
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
                  sizeValue: variant.sizeValue,
                  colorValue: variant.colorValue,
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

      const createdProduct = await tx.product.findUniqueOrThrow({
        where: { id: product.id },
        include: productInclude,
      });

      return this.normalizeProduct(createdProduct);
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
      items: items.map((item) => this.normalizeProduct(item)),
      page: filters.page,
      limit: filters.limit,
      total,
      totalPages: Math.ceil(total / filters.limit),
    };
  }

  async findById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: productInclude,
    });

    return product ? this.normalizeProduct(product) : null;
  }

  async findBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: productInclude,
    });

    return product ? this.normalizeProduct(product) : null;
  }

  async findActiveBySlug(slug: string) {
    const product = await prisma.product.findFirst({
      where: {
        slug,
        status: {
          not: ProductStatus.ARCHIVED,
        },
      },
      include: productInclude,
    });

    return product ? this.normalizeProduct(product) : null;
  }

  async findBySku(sku: string) {
    return prisma.product.findUnique({
      where: { sku },
    });
  }

  async findByNameCategoryBrand(
    name: string,
    categoryIds: string[],
    brandId: string
  ) {
    return prisma.product.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
        brandId,
        ProductCategory: {
          some: {
            categoryId: {
              in: categoryIds,
            },
          },
        },
      },
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
      categoryIds,
      ...productData
    } = data;

    return prisma.$transaction(async (tx) => {
      const product = await tx.product.update({
        where: { id },
        data: productData,
      });

      if (categoryIds) {
        await this.syncCategories(tx, id, categoryIds);
      }

      if (images) {
        await this.syncImages(tx, id, images);
      }

      if (variants) {
        await this.syncVariants(tx, id, variants);
      }

      const updatedProduct = await tx.product.findUniqueOrThrow({
        where: { id },
        include: productInclude,
      });

      return this.normalizeProduct(updatedProduct);
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

  private normalizeProduct(product: Prisma.ProductGetPayload<{ include: typeof productInclude }>) {
    return {
      ...product,
      categories: (product.ProductCategory ?? []).map((item) => ({
        id: item.Category?.id,
        name: item.Category?.name,
        slug: item.Category?.slug,
        image: item.Category?.image,
      })).filter(Boolean),
      images: product.images ?? [],
      variants: product.variants ?? [],
      ProductCategory: undefined,
    };
  }

  private async syncCategories(
    tx: Prisma.TransactionClient,
    productId: string,
    categoryIds: string[]
  ) {
    const existing = await tx.productCategory.findMany({
      where: { productId },
      select: { categoryId: true },
    });

    const incoming = [...new Set(categoryIds)];
    const existingIds = new Set(existing.map((item) => item.categoryId));
    const incomingIds = new Set(incoming);

    await tx.productCategory.deleteMany({
      where: {
        productId,
        categoryId: {
          notIn: incoming,
        },
      },
    });

    for (const categoryId of incoming) {
      if (!existingIds.has(categoryId)) {
        await tx.productCategory.create({
          data: {
            productId,
            categoryId,
            isPrimary: categoryId === incoming[0],
          },
        });
      }
    }
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
        stock: variant.stock,
        sku: variant.sku,
        price: variant.price,
        imageUrl: variant.imageUrl,
        colorValue: variant.colorValue,
        sizeValue: variant.sizeValue,
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

    // TODO: Fix category filter with ProductCategory junction
    // if (filters.category) {
    //   and.push({
    //     ProductCategory: {
    //       some: {
    //         OR: [
    //           { categoryId: filters.category },
    //           { Category: { slug: filters.category } },
    //         ],
    //       },
    //     },
    //   });
    // }

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

    if (filters.isTrending !== undefined) {
      and.push({ isTrending: filters.isTrending });
    }

    if (filters.isNewArrival !== undefined) {
      and.push({ isNewArrival: filters.isNewArrival });
    }

    if (filters.isBestSeller !== undefined) {
      and.push({ isBestSeller: filters.isBestSeller });
    }

    if (filters.category) {
      and.push({
        ProductCategory: {
          some: {
            OR: [
              { categoryId: filters.category },
              { Category: { slug: filters.category } },
            ],
          },
        },
      });
    }

    if (filters.size) {
      and.push({
        variants: {
          some: {
            sizeValue: {
              equals: filters.size,
              mode: "insensitive",
            },
          },
        },
      });
    }

    if (filters.color) {
      and.push({
        variants: {
          some: {
            colorValue: {
              equals: filters.color,
              mode: "insensitive",
            },
          },
        },
      });
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
          {
            sku: {
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
      case "rating":
        return [{ averageRating: "desc" }, { reviewCount: "desc" }];
      case "newest":
      default:
        return [{ createdAt: "desc" }];
    }
  }
}

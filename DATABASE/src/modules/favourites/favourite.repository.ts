import { ProductStatus } from "@prisma/client";
import prisma from "../../config/prisma.js";

const favouriteInclude = {
  product: {
    include: {
      brand: true,
      ProductCategory: {
        include: {
          Category: true,
        },
      },
      vendor: true,
      images: {
        orderBy: {
          displayOrder: "asc",
        },
      },
      variants: true,
    },
  },
} as const;

export class FavouriteRepository {
  async findProductById(productId: string) {
    return prisma.product.findFirst({
      where: {
        id: productId,
        status: {
          not: ProductStatus.ARCHIVED,
        },
      },
    });
  }

  async findByUserAndProduct(
    userId: string,
    productId: string
  ) {
    return prisma.favoriteProduct.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      include: favouriteInclude,
    });
  }

  async create(
    userId: string,
    productId: string
  ) {
    return prisma.favoriteProduct.create({
      data: {
        userId,
        productId,
      },
      include: favouriteInclude,
    });
  }

  async findAllByUser(userId: string) {
    return prisma.favoriteProduct.findMany({
      where: {
        userId,
        product: {
          status: {
            not: ProductStatus.ARCHIVED,
          },
        },
      },
      include: favouriteInclude,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async deleteByUserAndProduct(
    userId: string,
    productId: string
  ) {
    return prisma.favoriteProduct.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  }

  async clearByUser(userId: string) {
    return prisma.favoriteProduct.deleteMany({
      where: {
        userId,
      },
    });
  }
}

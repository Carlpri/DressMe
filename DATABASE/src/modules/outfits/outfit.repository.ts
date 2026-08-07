import { Prisma, ProductStatus } from "@prisma/client";
import prisma from "../../config/prisma.js";
import type {
  CreateOutfitDto,
  UpdateOutfitDto,
} from "./outfit.types.js";

const outfitInclude = {
  creator: {
    select: {
      id: true,
      name: true,
      avatar: true,
    },
  },
  items: {
    include: {
      product: {
        include: {
          brand: true,
          ProductCategory: {
            include: {
              Category: true,
            },
          },
          images: {
            orderBy: {
              displayOrder: "asc",
            },
          },
        },
      },
    },
  },
  savedBy: true,
} as const;

export class OutfitRepository {
  async create(
    creatorId: string,
    slug: string,
    data: CreateOutfitDto
  ) {
    return prisma.outfit.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        style: data.style,
        coverImage: data.coverImage,
        creatorId,
        items: {
          create: data.productIds.map((productId) => ({
            productId,
          })),
        },
      },
      include: outfitInclude,
    });
  }

  async findAll() {
    return prisma.outfit.findMany({
      include: outfitInclude,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findByCreator(creatorId: string) {
    return prisma.outfit.findMany({
      where: { creatorId },
      include: outfitInclude,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findSavedByUser(userId: string) {
    return prisma.savedOutfit.findMany({
      where: { userId },
      include: {
        outfit: {
          include: outfitInclude,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: string) {
    return prisma.outfit.findUnique({
      where: { id },
      include: outfitInclude,
    });
  }

  async findBySlug(slug: string) {
    return prisma.outfit.findUnique({
      where: { slug },
      include: outfitInclude,
    });
  }

  async findProductsByIds(productIds: string[]) {
    return prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
        status: {
          not: ProductStatus.ARCHIVED,
        },
      },
      select: {
        id: true,
      },
    });
  }

  async findByCreatorAndTitle(
  creatorId: string,
  title: string
) {
  return prisma.outfit.findFirst({
    where: {
      creatorId,
      title,
    },
  });
}

  async update(
    id: string,
    data: UpdateOutfitDto & {
      slug?: string;
    }
  ) {
    const {
      productIds,
      ...outfitData
    } = data;

    return prisma.$transaction(async (tx) => {
      await tx.outfit.update({
        where: { id },
        data: outfitData,
      });

      if (productIds) {
        await this.syncItems(tx, id, productIds);
      }

      return tx.outfit.findUniqueOrThrow({
        where: { id },
        include: outfitInclude,
      });
    });
  }

  async delete(id: string) {
    return prisma.$transaction(async (tx) => {
      await tx.savedOutfit.deleteMany({
        where: { outfitId: id },
      });

      await tx.outfitItem.deleteMany({
        where: { outfitId: id },
      });

      return tx.outfit.delete({
        where: { id },
      });
    });
  }

  async findSaved(
    userId: string,
    outfitId: string
  ) {
    return prisma.savedOutfit.findUnique({
      where: {
        userId_outfitId: {
          userId,
          outfitId,
        },
      },
    });
  }

  async save(
    userId: string,
    outfitId: string
  ) {
    return prisma.savedOutfit.create({
      data: {
        userId,
        outfitId,
      },
      include: {
        outfit: {
          include: outfitInclude,
        },
      },
    });
  }

  async unsave(
    userId: string,
    outfitId: string
  ) {
    return prisma.savedOutfit.delete({
      where: {
        userId_outfitId: {
          userId,
          outfitId,
        },
      },
    });
  }

  private async syncItems(
    tx: Prisma.TransactionClient,
    outfitId: string,
    productIds: string[]
  ) {
    await tx.outfitItem.deleteMany({
      where: {
        outfitId,
        productId: {
          notIn: productIds,
        },
      },
    });

    for (const productId of productIds) {
      await tx.outfitItem.upsert({
        where: {
          outfitId_productId: {
            outfitId,
            productId,
          },
        },
        update: {},
        create: {
          outfitId,
          productId,
        },
      });
    }
  }
}

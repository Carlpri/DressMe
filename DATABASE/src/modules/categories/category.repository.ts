import prisma from "../../config/prisma.js";

export class CategoryRepository {
  async create(data: {
    name: string;
    slug: string;
    image?: string;
  }) {
    return prisma.category.create({
      data,
    });
  }

  async findByName(name: string) {
    return prisma.category.findUnique({
      where: {
        name,
      },
    });
  }

  async findBySlug(slug: string) {
    return prisma.category.findUnique({
      where: {
        slug,
      },
    });
  }

  async findById(id: string) {
    return prisma.category.findUnique({
      where: {
        id,
      },
    });
  }

  async findAll() {
    return prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }

  async update(
  id: string,
  data: {
    name?: string;
    slug?: string;
    image?: string;
  }
) {
  return prisma.category.update({
    where: {
      id,
    },
    data,
  });
}

  async delete(id: string) {
    return prisma.category.delete({
      where: {
        id,
      },
    });
  }
}

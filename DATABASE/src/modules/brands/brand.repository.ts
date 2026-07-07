import prisma from "../../config/prisma.js";
import {
  CreateBrandDto,
  UpdateBrandDto,
} from "./brand.types.js";

export class BrandRepository {
  async create(data: {
    name: string;
    slug: string;
    logo?: string;
  }) {
    return prisma.brand.create({
      data,
    });
  }

  async findById(id: string) {
    return prisma.brand.findUnique({
      where: { id },
    });
  }

  async findByName(name: string) {
    return prisma.brand.findUnique({
      where: { name },
    });
  }

  async findBySlug(slug: string) {
    return prisma.brand.findUnique({
      where: { slug },
    });
  }

  async findAll() {
    return prisma.brand.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }

  async update(
    id: string,
    data: UpdateBrandDto & {
      slug?: string;
    }
  ) {
    return prisma.brand.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.brand.delete({
      where: { id },
    });
  }
}
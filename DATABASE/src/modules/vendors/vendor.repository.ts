import prisma from "../../config/prisma.js";
import type {
  CreateVendorDto,
  UpdateVendorDto,
} from "./vendor.types.js";

export class VendorRepository {
  async create(userId: string, 
                data: CreateVendorDto
            ) {
    return prisma.vendor.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async findByUserId(userId: string) {
    return prisma.vendor.findUnique({
      where: {
        userId,
      },
    });
  }

  async findById(id: string) {
    return prisma.vendor.findUnique({
      where: {
        id,
      },
    });
  }

  async findAll() {
    return prisma.vendor.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async update(
    id: string,
    data: UpdateVendorDto
  ) {
    return prisma.vendor.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: string) {
    return prisma.vendor.delete({
      where: {
        id,
      },
    });
  }
}
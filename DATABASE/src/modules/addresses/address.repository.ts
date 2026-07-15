import { Prisma } from "@prisma/client";
import prisma from "../../config/prisma.js";


export class AddressRepository {
  async create(userId: string, data: unknown) {
    return prisma.address.create({
      data: {
        userId,
        ...(data as Omit<Prisma.AddressUncheckedCreateInput, 'userId'>),
      },
    });
  }

  async findAllByUser(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: [
        {
          isDefault: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    });
  }

  async findById(id: string) {
    return prisma.address.findUnique({
      where: { id },
    });
  }

  async findDefaultByUser(userId: string) {
    return prisma.address.findFirst({
      where: {
        userId,
        isDefault: true,
      },
    });
  }

  async countByUser(userId: string) {
    return prisma.address.count({
      where: { userId },
    });
  }

  async update(id: string, data: unknown) {
    return prisma.address.update({
      where: { id },
      data: data as Prisma.AddressUpdateInput,
    });
  }

  async delete(id: string) {
    return prisma.address.delete({
      where: { id },
    });
  }

  async setAllNonDefaultForUser(userId: string) {
    return prisma.address.updateMany({
      where: {
        userId,
        isDefault: true,
      },
      data: {
        isDefault: false,
      },
    });
  }
}

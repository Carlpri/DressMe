import prisma from "../../config/prisma.js";

export class SiteSettingsRepository {
  async findFirst() {
    return prisma.appSettings.findFirst();
  }

  async findById(id: string) {
    return prisma.appSettings.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: any) {
    return prisma.appSettings.update({
      where: { id },
      data,
    });
  }

  async create(data: any) {
    return prisma.appSettings.create({
      data,
    });
  }
}

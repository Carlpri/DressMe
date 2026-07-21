import prisma from "../../config/prisma.js";
import { CreateMediaInput } from "./media.types.js";

export class MediaRepository {
  async findAll(search?: string, folder?: string) {
    return prisma.mediaItem.findMany({
      where: {
        ...(folder ? { folder } : {}),
        ...(search
          ? {
              OR: [
                { filename: { contains: search, mode: "insensitive" } },
                { altText: { contains: search, mode: "insensitive" } },
                { url: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async create(data: CreateMediaInput) {
    return prisma.mediaItem.create({
      data: {
        filename: data.filename,
        url: data.url,
        altText: data.altText,
        folder: data.folder || "general",
        mimeType: data.mimeType,
        size: data.size,
        createdBy: data.createdBy,
      },
    });
  }

  async delete(id: string) {
    return prisma.mediaItem.delete({
      where: { id },
    });
  }
}

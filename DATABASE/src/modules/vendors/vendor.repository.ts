import prisma from "../../config/prisma.js";
import type {
  CreateVendorDto,
  UpdateVendorDto,
} from "./vendor.types.js";

export class VendorRepository {
  async create(userId: string, data: CreateVendorDto) {
      return prisma.vendor.create({
      data: {
        userId,
        businessName:  data.businessName,
        whatsappNumber: data.whatsappNumber,
        address:       data.address,
        location:      data.location,
        phoneNumber:   data.phoneNumber   ?? null,
        email:         data.email         ?? null,   // Prisma column = email
        businessEmail: data.businessEmail ?? null,   // Prisma column = businessEmail
        city:          data.city          ?? null,
        county:        data.county        ?? null,
        town:          data.town          ?? null,
        contactPerson: data.contactPerson ?? null,
        logo:          data.logo          ?? null,
        description:   data.description   ?? null,
        coverImage:    data.coverImage    ?? null,
        facebook:      data.facebook      ?? null,
        instagram:     data.instagram     ?? null,
        tiktok:        data.tiktok        ?? null,
        website:       data.website       ?? null,
      },
    });
  }

  async findByUserId(userId: string) {
    return prisma.vendor.findUnique({
      where: { userId },
    });
  }

  async findById(id: string) {
    return prisma.vendor.findUnique({
      where: { id },
    });
  }

  async findAll() {
    return prisma.vendor.findMany({
      include: {
        user: {
          select: {
            id:    true,
            name:  true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async update(id: string, data: UpdateVendorDto) {
    // Only pass fields that were explicitly provided (not undefined).
    const patch: Record<string, unknown> = {};

    if (data.businessName   !== undefined) patch.businessName   = data.businessName;
    if (data.whatsappNumber !== undefined) patch.whatsappNumber = data.whatsappNumber;
    if (data.address        !== undefined) patch.address        = data.address;
    if (data.location       !== undefined) patch.location       = data.location;
    if (data.phoneNumber    !== undefined) patch.phoneNumber    = data.phoneNumber;
    if (data.email          !== undefined) patch.email          = data.email;
    if (data.businessEmail  !== undefined) patch.businessEmail  = data.businessEmail;
    if (data.city           !== undefined) patch.city           = data.city;
    if (data.county         !== undefined) patch.county         = data.county;
    if (data.town           !== undefined) patch.town           = data.town;
    if (data.contactPerson  !== undefined) patch.contactPerson  = data.contactPerson;
    if (data.logo           !== undefined) patch.logo           = data.logo;
    if (data.description    !== undefined) patch.description    = data.description;
    if (data.coverImage     !== undefined) patch.coverImage     = data.coverImage;
    if (data.facebook       !== undefined) patch.facebook       = data.facebook;
    if (data.instagram      !== undefined) patch.instagram      = data.instagram;
    if (data.tiktok         !== undefined) patch.tiktok         = data.tiktok;
    if (data.website        !== undefined) patch.website        = data.website;

    return prisma.vendor.update({
      where: { id },
      data: patch,
    });
  }

  async delete(id: string) {
    return prisma.vendor.delete({
      where: { id },
    });
  }
}
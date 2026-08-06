import prisma from "../../config/prisma.js";

export class ReferenceRepository {
  async getAttributes() {
    return prisma.attribute.findMany({
      orderBy: {
        displayOrder: "asc",
      },
      include: {
        AttributeValue: {
          orderBy: {
            value: "asc",
          },
        },
      },
    });
  }

  async getColors() {
    return prisma.color.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        displayOrder: "asc",
      },
    });
  }

  async getSizes() {
    return prisma.size.findMany({
      orderBy: {
        displayOrder: "asc",
      },
    });
  }

  async getLocations() {
    const vendors = await prisma.vendor.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        location: true,
        city: true,
        county: true,
      },
      distinct: ["location", "city", "county"],
    });

    return vendors.map((v) => ({
      id: v.id,
      location: v.location,
      city: v.city,
      county: v.county,
    }));
  }
}

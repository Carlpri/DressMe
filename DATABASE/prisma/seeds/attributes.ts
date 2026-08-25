import { PrismaClient } from "@prisma/client";
import { randomUUID } from "node:crypto";

const ATTRIBUTES = [
  { name: "Material", slug: "material", values: ["Cotton", "Linen", "Denim"] },
  { name: "Fit", slug: "fit", values: ["Regular", "Slim", "Oversized"] },
];

export async function seedAttributes(prisma: PrismaClient): Promise<void> {
  console.log("Seeding attributes...");

  for (const definition of ATTRIBUTES) {
    const attribute = await prisma.attribute.upsert({
      where: { slug: definition.slug },
      create: {
        id: randomUUID(),
        name: definition.name,
        slug: definition.slug,
      },
      update: { name: definition.name },
    });

    for (const value of definition.values) {
      await prisma.attributeValue.upsert({
        where: {
          attributeId_value: { attributeId: attribute.id, value },
        },
        create: {
          id: randomUUID(),
          attributeId: attribute.id,
          value,
          slug: value.toLowerCase(),
        },
        update: { slug: value.toLowerCase() },
      });
    }
  }
}

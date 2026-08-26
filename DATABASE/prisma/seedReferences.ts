import "dotenv/config";
import { PrismaClient, SizeCategory } from "@prisma/client";
import { randomUUID } from "node:crypto";

const prisma = new PrismaClient();

const CLOTHING_SIZES = [
  { name: "XS", category: SizeCategory.ADULT, displayOrder: 1 },
  { name: "S", category: SizeCategory.ADULT, displayOrder: 2 },
  { name: "M", category: SizeCategory.ADULT, displayOrder: 3 },
  { name: "L", category: SizeCategory.ADULT, displayOrder: 4 },
  { name: "XL", category: SizeCategory.ADULT, displayOrder: 5 },
  { name: "XXL", category: SizeCategory.ADULT, displayOrder: 6 },
];

const SHOE_SIZES = [
  { name: "36", category: SizeCategory.FOOTWEAR, displayOrder: 10 },
  { name: "37", category: SizeCategory.FOOTWEAR, displayOrder: 11 },
  { name: "38", category: SizeCategory.FOOTWEAR, displayOrder: 12 },
  { name: "39", category: SizeCategory.FOOTWEAR, displayOrder: 13 },
  { name: "40", category: SizeCategory.FOOTWEAR, displayOrder: 14 },
  { name: "41", category: SizeCategory.FOOTWEAR, displayOrder: 15 },
  { name: "42", category: SizeCategory.FOOTWEAR, displayOrder: 16 },
  { name: "43", category: SizeCategory.FOOTWEAR, displayOrder: 17 },
  { name: "44", category: SizeCategory.FOOTWEAR, displayOrder: 18 },
  { name: "45", category: SizeCategory.FOOTWEAR, displayOrder: 19 },
];

const UNIVERSAL_SIZES = [
  { name: "Universal", category: SizeCategory.UNIVERSAL, displayOrder: 30 },
];

const SIZES = [...CLOTHING_SIZES, ...SHOE_SIZES, ...UNIVERSAL_SIZES];

const COLORS = [
  { name: "Black", hexCode: "#000000", displayOrder: 1 },
  { name: "White", hexCode: "#FFFFFF", displayOrder: 2 },
  { name: "Blue", hexCode: "#0000FF", displayOrder: 3 },
  { name: "Red", hexCode: "#FF0000", displayOrder: 4 },
  { name: "Green", hexCode: "#008000", displayOrder: 5 },
  { name: "Grey", hexCode: "#808080", displayOrder: 6 },
  { name: "Brown", hexCode: "#A52A2A", displayOrder: 7 },
  { name: "Navy", hexCode: "#000080", displayOrder: 8 },
  { name: "Beige", hexCode: "#F5F5DC", displayOrder: 9 },
  { name: "Cream", hexCode: "#FFFDD0", displayOrder: 10 },
  { name: "Pink", hexCode: "#FFC0CB", displayOrder: 11 },
  { name: "Purple", hexCode: "#800080", displayOrder: 12 },
  { name: "Yellow", hexCode: "#FFFF00", displayOrder: 13 },
  { name: "Orange", hexCode: "#FFA500", displayOrder: 14 },
  { name: "Maroon", hexCode: "#800000", displayOrder: 15 },
];

export async function seedReferences() {
  console.log("🌱 Checking and seeding Sizes reference data...");
  let sizesCreated = 0;
  let sizesUpdated = 0;

  for (const s of SIZES) {
    const existing = await prisma.size.findUnique({ where: { name: s.name } });
    if (existing) {
      await prisma.size.update({
        where: { name: s.name },
        data: { category: s.category, displayOrder: s.displayOrder },
      });
      sizesUpdated++;
    } else {
      await prisma.size.create({
        data: {
          id: randomUUID(),
          name: s.name,
          category: s.category,
          displayOrder: s.displayOrder,
        },
      });
      sizesCreated++;
    }
  }
  console.log(`✅ Sizes: ${sizesCreated} created, ${sizesUpdated} updated.`);

  console.log("🌱 Checking and seeding Colors reference data...");
  let colorsCreated = 0;
  let colorsUpdated = 0;

  for (const c of COLORS) {
    const existing = await prisma.color.findUnique({ where: { name: c.name } });
    if (existing) {
      await prisma.color.update({
        where: { name: c.name },
        data: { hexCode: c.hexCode, displayOrder: c.displayOrder, isActive: true },
      });
      colorsUpdated++;
    } else {
      await prisma.color.create({
        data: {
          id: randomUUID(),
          name: c.name,
          hexCode: c.hexCode,
          displayOrder: c.displayOrder,
          isActive: true,
        },
      });
      colorsCreated++;
    }
  }
  console.log(`✅ Colors: ${colorsCreated} created, ${colorsUpdated} updated.`);
}

seedReferences()
  .catch((e) => {
    console.error("❌ Seeding references failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

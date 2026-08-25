import { PrismaClient } from "@prisma/client";
import { randomUUID } from "node:crypto";

const DEFAULT_COLORS = [
  { name: "Black", hexCode: "#000000" },
  { name: "White", hexCode: "#FFFFFF" },
  { name: "Red", hexCode: "#FF0000" },
  { name: "Blue", hexCode: "#0000FF" },
  { name: "Green", hexCode: "#008000" },
  { name: "Yellow", hexCode: "#FFFF00" },
  { name: "Orange", hexCode: "#FFA500" },
  { name: "Purple", hexCode: "#800080" },
  { name: "Pink", hexCode: "#FFC0CB" },
  { name: "Brown", hexCode: "#A52A2A" },
  { name: "Gray", hexCode: "#808080" },
  { name: "Navy", hexCode: "#000080" },
  { name: "Beige", hexCode: "#F5F5DC" },
  { name: "Cream", hexCode: "#FFFDD0" },
  { name: "Gold", hexCode: "#FFD700" },
  { name: "Silver", hexCode: "#C0C0C0" },
  { name: "Burgundy", hexCode: "#800020" },
  { name: "Teal", hexCode: "#008080" },
  { name: "Maroon", hexCode: "#800000" },
  { name: "Lavender", hexCode: "#E6E6FA" },
];

/**
 * Seed color records with deterministic IDs and names.
 * Uses upsert to avoid duplicate color creation.
 */
export async function seedColors(
  prisma: PrismaClient,
  count: number
): Promise<string[]> {
  console.log(`🌱 Seeding ${count} colors...`);

  const colorIds: string[] = [];

  for (let i = 1; i <= count; i++) {
    const index = String(i).padStart(3, "0");
    const colorData =
      i <= DEFAULT_COLORS.length
        ? DEFAULT_COLORS[i - 1]
        : { name: `COLOR${index}`, hexCode: null };

    const color = await prisma.color.upsert({
      where: { name: colorData.name },
      create: {
        id: randomUUID(),
        name: colorData.name,
        hexCode: colorData.hexCode,
      },
      update: {
        hexCode: colorData.hexCode,
      },
    });

    colorIds.push(color.id);
  }

  console.log(`✅ Seeded ${count} colors`);
  return colorIds;
}

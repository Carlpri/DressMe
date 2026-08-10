import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function generateId(prefix: string, index: number): string {
  return `${prefix}${String(index).padStart(3, "0")}`;
}

async function seedReferences() {
  console.log("🌱 Seeding sizes and colors...");

  const sizes = [
    { id: generateId("size", 1), name: "XS", category: "ADULT" },
    { id: generateId("size", 2), name: "S", category: "ADULT" },
    { id: generateId("size", 3), name: "M", category: "ADULT" },
    { id: generateId("size", 4), name: "L", category: "ADULT" },
    { id: generateId("size", 5), name: "XL", category: "ADULT" },
    { id: generateId("size", 6), name: "XXL", category: "ADULT" },
    { id: generateId("size", 7), name: "3XL", category: "ADULT" },
    { id: generateId("size", 8), name: "4XL", category: "ADULT" },
    { id: generateId("size", 9), name: "Universal", category: "ADULT" },
  ];

  const colors = [
    { id: generateId("color", 1), name: "Black", hexCode: "#000000" },
    { id: generateId("color", 2), name: "White", hexCode: "#FFFFFF" },
    { id: generateId("color", 3), name: "Red", hexCode: "#FF0000" },
    { id: generateId("color", 4), name: "Blue", hexCode: "#0000FF" },
    { id: generateId("color", 5), name: "Green", hexCode: "#008000" },
    { id: generateId("color", 6), name: "Yellow", hexCode: "#FFFF00" },
    { id: generateId("color", 7), name: "Orange", hexCode: "#FFA500" },
    { id: generateId("color", 8), name: "Purple", hexCode: "#800080" },
    { id: generateId("color", 9), name: "Pink", hexCode: "#FFC0CB" },
    { id: generateId("color", 10), name: "Brown", hexCode: "#A52A2A" },
    { id: generateId("color", 11), name: "Gray", hexCode: "#808080" },
    { id: generateId("color", 12), name: "Navy", hexCode: "#000080" },
    { id: generateId("color", 13), name: "Beige", hexCode: "#F5F5DC" },
    { id: generateId("color", 14), name: "Gold", hexCode: "#FFD700" },
    { id: generateId("color", 15), name: "Silver", hexCode: "#C0C0C0" },
  ];

  for (const size of sizes) {
    await prisma.size.upsert({
      where: { name: size.name },
      create: size,
      update: { category: size.category },
    });
  }

  for (const color of colors) {
    await prisma.color.upsert({
      where: { name: color.name },
      create: color,
      update: { hexCode: color.hexCode },
    });
  }

  console.log("✅ Sizes and colors seeded successfully");
  await prisma.$disconnect();
}

seedReferences().catch((err) => {
  console.error("Error seeding references:", err);
  process.exit(1);
});

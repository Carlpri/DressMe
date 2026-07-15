import { PrismaClient } from "@prisma/client";

export async function seedSavedOutfits(
  prisma: PrismaClient,
  userIds: string[]
): Promise<void> {
  console.log(`🌱 Seeding saved outfits...`);

  // Get all outfits
  const allOutfits = await prisma.outfit.findMany();

  let savedCount = 0;

  for (const userId of userIds) {
    // Each user saves 3-10 random outfits (from other users)
    const saveCount = Math.floor(Math.random() * 7) + 3;

    for (let i = 0; i < saveCount; i++) {
      const outfit =
        allOutfits[Math.floor(Math.random() * allOutfits.length)];

      // Don't save your own outfits
      if (outfit.creatorId === userId) {
        continue;
      }

      try {
        await prisma.savedOutfit.create({
          data: {
            userId,
            outfitId: outfit.id,
          },
        });
        savedCount++;
      } catch {
        // Skip duplicate saves
      }
    }
  }

  console.log(`✅ Seeded ${savedCount} saved outfits`);
}

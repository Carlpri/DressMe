import { PrismaClient, Role } from "@prisma/client";
import { faker } from "@faker-js/faker";

/**
 * Seed vendors so each vendor is associated with an existing user.
 * Uses upsert-style logic via a unique userId constraint.
 */
export async function seedVendors(
  prisma: PrismaClient,
  userIds: string[],
  count: number
): Promise<string[]> {
  console.log(`🌱 Seeding ${count} vendors...`);

  const vendorIds: string[] = [];
  // User 001 remains the seeded ADMIN account; vendor profiles start at User 002.
  const targetUsers = userIds.slice(1, 1 + Math.min(count, Math.max(userIds.length - 1, 0)));

  for (let i = 1; i <= targetUsers.length; i++) {
    const index = String(i).padStart(3, "0");
    const shopName = `BUSINESS${index}`;
    const userId = targetUsers[i - 1];
    const businessEmail = `business${index}@dressme.co.ke`;

    await prisma.user.update({
      where: { id: userId },
      data: { role: Role.VENDOR },
    });

    const vendor = await prisma.vendor.upsert({
      where: { userId },
      create: {
        shopName,
        phone: faker.phone.number("07########"),
        address: faker.location.streetAddress(),
        location: faker.location.city(),
        description: faker.commerce.productDescription(),
        businessEmail,
        verified: Math.random() > 0.5,
        userId,
      },
      update: {
        shopName,
        phone: faker.phone.number("07########"),
        address: faker.location.streetAddress(),
        location: faker.location.city(),
        description: faker.commerce.productDescription(),
        businessEmail,
        verified: Math.random() > 0.5,
      },
    });

    vendorIds.push(vendor.id);
  }

  console.log(`✅ Seeded ${vendorIds.length} vendors`);
  return vendorIds;
}

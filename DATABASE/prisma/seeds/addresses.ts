import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const KENYAN_COUNTIES = [
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Kericho",
  "Kiambu",
  "Naivasha",
  "Thika",
];

export async function seedAddresses(
  prisma: PrismaClient,
  userIds: string[]
): Promise<void> {
  console.log(`🌱 Seeding addresses for ${userIds.length} users...`);

  for (const userId of userIds) {
    const homeLabel = "Home";
    const workLabel = "Work";

    const homeAddress = await prisma.address.findFirst({
      where: { userId, label: homeLabel },
    });

    if (!homeAddress) {
      await prisma.address.create({
        data: {
          userId,
          fullName: faker.person.fullName(),
          phone: faker.phone.number("07########"),
          county: KENYAN_COUNTIES[
            Math.floor(Math.random() * KENYAN_COUNTIES.length)
          ],
          city: faker.location.city(),
          area: faker.location.state(),
          street: faker.location.street(),
          building: faker.location.buildingNumber(),
          postalCode: faker.location.zipCode(),
          landmark: faker.company.name(),
          label: homeLabel,
          isDefault: true,
        },
      });
    }

    const workAddress = await prisma.address.findFirst({
      where: { userId, label: workLabel },
    });

    if (!workAddress) {
      await prisma.address.create({
        data: {
          userId,
          fullName: faker.person.fullName(),
          phone: faker.phone.number("07########"),
          county: KENYAN_COUNTIES[
            Math.floor(Math.random() * KENYAN_COUNTIES.length)
          ],
          city: faker.location.city(),
          area: faker.location.state(),
          street: faker.location.street(),
          building: faker.location.buildingNumber(),
          postalCode: faker.location.zipCode(),
          landmark: faker.company.name(),
          label: workLabel,
          isDefault: false,
        },
      });
    }
  }

  console.log(`✅ Seeded addresses for ${userIds.length} users`);
}

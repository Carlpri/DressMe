import { PrismaClient, Role, AccountStatus } from "@prisma/client";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;
const DEFAULT_PASSWORD = "Password123!";

/**
 * Seed users using upsert to allow repeated seed execution without duplicates.
 * Passwords are hashed once and reused for every generated user.
 */
export async function seedUsers(
  prisma: PrismaClient,
  count: number
): Promise<string[]> {
  console.log(`🌱 Seeding ${count} users...`);

  const userIds: string[] = [];
  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);

  for (let i = 1; i <= count; i++) {
    const index = String(i).padStart(3, "0");
    const name = `User ${index}`;
    const email = `user${index}@dressme.co.ke`;

    const user = await prisma.user.upsert({
      where: { email },
      create: {
        name,
        email,
        password: hashedPassword,
        role: i === 1 ? Role.ADMIN : Role.USER,
        status: AccountStatus.ACTIVE,
      },
      update: {
        name,
        role: i === 1 ? Role.ADMIN : Role.USER,
        status: AccountStatus.ACTIVE,
      },
    });

    userIds.push(user.id);
  }

  console.log(`✅ Seeded ${count} users`);
  return userIds;
}

import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { PrismaClient, Role, AccountStatus } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    const name = process.env.ADMIN_NAME?.trim() || "DressMe Admin";

    if (!email) {
        throw new Error("ADMIN_EMAIL environment variable is required.");
    }

    if (!password) {
        throw new Error("ADMIN_PASSWORD environment variable is required.");
    }

    if (password.length < 12) {
        throw new Error("ADMIN_PASSWORD must be at least 12 characters long.");
    }

    console.log(`Creating/updating admin account: ${email}`);

    const hashedPassword = await bcrypt.hash(password, 12);

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        const admin = await prisma.user.update({
            where: { email },
            data: {
                role: Role.ADMIN,
                status: AccountStatus.ACTIVE,
                name,
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
            },
        });

        console.log("✅ Existing user promoted to ADMIN:");
        console.log(admin);
        return;
    }

    const admin = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: Role.ADMIN,
            status: AccountStatus.ACTIVE,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
        },
    });

    console.log("✅ ADMIN account created:");
    console.log(admin);
}

main()
    .catch((error) => {
        console.error("❌ Admin seed failed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
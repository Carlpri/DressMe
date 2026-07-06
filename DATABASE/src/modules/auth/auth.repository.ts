import prisma from "../../config/prisma.js";
import type { RegisterUserDto } from "./auth.types.js";

export class AuthRepository {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async createUser(data: RegisterUserDto) {
    return prisma.user.create({
      data,
    });
  }
}
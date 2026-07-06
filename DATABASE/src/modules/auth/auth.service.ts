import bcrypt from "bcrypt";
import { AuthRepository } from "./auth.repository.js";
import type { RegisterUserDto } from "./auth.types.js";
import { ApiError } from "../../utils/api-error.js";
import { generateToken } from "../../utils/jwt.js";

export class AuthService {
  private repository = new AuthRepository();

  async register(data: RegisterUserDto) {
    const existingUser = await this.repository.findUserByEmail(data.email);

    if (existingUser) {
      throw new ApiError(409, "Email is already registered.");
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await this.repository.createUser({
      ...data,
      password: hashedPassword,
    });

    const token = generateToken(user.id, user.role);

    const { password, ...safeUser } = user;

    return {
      user: safeUser,
      token,
    };
  }
}
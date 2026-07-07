import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { Role } from "@prisma/client";

const JWT_SECRET: Secret = process.env.JWT_SECRET!;

export function generateToken
(userId: string, role: Role) {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? "7d") as SignOptions["expiresIn"],
  };

  return jwt.sign(
    {
      userId,
      role,
    },
    JWT_SECRET,
    options
  );
}
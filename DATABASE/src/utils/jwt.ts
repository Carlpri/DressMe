import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { Role } from "@prisma/client";

export function getJwtSecret(): Secret {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret) {
    throw new Error("JWT_SECRET must be configured.");
  }
  return secret;
}

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
    getJwtSecret(),
    options
  );
}

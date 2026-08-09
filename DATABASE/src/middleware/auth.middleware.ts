import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api-error.js";
import { Role } from "@prisma/client";
import prisma from "../config/prisma.js";
import { getJwtSecret } from "../utils/jwt.js";

interface JwtPayload {
  userId: string;
  role: Role;
}

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new ApiError(401, "Authorization token is missing.");
    }

    if (!authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Invalid authorization format.");
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, getJwtSecret()) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, role: true, status: true },
    });

    if (!user || user.status !== "ACTIVE") {
      throw new ApiError(401, "User account is unavailable.");
    }

    req.user = {
      userId: user.id,
      role: user.role,
      };

    next();
  } catch (error) {
    next(new ApiError(401, "Invalid or expired token."));
  }
}


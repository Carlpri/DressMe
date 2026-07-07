import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api-error.js";
import { Role } from "@prisma/client";

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

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    req.user = {
      userId:decoded.userId,
       role:decoded.role,
      };

    next();
  } catch (error) {
    next(new ApiError(401, "Invalid or expired token."));
  }
}


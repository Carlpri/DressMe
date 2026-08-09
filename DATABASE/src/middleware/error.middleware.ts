import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error.js";

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  // Known application errors
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  const details = error instanceof Error ? error : new Error(String(error));
  const isPrismaValidation = details.constructor.name === "PrismaClientValidationError";
  const isPrismaKnown     = details.constructor.name === "PrismaClientKnownRequestError";

  // Log full context to server console (visible in Render logs)
  console.error("[UnhandledError]", {
    type:    details.constructor.name,
    message: details.message,
    // Prisma known errors carry a numeric code
    code:    getPrismaField(error, "code"),
    meta:    getPrismaField(error, "meta"),
    path:    req.path,
    method:  req.method,
  });

  // Return a slightly more informative message for Prisma validation failures
  if (isPrismaValidation) {
    return res.status(500).json({
      success: false,
      message: "Database validation error — check server logs.",
    });
  }

  if (isPrismaKnown) {
    const code = getPrismaField(error, "code");
    // Unique constraint
    if (code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "A record with this value already exists.",
      });
    }
    // Foreign key constraint
    if (code === "P2003") {
      return res.status(400).json({
        success: false,
        message: "Related record not found.",
      });
    }
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
}

function getPrismaField(error: unknown, field: "code" | "meta"): unknown {
  return typeof error === "object" && error !== null && field in error
    ? (error as Record<string, unknown>)[field]
    : undefined;
}

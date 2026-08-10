import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api-error.js";

export function errorHandler(error: unknown, req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({ success: false, message: error.message });
  }

  const details = error instanceof Error ? error : new Error(String(error));
  const code = getPrismaField(error, "code");
  const meta = getPrismaField(error, "meta") as Record<string, unknown> | undefined;
  
  console.error("[UnhandledError]", {
    type: details.constructor.name,
    message: details.message,
    code,
    meta,
    path: req.path,
    method: req.method,
  });

  if (details.constructor.name === "PrismaClientValidationError") {
    const field = meta?.field as string | undefined;
    return res.status(400).json({ 
      success: false, 
      message: field ? `Invalid value for field: ${field}` : "Invalid database request.",
      field
    });
  }

  if (details.constructor.name === "PrismaClientKnownRequestError") {
    if (code === "P2002") {
      const field = meta?.target as string | undefined;
      return res.status(409).json({ 
        success: false, 
        message: field ? `Duplicate value for: ${field}` : "A record with this value already exists.",
        field
      });
    }
    if (code === "P2003") {
      const field = meta?.field_name as string | undefined;
      return res.status(400).json({ 
        success: false, 
        message: field ? `Related record not found for: ${field}` : "Related record not found.",
        field
      });
    }
    if (code === "P2011") {
      const field = meta?.field as string | undefined;
      return res.status(400).json({ 
        success: false, 
        message: field ? `Required value missing for: ${field}` : "A required value is missing.",
        field
      });
    }
    if (code === "P2025") {
      return res.status(404).json({ success: false, message: "Requested record was not found." });
    }
  }

  return res.status(500).json({ success: false, message: "Internal server error." });
}

function getPrismaField(error: unknown, field: "code" | "meta"): unknown {
  return typeof error === "object" && error !== null && field in error
    ? (error as Record<string, unknown>)[field]
    : undefined;
}

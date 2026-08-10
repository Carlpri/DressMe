import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api-error.js";

export function errorHandler(error: unknown, req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({ success: false, message: error.message });
  }

  const details = error instanceof Error ? error : new Error(String(error));
  const code = getPrismaField(error, "code");
  console.error("[UnhandledError]", {
    type: details.constructor.name,
    message: details.message,
    code,
    meta: getPrismaField(error, "meta"),
    path: req.path,
    method: req.method,
  });

  if (details.constructor.name === "PrismaClientValidationError") {
    return res.status(400).json({ success: false, message: "Invalid database request." });
  }

  if (details.constructor.name === "PrismaClientKnownRequestError") {
    if (code === "P2002") return res.status(409).json({ success: false, message: "A record with this value already exists." });
    if (code === "P2003") return res.status(400).json({ success: false, message: "Related record not found." });
    if (code === "P2011") return res.status(400).json({ success: false, message: "A required value is missing." });
    if (code === "P2025") return res.status(404).json({ success: false, message: "Requested record was not found." });
  }

  return res.status(500).json({ success: false, message: "Internal server error." });
}

function getPrismaField(error: unknown, field: "code" | "meta"): unknown {
  return typeof error === "object" && error !== null && field in error
    ? (error as Record<string, unknown>)[field]
    : undefined;
}

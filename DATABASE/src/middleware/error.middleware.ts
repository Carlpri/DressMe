import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/api-error.js";

export function errorHandler(error: unknown, req: Request, res: Response, _next: NextFunction) {
  // ── Known application errors ─────────────────────────────────────────────
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({ success: false, message: error.message });
  }

  // ── Zod validation errors (safety net — validate middleware uses safeParse,
  //    but service-level zod parses can throw ZodError directly) ────────────
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.issues,
    });
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

  // ── Prisma errors ─────────────────────────────────────────────────────────
  if (details.constructor.name === "PrismaClientValidationError") {
    // Prisma received a value of the wrong type (e.g. string where int expected)
    return res.status(400).json({ 
      success: false, 
      message: "Invalid request data — please check all field values.",
    });
  }

  if (details.constructor.name === "PrismaClientKnownRequestError") {
    // P2002 — unique constraint violation
    if (code === "P2002") {
      const field = meta?.target as string | undefined;
      return res.status(409).json({ 
        success: false, 
        message: field ? `Duplicate value for: ${field}` : "A record with this value already exists.",
        field,
      });
    }
    // P2003 — foreign key constraint failed (e.g. invalid sizeId / colorId)
    if (code === "P2003") {
      const field = (meta?.field_name as string | undefined)?.replace(/_fkey$/, "");
      return res.status(400).json({ 
        success: false, 
        message: field
          ? `Invalid value for field "${field}" — the referenced record does not exist.`
          : "A related record was not found. Check all IDs in your request.",
        field,
      });
    }
    // P2011 — null constraint violation
    if (code === "P2011") {
      const field = meta?.field as string | undefined;
      return res.status(400).json({ 
        success: false, 
        message: field ? `Required value missing for: ${field}` : "A required value is missing.",
        field,
      });
    }
    // P2022 — column not found (schema out of sync with DB)
    if (code === "P2022") {
      console.error("[P2022] Schema mismatch — run prisma migrate deploy on the server.", meta);
      return res.status(500).json({ 
        success: false, 
        message: "Server configuration error — the database schema is out of sync. Please contact support.",
        code: "SCHEMA_MISMATCH",
      });
    }
    // P2025 — record not found
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

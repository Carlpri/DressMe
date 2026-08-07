import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error.js";

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  const details = error instanceof Error ? error : new Error(String(error));
  console.error("[UnhandledError]", {
    message: details.message,
    stack: details.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    user: req.user,
  });

  return res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
}
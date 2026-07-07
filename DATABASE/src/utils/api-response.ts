import { Response } from "express";

export class ApiResponse {
  static success(
    res: Response,
    statusCode: number,
    message: string,
    data?: unknown
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }
}
import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service.js";

const authService = new AuthService();

export class AuthController {
  register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = await authService.register(req.body);

      res.status(201).json({
        success: true,
        message: "User registered successfully.",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };
}
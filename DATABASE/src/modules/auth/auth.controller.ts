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
      const result = await authService.register(req.body);

      res.status(201).json({
        success: true,
        message: "User registered successfully.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {  
    try {
        const result = await authService.login(req.body);

        res.status(200).json({
            success: true,
            message: "login was successful.",
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

}
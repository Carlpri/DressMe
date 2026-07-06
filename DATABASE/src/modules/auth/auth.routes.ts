import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { registerSchema,loginSchema } from "./auth.validation.js";

const router = Router();
const authController = new AuthController();

router.post(
  "/register",
  validate(registerSchema),
  authController.register
);

router.post(
    "/login",
    validate(loginSchema),
    authController.login
);
export default router;
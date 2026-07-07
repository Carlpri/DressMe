import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { registerSchema,loginSchema } from "./auth.validation.js";
import { authenticate,  } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";

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

router.get(
    "/me",
    authenticate,
    (req, res) => {
        res.json({
            success: true,
            user: req.user,
        });
    }

);
router.get(
    "/me",
    authenticate,
    (req, res) => {
        res.json({
            success: true,
            user: req.user,
        });
    }
);

router.get(
    "/admin",
    authenticate,
    authorize("ADMIN"),
    (req,res) => {
        res.json({
            message: "Welcome, Admin!",
        });
    }
);

router.get(
    "/vendor",
    authenticate,
    authorize("VENDOR", "ADMIN"),
    (req,res) => {
        res.json({
            message: "Vendor dashboard",
        });
    }
)
export default router;
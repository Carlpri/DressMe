import { Router } from "express";
import { UserController } from "./user.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { updateProfileSchema,changePasswordSchema } from "./user.validation.js";
import { Role } from "@prisma/client";
import { authorize } from "../../middleware/authorize.middleware.js";

const router = Router();

const controller = new UserController();

router.get(
  "/me",
  authenticate,
  controller.getProfile
);

router.get(
  "/",
  authenticate,
  authorize(Role.ADMIN),
  controller.getAllUsers
);


router.patch(
    "/me",
    authenticate,
    validate(updateProfileSchema),
    controller.updateProfile
);

router.patch(
    "/change-password",
    authenticate,
    validate(changePasswordSchema),
    controller.changePassword
)

export default router;
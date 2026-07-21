import { Router } from "express";
import { SiteSettingsController } from "./site-settings.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  updateSiteSettingsSchema,
} from "./site-settings.validation.js";
import { Role } from "@prisma/client";

const router = Router();

const controller = new SiteSettingsController();

// Public endpoint - no authentication required
router.get(
  "/public",
  controller.getPublicSettings
);

// Admin endpoint - requires authentication and ADMIN role
router.get(
  "/",
  authenticate,
  authorize(Role.ADMIN),
  controller.getSettings
);

// Admin endpoint - requires authentication and ADMIN role
router.patch(
  "/:id",
  authenticate,
  authorize(Role.ADMIN),
  validate(updateSiteSettingsSchema),
  controller.updateSettings
);

// Seed endpoint - for initial setup (should be protected in production)
router.post(
  "/seed",
  controller.seedDefaultSettings
);

export default router;

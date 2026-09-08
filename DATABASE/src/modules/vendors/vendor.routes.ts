import { Router } from "express";
import { VendorController } from "./vendor.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  createVendorSchema,
  updateVendorSchema,
} from "./vendor.validation.js";
import { Role } from "@prisma/client";

const router = Router();

const controller = new VendorController();

router.post(
  "/",
  authenticate,
  authorize(Role.VENDOR,Role.ADMIN),
  validate(createVendorSchema),
  controller.createVendor
);

router.get(
  "/",
  controller.getVendors
);

router.get(
  "/me/dashboard",
  authenticate,
  authorize(Role.VENDOR, Role.ADMIN),
  controller.getDashboardSummary
);

router.get(
  "/:id",
  controller.getVendor
);

router.patch(
  "/:id",
  authenticate,
  authorize(Role.VENDOR, Role.ADMIN),
  validate(updateVendorSchema),
  controller.updateVendor
);

router.delete(
  "/:id",
  authenticate,
  authorize(Role.VENDOR,Role.ADMIN),
  controller.deleteVendor
);

export default router;
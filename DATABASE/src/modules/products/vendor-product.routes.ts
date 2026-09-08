import { Role } from "@prisma/client";
import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { ProductController } from "./product.controller.js";
import { productFilterSchema } from "./product.validation.js";

const router = Router();
const controller = new ProductController();

router.get(
  "/",
  authenticate,
  authorize(Role.VENDOR, Role.ADMIN),
  validate(productFilterSchema),
  controller.getVendorProducts
);

export default router;
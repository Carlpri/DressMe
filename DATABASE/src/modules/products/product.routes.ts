import { Role } from "@prisma/client";
import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { ProductController } from "./product.controller.js";
import {
  createProductSchema,
  productFilterSchema,
  productIdParamSchema,
  productSlugParamSchema,
  updateProductSchema,
} from "./product.validation.js";

const router = Router();

const controller = new ProductController();

router.post(
  "/",
  authenticate,
  authorize(Role.ADMIN, Role.VENDOR),
  validate(createProductSchema),
  controller.createProduct
);

router.get(
  "/",
  validate(productFilterSchema),
  controller.getProducts
);

router.get(
  "/:slug",
  validate(productSlugParamSchema),
  controller.getProduct
);

router.patch(
  "/:id",
  authenticate,
  authorize(Role.ADMIN, Role.VENDOR),
  validate(productIdParamSchema.merge(updateProductSchema)),
  controller.updateProduct
);

router.delete(
  "/:id",
  authenticate,
  authorize(Role.ADMIN, Role.VENDOR),
  validate(productIdParamSchema),
  controller.deleteProduct
);

export default router;

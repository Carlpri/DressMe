import { Router } from "express";
import { CategoryController } from "./category.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "./category.validation.js";
import { Role } from "@prisma/client";

const router = Router();

const controller = new CategoryController();

router.post(
  "/",
  authenticate,
  authorize(Role.ADMIN),
  validate(createCategorySchema),
  controller.createCategory
);

router.get(
  "/",
  controller.getCategories
);

router.get(
  "/:slug",
  controller.getCategory
);

router.patch(
  "/:id",
  authenticate,
  authorize(Role.ADMIN),
  validate(updateCategorySchema),
  controller.updateCategory
);

router.delete(
  "/:id",
  authenticate,
  authorize(Role.ADMIN),
  controller.deleteCategory
);

export default router;
import { Router } from "express";
import { BrandController } from "./brand.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  createBrandSchema,
  updateBrandSchema,
} from "./brand.validation.js";
import { Role } from "@prisma/client";

const router = Router();

const controller = new BrandController();

router.post(
  "/",
  (req,_res,next) => {
    console.log(req.body);
    next();
  },
  authenticate,
  authorize(Role.ADMIN),
  validate(createBrandSchema),
  controller.createBrand
);

router.get(
  "/",
  controller.getBrands
);

router.get(
  "/:slug",
  controller.getBrand
);

router.patch(
  "/:id",
  authenticate,
  authorize(Role.ADMIN),
  validate(updateBrandSchema),
  controller.updateBrand
);

router.delete(
  "/:id",
  authenticate,
  authorize(Role.ADMIN),
  controller.deleteBrand
);

export default router;
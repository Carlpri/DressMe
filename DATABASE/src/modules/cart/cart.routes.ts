import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { CartController } from "./cart.controller.js";
import {
  addCartItemSchema,
  cartItemParamSchema,
  updateCartItemSchema,
} from "./cart.validation.js";

const router = Router();

const controller = new CartController();

router.use(authenticate);

router.get(
  "/",
  controller.getCart
);

router.post(
  "/items",
  validate(addCartItemSchema),
  controller.addItem
);

router.patch(
  "/items/:itemId",
  validate(updateCartItemSchema),
  controller.updateItem
);

router.delete(
  "/items/:itemId",
  validate(cartItemParamSchema),
  controller.removeItem
);

router.delete(
  "/",
  controller.clearCart
);

export default router;

import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { Role } from "@prisma/client";
import { OrderController } from "./order.controller.js";
import {
  cancelOrderSchema,
  createOrderSchema,
  orderIdParamSchema,
  updateOrderStatusSchema,
  updatePaymentStatusSchema,
} from "./order.validation.js";

const router = Router();

const controller = new OrderController();

router.use(authenticate);

router.post(
  "/",
  validate(createOrderSchema),
  controller.checkout
);

router.get(
  "/my",
  controller.getMyOrders
);

// ⚠️ Must be before /:id — otherwise Express matches "vendor" as the :id param
router.get(
  "/vendor/orders",
  authorize(Role.VENDOR, Role.ADMIN),
  controller.getVendorOrders
);

router.get(
  "/:id",
  validate(orderIdParamSchema),
  controller.getOrder
);

router.patch(
  "/:id/cancel",
  validate(cancelOrderSchema),
  controller.cancelOrder
);

router.get(
  "/",
  authorize(Role.ADMIN),
  controller.getAllOrders
);

router.patch(
  "/:id/status",
  authorize(Role.ADMIN),
  validate(orderIdParamSchema.merge(updateOrderStatusSchema)),
  controller.updateOrderStatus
);

router.patch(
  "/:id/payment-status",
  authorize(Role.ADMIN),
  validate(orderIdParamSchema.merge(updatePaymentStatusSchema)),
  controller.updatePaymentStatus
);

export default router;

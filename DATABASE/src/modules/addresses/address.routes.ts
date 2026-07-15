import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { AddressController } from "./address.controller.js";
import {
  addressIdParamSchema,
  createAddressSchema,
  updateAddressSchema,
} from "./address.validation.js";

const router = Router();

const controller = new AddressController();

router.use(authenticate);

router.post(
  "/",
  validate(createAddressSchema),
  controller.createAddress
);

router.get(
  "/",
  controller.getAddresses
);

router.get(
  "/default",
  controller.getDefaultAddress
);

router.get(
  "/:id",
  validate(addressIdParamSchema),
  controller.getAddress
);

router.patch(
  "/:id/default",
  validate(addressIdParamSchema),
  controller.setDefaultAddress
);

router.patch(
  "/:id",
  validate(addressIdParamSchema.merge(updateAddressSchema)),
  controller.updateAddress
);

router.delete(
  "/:id",
  validate(addressIdParamSchema),
  controller.deleteAddress
);

export default router;

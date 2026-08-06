import { Router } from "express";
import { ReferenceController } from "./reference.controller.js";

const router = Router();
const controller = new ReferenceController();

router.get("/attributes", controller.getAttributes);
router.get("/colors", controller.getColors);
router.get("/sizes", controller.getSizes);
router.get("/locations", controller.getLocations);

export default router;

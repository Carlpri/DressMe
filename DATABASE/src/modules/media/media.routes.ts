import { Router } from "express";
import { MediaController } from "./media.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";
import { Role } from "@prisma/client";

const router = Router();
const controller = new MediaController();

router.use(authenticate);
router.use(authorize(Role.ADMIN));

router.get("/", controller.getAll);
router.post("/", controller.create);
router.delete("/:id", controller.delete);

export default router;

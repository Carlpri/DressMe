import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { aiRateLimiter } from "../../middleware/rate-limit.middleware.js";
import { AIController } from "./ai.controller.js";
import {
  aiSearchSchema,
  aiStylistSchema,
  testAISchema,
  analyzeProductSchema,
} from "./ai.validation.js";

const router = Router();
const controller = new AIController();

// Existing test endpoint (temporary testing connectivity)
router.post("/test", validate(testAISchema), controller.testAI);

// Production AI Stylist endpoint (authenticated & rate-limited)
router.post(
  "/stylist",
  authenticate,
  aiRateLimiter,
  validate(aiStylistSchema),
  controller.generateStylistRecommendations
);

// Production AI Natural-Language Search endpoint (authenticated & rate-limited)
router.post(
  "/search",
  authenticate,
  aiRateLimiter,
  validate(aiSearchSchema),
  controller.searchProducts
);

// Production AI Product Analysis endpoint (admin-authenticated & rate-limited)
router.post(
  "/analyze-product",
  authenticate,
  aiRateLimiter,
  validate(analyzeProductSchema),
  controller.analyzeProduct
);

export default router;

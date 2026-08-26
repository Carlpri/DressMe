import rateLimit from "express-rate-limit";

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many authentication attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting in development if needed
    return process.env.NODE_ENV === "development" && process.env.SKIP_RATE_LIMIT === "true";
  },
});

export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

export const aiRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each user/IP to 10 AI stylist requests per hour
  message: "You have reached the AI Stylist hourly request limit (10 per hour). Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user?.userId || req.ip || "anonymous";
  },
  skip: (req) => {
    return process.env.NODE_ENV === "development" && process.env.SKIP_RATE_LIMIT === "true";
  },
});


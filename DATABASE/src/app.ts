import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/error.middleware.js";
import authRoutes from "./modules/auth/auth.routes.js";

const app = express();

// Global middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth",authRoutes);
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);

// Health check route
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to DressMe API 🚀",
  });
});

export default app;




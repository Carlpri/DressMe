import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/error.middleware.js";
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/user.routes.js";
import categoryRoutes from "./modules/categories/category.routes.js";
import brandRoutes from "./modules/brands/brand.routes.js";

const app = express();

// Global middleware


app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/brands", brandRoutes);

app.use(errorHandler);

// Health check route
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to DressMe API 🚀",
  });
});

export default app;




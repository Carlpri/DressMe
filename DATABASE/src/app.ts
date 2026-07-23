import express from "express";
import cors, { type CorsOptions } from "cors";
import { errorHandler } from "./middleware/error.middleware.js";
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/user.routes.js";
import categoryRoutes from "./modules/categories/category.routes.js";
import brandRoutes from "./modules/brands/brand.routes.js";
import vendorRotes from "./modules/vendors/vendor.routes.js";
import productRoutes from "./modules/products/product.routes.js";
import cartRoutes from "./modules/cart/cart.routes.js";
import favouriteRoutes from "./modules/favourites/favourite.routes.js";
import reviewRoutes from "./modules/reviews/review.routes.js";
import outfitRoutes from "./modules/outfits/outfit.routes.js";
import addressRoutes from "./modules/addresses/address.routes.js";
import orderRoutes from "./modules/orders/order.routes.js";
import siteSettingsRoutes from "./modules/site-settings/site-settings.routes.js";
import mediaRoutes from "./modules/media/media.routes.js";

const app = express();

const allowedFrontendOrigins = (process.env.FRONTEND_URL ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

function matchesAllowedOrigin(origin: string) {
  if (process.env.NODE_ENV !== "production") {
    try {
      const { hostname } = new URL(origin);
      if (hostname === "localhost" || hostname === "127.0.0.1") return true;
    } catch {
      return false;
    }
  }

  return allowedFrontendOrigins.some((allowedOrigin) => {
    const expression = `^${allowedOrigin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\\\*/g, ".*")}$`;
    return new RegExp(expression).test(origin);
  });
}

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin || matchesAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Origin is not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Global middleware


app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/vendors", vendorRotes); 
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/favourites", favouriteRoutes);
app.use("/api/favorites", favouriteRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/outfits", outfitRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/settings", siteSettingsRoutes);
app.use("/api/app-settings", siteSettingsRoutes);
app.use("/api/media", mediaRoutes);

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "DressMe API",
    environment: process.env.NODE_ENV ?? "development",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to DressMe API 🚀",
  });
});

app.use(errorHandler);

export default app;




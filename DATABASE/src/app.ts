import express from "express";
import cors from "cors";
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

const app = express();

// Global middleware


app.use(express.json());
app.use(cors());
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

app.use(errorHandler);

// Health check route
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to DressMe API 🚀",
  });
});

export default app;




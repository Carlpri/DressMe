export type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
export type ModuleStatus = "connected" | "development" | "testing" | "error" | "planned";

export interface EndpointDefinition { method: HttpMethod; path: string; auth: boolean; }
export interface BackendModuleDefinition {
  id: string; name: string; basePath?: string; models: string[]; frontendPages: string[];
  endpoints: EndpointDefinition[]; probe?: string; version?: string;
}

const endpoint = (method: HttpMethod, path: string, auth = false): EndpointDefinition => ({ method, path, auth });

/** Derived from DATABASE/src/app.ts and DATABASE/src/modules/*.routes.ts. */
export const backendModules: BackendModuleDefinition[] = [
  { id: "auth", name: "Authentication", basePath: "/auth", models: ["User"], frontendPages: ["/login", "/register"], probe: "/auth/me", endpoints: [endpoint("POST", "/register"), endpoint("POST", "/login"), endpoint("GET", "/me", true), endpoint("GET", "/admin", true), endpoint("GET", "/vendor", true)] },
  { id: "users", name: "Users", basePath: "/users", models: ["User"], frontendPages: [], probe: "/users/me", endpoints: [endpoint("GET", "/me", true), endpoint("PATCH", "/me", true), endpoint("PATCH", "/change-password", true)] },
  { id: "vendors", name: "Vendors", basePath: "/vendors", models: ["Vendor", "User"], frontendPages: [], probe: "/vendors", endpoints: [endpoint("POST", "/", true), endpoint("GET", "/"), endpoint("GET", "/:id"), endpoint("PATCH", "/:id", true), endpoint("DELETE", "/:id", true)] },
  { id: "brands", name: "Brands", basePath: "/brands", models: ["Brand", "Product"], frontendPages: [], probe: "/brands", endpoints: [endpoint("POST", "/", true), endpoint("GET", "/"), endpoint("GET", "/:id"), endpoint("PATCH", "/:id", true), endpoint("DELETE", "/:id", true)] },
  { id: "categories", name: "Categories", basePath: "/categories", models: ["Category", "Product"], frontendPages: [], probe: "/categories", endpoints: [endpoint("POST", "/", true), endpoint("GET", "/"), endpoint("GET", "/:id"), endpoint("PATCH", "/:id", true), endpoint("DELETE", "/:id", true)] },
  { id: "products", name: "Products", basePath: "/products", models: ["Product", "ProductImage", "ProductVariant", "Brand", "Category", "Vendor"], frontendPages: [], probe: "/products", endpoints: [endpoint("POST", "/", true), endpoint("GET", "/"), endpoint("GET", "/:slug"), endpoint("PATCH", "/:id", true), endpoint("DELETE", "/:id", true)] },
  { id: "cart", name: "Cart", basePath: "/cart", models: ["Cart", "CartItem", "ProductVariant"], frontendPages: [], probe: "/cart", endpoints: [endpoint("GET", "/", true), endpoint("POST", "/items", true), endpoint("PATCH", "/items/:itemId", true), endpoint("DELETE", "/items/:itemId", true), endpoint("DELETE", "/", true)] },
  { id: "addresses", name: "Addresses", basePath: "/addresses", models: ["Address", "User"], frontendPages: [], probe: "/addresses", endpoints: [endpoint("POST", "/", true), endpoint("GET", "/", true), endpoint("GET", "/default", true), endpoint("GET", "/:id", true), endpoint("PATCH", "/:id/default", true), endpoint("PATCH", "/:id", true), endpoint("DELETE", "/:id", true)] },
  { id: "orders", name: "Orders", basePath: "/orders", models: ["Order", "OrderItem", "Address", "Product"], frontendPages: [], probe: "/orders/my", endpoints: [endpoint("POST", "/", true), endpoint("GET", "/my", true), endpoint("GET", "/:id", true), endpoint("PATCH", "/:id/cancel", true), endpoint("GET", "/", true), endpoint("PATCH", "/:id/status", true), endpoint("PATCH", "/:id/payment-status", true), endpoint("GET", "/vendor", true)] },
  { id: "reviews", name: "Reviews", basePath: "/reviews", models: ["Review", "Product", "User"], frontendPages: ["/customer"], probe: "/reviews/my", endpoints: [endpoint("GET", "/products/:productId"), endpoint("POST", "/", true), endpoint("GET", "/my", true), endpoint("PATCH", "/:id", true), endpoint("DELETE", "/:id", true)] },
  { id: "favourites", name: "Favourites", basePath: "/favourites", models: ["FavoriteProduct", "Product", "User"], frontendPages: [], probe: "/favourites", endpoints: [endpoint("GET", "/", true), endpoint("POST", "/", true), endpoint("DELETE", "/:productId", true), endpoint("DELETE", "/", true)] },
  { id: "outfits", name: "Outfits", basePath: "/outfits", models: ["Outfit", "OutfitItem", "SavedOutfit"], frontendPages: [], probe: "/outfits", endpoints: [endpoint("GET", "/", true), endpoint("GET", "/my", true), endpoint("POST", "/", true), endpoint("GET", "/:id", true), endpoint("GET", "/:id/items", true), endpoint("PATCH", "/:id", true), endpoint("DELETE", "/:id", true), endpoint("POST", "/:id/save", true), endpoint("DELETE", "/:id/save", true)] },
  ...["Payments", "Coupons", "Notifications", "Analytics", "Recommendation Engine", "Wardrobe", "Try-On", "Affiliate Products"].map((name) => ({ id: name.toLowerCase().replaceAll(" ", "-"), name, models: [], frontendPages: [], endpoints: [] })),
];

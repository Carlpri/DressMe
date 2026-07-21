import { createBrowserRouter, Navigate } from "react-router-dom";
import { ROUTES, STUDIO_ROUTES } from "../constants/routes";
import { PlaceholderPage } from "../pages/PlaceholderPage";
import { StudioWelcomePage } from "../pages/StudioWelcomePage";
import { AccessDeniedPage } from "../pages/AccessDeniedPage";
import { WebLayout } from "../components/web/WebLayout";
import { StudioLayout } from "../components/studio/StudioLayout";
import { WebAuthPage } from "../components/web/WebAuthPage";
import { LandingPage } from "../pages/web/LandingPage";
import { ProductsPage } from "../pages/web/ProductsPage";
import { ProductDetailsPage } from "../pages/web/ProductDetailsPage";
import { CategoriesPage } from "../pages/web/CategoriesPage";
import { BrandsPage } from "../pages/web/BrandsPage";
import { WishlistPage } from "../pages/web/WishlistPage";
import { ProfilePage } from "../pages/web/ProfilePage";
import { AIStylistPage } from "../pages/web/AIStylistPage";
import { OutfitBuilderPage } from "../pages/web/OutfitBuilderPage";
import { CheckoutPage } from "../pages/web/CheckoutPage";
import { OrderConfirmationPage } from "../pages/web/OrderConfirmationPage";
import { OrderDetailsPage } from "../pages/web/OrderDetailsPage";
import { AuthPage } from "../features/auth/AuthPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { BackendRegistryPage } from "../features/backend-registry/BackendRegistryPage";
import { CustomerWorkspace } from "../features/customer/CustomerWorkspace";
import { AdminSettingsPage } from "../features/admin/AdminSettingsPage";
import { CartPage } from "../features/customer/CartPage";
import { AddressesPage } from "../features/customer/AddressesPage";
import { OrdersPage } from "../features/customer/OrdersPage";
import { OutfitsPage } from "../features/customer/OutfitsPage";

import { AdminLayout } from "../components/admin/AdminLayout";
import { AdminDashboardPage } from "../pages/admin/AdminDashboardPage";
import { AdminProductsPage } from "../pages/admin/AdminProductsPage";
import { AdminMediaPage } from "../pages/admin/AdminMediaPage";
import { AdminCategoriesPage } from "../pages/admin/AdminCategoriesPage";
import { AdminBrandsPage } from "../pages/admin/AdminBrandsPage";
import { AdminOrdersPage } from "../pages/admin/AdminOrdersPage";
import { AdminCustomersPage } from "../pages/admin/AdminCustomersPage";
import { AdminReviewsPage } from "../pages/admin/AdminReviewsPage";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <WebLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "login", element: <WebAuthPage mode="login" /> },
      { path: "register", element: <WebAuthPage mode="register" /> },
      { path: "products", element: <ProductsPage /> },
      { path: "products/:slug", element: <ProductDetailsPage /> },
      { path: "categories", element: <CategoriesPage /> },
      { path: "categories/:slug", element: <CategoriesPage /> },
      { path: "brands", element: <BrandsPage /> },
      { path: "brands/:slug", element: <BrandsPage /> },
      {
        path: "cart",
        element: <ProtectedRoute allowedRoles={["USER", "ADMIN"]} />,
        children: [{ index: true, element: <CartPage /> }]
      },
      {
        path: "checkout",
        element: <ProtectedRoute allowedRoles={["USER", "ADMIN"]} />,
        children: [{ index: true, element: <CheckoutPage /> }]
      },
      {
        path: "order-confirmation",
        element: <ProtectedRoute allowedRoles={["USER", "ADMIN"]} />,
        children: [{ index: true, element: <OrderConfirmationPage /> }]
      },
      {
        path: "orders",
        element: <ProtectedRoute allowedRoles={["USER", "ADMIN"]} />,
        children: [{ index: true, element: <OrdersPage /> }]
      },
      {
        path: "orders/:id",
        element: <ProtectedRoute allowedRoles={["USER", "ADMIN"]} />,
        children: [{ index: true, element: <OrderDetailsPage /> }]
      },
      { 
        path: "profile", 
        element: <ProtectedRoute allowedRoles={["USER", "ADMIN"]} />,
        children: [{ index: true, element: <ProfilePage /> }]
      },
      { 
        path: "profile/addresses", 
        element: <ProtectedRoute allowedRoles={["USER", "ADMIN"]} />,
        children: [{ index: true, element: <AddressesPage /> }]
      },
      { 
        path: "profile/outfits", 
        element: <ProtectedRoute allowedRoles={["USER", "ADMIN"]} />,
        children: [{ index: true, element: <OutfitsPage /> }]
      },
      { 
        path: "ai-stylist", 
        element: <ProtectedRoute allowedRoles={["USER", "ADMIN"]} />,
        children: [{ index: true, element: <AIStylistPage /> }]
      },
      { 
        path: "outfit-builder", 
        element: <ProtectedRoute allowedRoles={["USER", "ADMIN"]} />,
        children: [{ index: true, element: <OutfitBuilderPage /> }]
      },
    ],
  },
  {
    path: "/admin",
    element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: "products", element: <AdminProductsPage /> },
          { path: "media", element: <AdminMediaPage /> },
          { path: "categories", element: <AdminCategoriesPage /> },
          { path: "brands", element: <AdminBrandsPage /> },
          { path: "orders", element: <AdminOrdersPage /> },
          { path: "customers", element: <AdminCustomersPage /> },
          { path: "reviews", element: <AdminReviewsPage /> },
          { path: "settings", element: <AdminSettingsPage /> },
        ],
      },
    ],
  },
  {
    path: "/studio",
    element: <StudioLayout />,
    children: [
      { index: true, element: <StudioWelcomePage /> },
      { path: "login", element: <AuthPage mode="login" /> },
      { path: "register", element: <AuthPage mode="register" /> },
      { 
        path: "customer", 
        element: <ProtectedRoute allowedRoles={["USER", "ADMIN"]} />,
        children: [{ index: true, element: <CustomerWorkspace /> }]
      },
      { 
        path: "customer/cart", 
        element: <ProtectedRoute allowedRoles={["USER", "ADMIN"]} />,
        children: [{ index: true, element: <CartPage /> }]
      },
      { 
        path: "customer/addresses", 
        element: <ProtectedRoute allowedRoles={["USER", "ADMIN"]} />,
        children: [{ index: true, element: <AddressesPage /> }]
      },
      { 
        path: "customer/orders", 
        element: <ProtectedRoute allowedRoles={["USER", "ADMIN"]} />,
        children: [{ index: true, element: <OrdersPage /> }]
      },
      { 
        path: "customer/outfits", 
        element: <ProtectedRoute allowedRoles={["USER", "ADMIN"]} />,
        children: [{ index: true, element: <OutfitsPage /> }]
      },
      { 
        path: "vendor", 
        element: <ProtectedRoute allowedRoles={["VENDOR", "ADMIN"]} />,
        children: [{ index: true, element: <PlaceholderPage title="Vendor workspace" description="Vendor QA tools are planned after customer workflows." /> }]
      },
      {
        path: "admin",
        element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
        children: [
          { index: true, element: <Navigate to="/admin" replace /> },
          { path: "settings", element: <AdminSettingsPage /> }
        ]
      },
      { path: "access-denied", element: <AccessDeniedPage /> },
      { 
        path: "system/modules", 
        element: <ProtectedRoute allowedRoles={["USER", "VENDOR", "ADMIN"]} />,
        children: [{ index: true, element: <BackendRegistryPage /> }]
      },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);

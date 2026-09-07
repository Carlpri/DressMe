import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { PageLoader } from "../components/shared/PageLoader";
import { ProtectedRoute } from "./ProtectedRoute";

// ── Layouts (eager — they wrap everything, loading them lazy would cause flash) ─
import { WebLayout } from "../components/web/WebLayout";
import { StudioLayout } from "../components/studio/StudioLayout";
import { AdminLayout } from "../components/admin/AdminLayout";

// ── Auth pages (lightweight, eager) ────────────────────────────────────────────
import { WebAuthPage } from "../components/web/WebAuthPage";
import { AuthPage } from "../features/auth/AuthPage";

// ── Web pages (lazy) ───────────────────────────────────────────────────────────
const DiscoveryLandingPage   = lazy(() => import("../pages/web/DiscoveryLandingPage").then(m => ({ default: m.DiscoveryLandingPage })));
const LandingPage            = lazy(() => import("../pages/web/LandingPage").then(m => ({ default: m.LandingPage })));
const ProductsPage           = lazy(() => import("../pages/web/ProductsPage").then(m => ({ default: m.ProductsPage })));
const ProductDetailsPage     = lazy(() => import("../pages/web/ProductDetailsPage").then(m => ({ default: m.ProductDetailsPage })));
const CategoriesPage         = lazy(() => import("../pages/web/CategoriesPage").then(m => ({ default: m.CategoriesPage })));
const BrandsPage             = lazy(() => import("../pages/web/BrandsPage").then(m => ({ default: m.BrandsPage })));
const WishlistPage           = lazy(() => import("../pages/web/WishlistPage").then(m => ({ default: m.WishlistPage })));
const ProfilePage            = lazy(() => import("../pages/web/ProfilePage").then(m => ({ default: m.ProfilePage })));
const AIStylistPage          = lazy(() => import("../pages/web/AIStylistPage").then(m => ({ default: m.AIStylistPage })));
const OutfitBuilderPage      = lazy(() => import("../pages/web/OutfitBuilderPage").then(m => ({ default: m.OutfitBuilderPage })));
const CheckoutPage           = lazy(() => import("../pages/web/CheckoutPage").then(m => ({ default: m.CheckoutPage })));
const OrderConfirmationPage  = lazy(() => import("../pages/web/OrderConfirmationPage").then(m => ({ default: m.OrderConfirmationPage })));
const OrderDetailsPage       = lazy(() => import("../pages/web/OrderDetailsPage").then(m => ({ default: m.OrderDetailsPage })));
const AboutPage              = lazy(() => import("../pages/web/AboutPage").then(m => ({ default: m.AboutPage })));
const PrivacyPage            = lazy(() => import("../pages/web/PrivacyPage").then(m => ({ default: m.PrivacyPage })));
const TermsPage              = lazy(() => import("../pages/web/TermsPage").then(m => ({ default: m.TermsPage })));
const VisionPage             = lazy(() => import("../pages/web/VisionPage").then(m => ({ default: m.VisionPage })));
const MissionPage            = lazy(() => import("../pages/web/MissionPage").then(m => ({ default: m.MissionPage })));
const CareersPage            = lazy(() => import("../pages/web/CareersPage").then(m => ({ default: m.CareersPage })));
const ShippingPage           = lazy(() => import("../pages/web/ShippingPage").then(m => ({ default: m.ShippingPage })));
const ContactPage            = lazy(() => import("../pages/web/ContactPage").then(m => ({ default: m.ContactPage })));
const ReturnsPage            = lazy(() => import("../pages/web/ReturnsPage").then(m => ({ default: m.ReturnsPage })));
const HelpPage               = lazy(() => import("../pages/web/HelpPage").then(m => ({ default: m.HelpPage })));

// ── Customer / Studio pages (lazy) ────────────────────────────────────────────
const CartPage               = lazy(() => import("../features/customer/CartPage").then(m => ({ default: m.CartPage })));
const AddressesPage          = lazy(() => import("../features/customer/AddressesPage").then(m => ({ default: m.AddressesPage })));
const OrdersPage             = lazy(() => import("../features/customer/OrdersPage").then(m => ({ default: m.OrdersPage })));
const OutfitsPage            = lazy(() => import("../features/customer/OutfitsPage").then(m => ({ default: m.OutfitsPage })));
const CustomerWorkspace      = lazy(() => import("../features/customer/CustomerWorkspace").then(m => ({ default: m.CustomerWorkspace })));
const AdminSettingsPage      = lazy(() => import("../features/admin/AdminSettingsPage").then(m => ({ default: m.AdminSettingsPage })));
const BackendRegistryPage    = lazy(() => import("../features/backend-registry/BackendRegistryPage").then(m => ({ default: m.BackendRegistryPage })));

// ── Vendor (lazy) ─────────────────────────────────────────────────────────────
const VendorDashboardPage    = lazy(() => import("../pages/vendor/VendorDashboardPage").then(m => ({ default: m.VendorDashboardPage })));

// ── Admin pages (lazy — heaviest pages, split these first) ────────────────────
const AdminDashboardPage        = lazy(() => import("../pages/admin/AdminDashboardPage").then(m => ({ default: m.AdminDashboardPage })));
const AdminProductsPage         = lazy(() => import("../pages/admin/AdminProductsPage").then(m => ({ default: m.AdminProductsPage })));
const AdminAIProductAnalysisPage = lazy(() => import("../pages/admin/AdminAIProductAnalysisPage").then(m => ({ default: m.AdminAIProductAnalysisPage })));
const AdminMediaPage            = lazy(() => import("../pages/admin/AdminMediaPage").then(m => ({ default: m.AdminMediaPage })));
const AdminCategoriesPage       = lazy(() => import("../pages/admin/AdminCategoriesPage").then(m => ({ default: m.AdminCategoriesPage })));
const AdminBrandsPage           = lazy(() => import("../pages/admin/AdminBrandsPage").then(m => ({ default: m.AdminBrandsPage })));
const AdminVendorsPage          = lazy(() => import("../pages/admin/AdminVendorsPage").then(m => ({ default: m.AdminVendorsPage })));
const AdminOrdersPage           = lazy(() => import("../pages/admin/AdminOrdersPage").then(m => ({ default: m.AdminOrdersPage })));
const AdminCustomersPage        = lazy(() => import("../pages/admin/AdminCustomersPage").then(m => ({ default: m.AdminCustomersPage })));
const AdminReviewsPage          = lazy(() => import("../pages/admin/AdminReviewsPage").then(m => ({ default: m.AdminReviewsPage })));

// ── Misc pages (lazy) ─────────────────────────────────────────────────────────
const PlaceholderPage        = lazy(() => import("../pages/PlaceholderPage").then(m => ({ default: m.PlaceholderPage })));
const StudioWelcomePage      = lazy(() => import("../pages/StudioWelcomePage").then(m => ({ default: m.StudioWelcomePage })));
const AccessDeniedPage       = lazy(() => import("../pages/AccessDeniedPage").then(m => ({ default: m.AccessDeniedPage })));

import { ROUTES, STUDIO_ROUTES } from "../constants/routes";

// ── Suspense wrapper helper ────────────────────────────────────────────────────
function S({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <WebLayout />,
    children: [
      { index: true, element: <S><DiscoveryLandingPage /></S> },
      { path: "home", element: <S><LandingPage /></S> },
      { path: "login", element: <WebAuthPage mode="login" /> },
      { path: "register", element: <WebAuthPage mode="register" /> },
      { path: "products", element: <S><ProductsPage /></S> },
      { path: "products/:slug", element: <S><ProductDetailsPage /></S> },
      { path: "categories", element: <S><CategoriesPage /></S> },
      { path: "categories/:slug", element: <S><CategoriesPage /></S> },
      { path: "brands", element: <S><BrandsPage /></S> },
      { path: "brands/:slug", element: <S><BrandsPage /></S> },
      {
        path: "wishlist",
        element: <ProtectedRoute allowedRoles={["USER", "ADMIN"]} />,
        children: [{ index: true, element: <S><WishlistPage /></S> }]
      },
      { path: "cart", element: <S><CartPage /></S> },
      {
        path: "checkout",
        element: <ProtectedRoute allowedRoles={["USER", "ADMIN"]} />,
        children: [{ index: true, element: <S><CheckoutPage /></S> }]
      },
      {
        path: "order-confirmation",
        element: <ProtectedRoute allowedRoles={["USER", "ADMIN"]} />,
        children: [{ index: true, element: <S><OrderConfirmationPage /></S> }]
      },
      {
        path: "orders",
        element: <ProtectedRoute allowedRoles={["USER", "ADMIN"]} />,
        children: [{ index: true, element: <S><OrdersPage /></S> }]
      },
      {
        path: "orders/:id",
        element: <ProtectedRoute allowedRoles={["USER", "ADMIN"]} />,
        children: [{ index: true, element: <S><OrderDetailsPage /></S> }]
      },
      {
        path: "profile",
        element: <ProtectedRoute allowedRoles={["USER", "ADMIN"]} />,
        children: [{ index: true, element: <S><ProfilePage /></S> }]
      },
      {
        path: "profile/addresses",
        element: <ProtectedRoute allowedRoles={["USER", "ADMIN"]} />,
        children: [{ index: true, element: <S><AddressesPage /></S> }]
      },
      {
        path: "profile/outfits",
        element: <ProtectedRoute allowedRoles={["USER", "ADMIN"]} />,
        children: [{ index: true, element: <S><OutfitsPage /></S> }]
      },
      {
        path: "ai-stylist",
        element: <ProtectedRoute allowedRoles={["USER", "ADMIN"]} />,
        children: [{ index: true, element: <S><AIStylistPage /></S> }]
      },
      {
        path: "outfit-builder",
        element: <ProtectedRoute allowedRoles={["USER", "ADMIN"]} />,
        children: [{ index: true, element: <S><OutfitBuilderPage /></S> }]
      },
      { path: "about",    element: <S><AboutPage /></S> },
      { path: "privacy",  element: <S><PrivacyPage /></S> },
      { path: "terms",    element: <S><TermsPage /></S> },
      { path: "vision",   element: <S><VisionPage /></S> },
      { path: "mission",  element: <S><MissionPage /></S> },
      { path: "careers",  element: <S><CareersPage /></S> },
      { path: "shipping", element: <S><ShippingPage /></S> },
      { path: "contact",  element: <S><ContactPage /></S> },
      { path: "returns",  element: <S><ReturnsPage /></S> },
      { path: "help",     element: <S><HelpPage /></S> },
    ],
  },
  {
    path: "/admin",
    element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true,                    element: <S><AdminDashboardPage /></S> },
          { path: "products",               element: <S><AdminProductsPage /></S> },
          { path: "ai-product-analysis",    element: <S><AdminAIProductAnalysisPage /></S> },
          { path: "media",                  element: <S><AdminMediaPage /></S> },
          { path: "categories",             element: <S><AdminCategoriesPage /></S> },
          { path: "brands",                 element: <S><AdminBrandsPage /></S> },
          { path: "vendors",                element: <S><AdminVendorsPage /></S> },
          { path: "orders",                 element: <S><AdminOrdersPage /></S> },
          { path: "customers",              element: <S><AdminCustomersPage /></S> },
          { path: "reviews",                element: <S><AdminReviewsPage /></S> },
          { path: "settings",               element: <S><AdminSettingsPage /></S> },
        ],
      },
    ],
  },
  {
    path: "/studio",
    element: <StudioLayout />,
    children: [
      { index: true,             element: <S><StudioWelcomePage /></S> },
      { path: "login",           element: <AuthPage mode="login" /> },
      { path: "register",        element: <AuthPage mode="register" /> },
      {
        path: "customer",
        element: <ProtectedRoute allowedRoles={["USER", "ADMIN"]} />,
        children: [{ index: true, element: <S><CustomerWorkspace /></S> }]
      },
      {
        path: "customer/cart",
        element: <ProtectedRoute allowedRoles={["USER", "ADMIN"]} />,
        children: [{ index: true, element: <S><CartPage /></S> }]
      },
      {
        path: "customer/addresses",
        element: <ProtectedRoute allowedRoles={["USER", "ADMIN"]} />,
        children: [{ index: true, element: <S><AddressesPage /></S> }]
      },
      {
        path: "customer/orders",
        element: <ProtectedRoute allowedRoles={["USER", "ADMIN"]} />,
        children: [{ index: true, element: <S><OrdersPage /></S> }]
      },
      {
        path: "customer/outfits",
        element: <ProtectedRoute allowedRoles={["USER", "ADMIN"]} />,
        children: [{ index: true, element: <S><OutfitsPage /></S> }]
      },
      {
        path: "vendor",
        element: <ProtectedRoute allowedRoles={["VENDOR", "ADMIN"]} />,
        children: [
          { index: true, element: <S><VendorDashboardPage /></S> },
          { path: "products", element: <S><VendorDashboardPage /></S> },
        ]
      },
      {
        path: "admin",
        element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
        children: [
          { index: true,      element: <Navigate to="/admin" replace /> },
          { path: "settings", element: <S><AdminSettingsPage /></S> }
        ]
      },
      { path: "access-denied", element: <S><AccessDeniedPage /></S> },
      {
        path: "system/modules",
        element: <ProtectedRoute allowedRoles={["USER", "VENDOR", "ADMIN"]} />,
        children: [{ index: true, element: <S><BackendRegistryPage /></S> }]
      },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);

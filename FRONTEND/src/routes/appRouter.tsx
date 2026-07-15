import { createBrowserRouter, Navigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { PlaceholderPage } from "../pages/PlaceholderPage";
import { StudioWelcomePage } from "../pages/StudioWelcomePage";
import { AuthPage } from "../features/auth/AuthPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { BackendRegistryPage } from "../features/backend-registry/BackendRegistryPage";
import { CustomerWorkspace } from "../features/customer/CustomerWorkspace";
import { CartPage } from "../features/customer/CartPage";
import { AddressesPage } from "../features/customer/AddressesPage";
import { OrdersPage } from "../features/customer/OrdersPage";
import { OutfitsPage } from "../features/customer/OutfitsPage";

export const appRouter = createBrowserRouter([
  { path: "/", element: <StudioWelcomePage /> },
  {
    path: ROUTES.login,
    element: <AuthPage mode="login" />,
  },
  {
    path: ROUTES.register,
    element: <AuthPage mode="register" />,
  },
  {
    path: ROUTES.customerDashboard,
    element: <ProtectedRoute allowedRoles={["USER"]}><CustomerWorkspace /></ProtectedRoute>,
  },
  { path: ROUTES.customerCart, element: <ProtectedRoute allowedRoles={["USER"]}><CartPage /></ProtectedRoute> },
  { path: ROUTES.customerAddresses, element: <ProtectedRoute allowedRoles={["USER"]}><AddressesPage /></ProtectedRoute> },
  { path: ROUTES.customerOrders, element: <ProtectedRoute allowedRoles={["USER"]}><OrdersPage /></ProtectedRoute> },
  { path: ROUTES.customerOutfits, element: <ProtectedRoute allowedRoles={["USER"]}><OutfitsPage /></ProtectedRoute> },
  {
    path: ROUTES.vendorDashboard,
    element: <ProtectedRoute allowedRoles={["VENDOR", "ADMIN"]}><PlaceholderPage title="Vendor workspace" description="Vendor QA tools are planned after customer workflows." /></ProtectedRoute>,
  },
  {
    path: ROUTES.adminDashboard,
    element: <ProtectedRoute allowedRoles={["ADMIN"]}><PlaceholderPage title="Admin workspace" description="Admin QA tools are planned after vendor workflows." /></ProtectedRoute>,
  },
  {
    path: ROUTES.accessDenied,
    element: <PlaceholderPage title="Access denied" description="Your current role does not have access to this workspace." />,
  },
  {
    path: ROUTES.backendRegistry,
    element: <ProtectedRoute allowedRoles={["USER", "VENDOR", "ADMIN"]}><BackendRegistryPage /></ProtectedRoute>,
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);

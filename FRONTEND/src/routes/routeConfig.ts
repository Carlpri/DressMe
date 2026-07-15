import type { UserRole } from "../types/auth";
import { ROUTES } from "../constants/routes";

export interface StudioRouteDefinition {
  path: string;
  title: string;
  allowedRoles?: UserRole[];
}

/**
 * Single source of truth for Studio navigation and authorization.
 * Guard enforcement is intentionally introduced with the auth feature.
 */
export const studioRoutes: StudioRouteDefinition[] = [
  { path: ROUTES.customerDashboard, title: "Customer workspace", allowedRoles: ["USER"] },
  { path: ROUTES.vendorDashboard, title: "Vendor workspace", allowedRoles: ["VENDOR", "ADMIN"] },
  { path: ROUTES.adminDashboard, title: "Admin workspace", allowedRoles: ["ADMIN"] },
];

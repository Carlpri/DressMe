import type { UserRole } from "../types/auth";
import { STUDIO_ROUTES } from "../constants/routes";

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
  { path: STUDIO_ROUTES.customerDashboard, title: "Customer workspace", allowedRoles: ["USER"] },
  { path: STUDIO_ROUTES.vendorDashboard, title: "Vendor workspace", allowedRoles: ["VENDOR", "ADMIN"] },
  { path: STUDIO_ROUTES.adminDashboard, title: "Admin workspace", allowedRoles: ["ADMIN"] },
];

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ROUTES, STUDIO_ROUTES } from "../constants/routes";
import { useAuth } from "../hooks/useAuth";
import type { UserRole } from "../types/auth";

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  const loginPath = location.pathname.startsWith("/studio")
    ? STUDIO_ROUTES.login
    : ROUTES.webLogin;

  if (!isAuthenticated) {
    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.accessDenied} replace />;
  }

  return <Outlet />;
}

import type { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { useAuth } from "../hooks/useAuth";
import type { UserRole } from "../types/auth";

export function ProtectedRoute({ allowedRoles, children }: PropsWithChildren<{ allowedRoles: UserRole[] }>) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) return <Navigate to={ROUTES.login} replace state={{ from: location }} />;
  if (!user || !allowedRoles.includes(user.role)) return <Navigate to={ROUTES.accessDenied} replace />;
  return <>{children}</>;
}

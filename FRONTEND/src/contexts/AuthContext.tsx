import { createContext, useCallback, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { clearApiAuthentication, configureApiAuthentication } from "../api/client";
import type { AuthSession, AuthUser } from "../types/auth";
import { isTokenExpired } from "../utils/jwt";

const SESSION_KEY = "dressme-studio.session";
const LEGACY_TOKEN_KEY = "dressme_token";
const AUTHENTICATED_QUERY_KEYS = new Set([
  "addresses",
  "admin-brands-list",
  "admin-categories-list",
  "admin-media",
  "admin-media-picker",
  "admin-orders",
  "admin-orders-page",
  "admin-products",
  "admin-products-list",
  "admin-products-with-reviews",
  "admin-users",
  "admin-users-list",
  "ai-outfits",
  "ai-recommendations",
  "cart",
  "favorites",
  "module-health",
  "my-outfits",
  "order",
  "orders",
  "outfits",
  "siteSettings",
]);

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (session: AuthSession) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredSession(): AuthSession | null {
  try {
    const value = localStorage.getItem(SESSION_KEY);
    if (!value) return null;
    const session = JSON.parse(value) as AuthSession;
    return isTokenExpired(session.token) ? null : session;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(readStoredSession);
  const queryClient = useQueryClient();

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    clearApiAuthentication();
    queryClient.removeQueries({
      predicate: (query) => AUTHENTICATED_QUERY_KEYS.has(String(query.queryKey[0])),
    });
    setSession(null);
  }, [queryClient]);

  const login = useCallback((nextSession: AuthSession) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
  }, []);

  useEffect(() => {
    configureApiAuthentication(() => session?.token ?? null, logout);
  }, [logout, session?.token]);

  useEffect(() => {
    if (!session) return;
    const timeout = window.setInterval(() => {
      if (isTokenExpired(session.token)) logout();
    }, 30_000);
    return () => window.clearInterval(timeout);
  }, [logout, session]);

  const value = useMemo<AuthContextValue>(() => ({
    user: session?.user ?? null,
    token: session?.token ?? null,
    isAuthenticated: Boolean(session),
    login,
    logout,
  }), [login, logout, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

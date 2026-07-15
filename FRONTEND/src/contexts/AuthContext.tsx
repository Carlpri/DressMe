import { createContext, useCallback, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { configureApiAuthentication } from "../api/client";
import type { AuthSession, AuthUser } from "../types/auth";
import { isTokenExpired } from "../utils/jwt";

const SESSION_KEY = "dressme-studio.session";

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

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
  }, []);

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

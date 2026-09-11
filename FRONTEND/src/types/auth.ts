export type UserRole = "USER" | "VENDOR" | "ADMIN";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  role: UserRole;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
}

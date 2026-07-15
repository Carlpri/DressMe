import { apiClient } from "../../api/client";
import type { ApiResponse } from "../../types/api";
import type { AuthSession } from "../../types/auth";
import type { LoginFormValues, RegisterFormValues } from "./auth.schemas";

export const authService = {
  login: async (values: LoginFormValues) => {
    const { data } = await apiClient.post<ApiResponse<AuthSession>>("/auth/login", values);
    return data.data;
  },
  register: async (values: RegisterFormValues) => {
    const { data } = await apiClient.post<ApiResponse<AuthSession>>("/auth/register", values);
    return data.data;
  },
};

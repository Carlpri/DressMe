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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword: _, ...payload } = values;
    const { data } = await apiClient.post<ApiResponse<AuthSession>>("/auth/register", payload);
    return data.data;
  },
};

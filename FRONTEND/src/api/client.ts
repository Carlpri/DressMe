import axios from "axios";
import { env } from "../config/env";

/** Central HTTP client. JWT interceptors are added with the authentication feature. */
export const apiClient = axios.create({
  baseURL: env.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

let unauthorizedHandler: (() => void) | undefined;
let tokenProvider: () => string | null = () => null;

export function configureApiAuthentication(getToken: () => string | null, onUnauthorized: () => void) {
  tokenProvider = getToken;
  unauthorizedHandler = onUnauthorized;
}

apiClient.interceptors.request.use((config) => {
  const token = tokenProvider();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      unauthorizedHandler?.();
    }
    return Promise.reject(error);
  },
);

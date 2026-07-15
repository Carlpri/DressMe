import { apiClient } from "../../api/client";
import type { HttpMethod } from "./moduleRegistry";

export interface ApiExecutionResult { status: number; duration: number; body: unknown; }

export async function executeEndpoint(method: HttpMethod, path: string, payload?: unknown): Promise<ApiExecutionResult> {
  const startedAt = performance.now();
  const response = await apiClient.request({ method, url: path, data: payload });
  return { status: response.status, duration: Math.round(performance.now() - startedAt), body: response.data };
}

import { apiClient } from "../api/client";
import type { Brand } from "../types/brand";

export const brandService = {
  getBrands: async () => {
    const response = await apiClient.get<{ data: Brand[] }>("/brands");
    return response.data.data;
  },

  getBrand: async (slug: string) => {
    const response = await apiClient.get<{ data: Brand }>(`/brands/${slug}`);
    return response.data.data;
  },
};

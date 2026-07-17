import { apiClient } from "../api/client";
import type { Product, ProductFilters, ProductListResponse } from "../types/product";

export const productService = {
  getProducts: async (filters: ProductFilters = {}) => {
    const response = await apiClient.get<{ data: ProductListResponse }>("/products", {
      params: {
        ...filters,
        status: filters.status || "ACTIVE",
      },
    });
    return response.data.data;
  },

  getProduct: async (slug: string) => {
    const response = await apiClient.get<{ data: Product }>(`/products/${slug}`);
    return response.data.data;
  },
};

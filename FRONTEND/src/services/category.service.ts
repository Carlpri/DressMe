import { apiClient } from "../api/client";
import type { Category } from "../types/category";

export const categoryService = {
  getCategories: async () => {
    const response = await apiClient.get<{ data: Category[] }>("/categories");
    return response.data.data;
  },

  getCategory: async (slug: string) => {
    const response = await apiClient.get<{ data: Category }>(`/categories/${slug}`);
    return response.data.data;
  },
};

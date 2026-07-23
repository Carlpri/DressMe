import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import type { Product } from "../types/product";

export function useFavorites() {
  const token = localStorage.getItem("dressme-studio.session");
  return useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      try {
        const response = await apiClient.get<{ data: any[] }>("/favourites");
        const items = response.data.data || [];
        return items.map((fav: any) => (fav.product ? { ...fav.product, favoriteId: fav.id } : fav)) as Product[];
      } catch (err) {
        return [];
      }
    },
    enabled: Boolean(token),
  });
}

export function useAddToFavorites() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      await apiClient.post("/favourites", { productId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

export function useRemoveFromFavorites() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      await apiClient.delete(`/favourites/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

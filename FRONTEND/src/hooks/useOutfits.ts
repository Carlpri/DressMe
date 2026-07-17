import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";

export interface OutfitItem {
  id: string;
  product: {
    id: string;
    name: string;
    slug: string;
    images: Array<{ imageUrl: string; isPrimary: boolean }>;
    price: number;
  };
}

export interface Outfit {
  id: string;
  title: string;
  description?: string;
  style: string;
  occasion?: string;
  season?: string;
  items: OutfitItem[];
  createdAt: string;
}

export function useOutfits() {
  return useQuery({
    queryKey: ["outfits"],
    queryFn: async () => {
      const response = await apiClient.get<{ data: Outfit[] }>("/outfits/my");
      return response.data.data;
    },
  });
}

export function useCreateOutfit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      description?: string;
      style: string;
      occasion?: string;
      season?: string;
      productIds: string[];
    }) => {
      await apiClient.post("/outfits", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outfits"] });
    },
  });
}

export function useDeleteOutfit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/outfits/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outfits"] });
    },
  });
}

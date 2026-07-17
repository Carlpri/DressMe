import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/client";

export interface AIRecommendation {
  product: {
    id: string;
    name: string;
    slug: string;
    images: Array<{ imageUrl: string; isPrimary: boolean }>;
    price: number;
    category: { name: string };
    brand: { name: string };
  };
  reason: string;
  matchScore: number;
}

export interface AIOutfitSuggestion {
  id: string;
  title: string;
  description: string;
  style: string;
  items: Array<{
    product: {
      id: string;
      name: string;
      slug: string;
      images: Array<{ imageUrl: string; isPrimary: boolean }>;
      price: number;
    };
  }>;
}

// TODO: Replace with OpenAI-backed endpoints when /ai/* routes are available.
export function useAIRecommendations() {
  return useQuery({
    queryKey: ["ai-recommendations"],
    queryFn: async () => {
      const response = await apiClient.get<{ data: AIRecommendation[] }>("/ai/recommendations");
      return response.data.data;
    },
    enabled: false,
  });
}

export function useAIOutfitSuggestions(style?: string, occasion?: string) {
  return useQuery({
    queryKey: ["ai-outfits", style, occasion],
    queryFn: async () => {
      const response = await apiClient.get<{ data: AIOutfitSuggestion[] }>("/ai/outfits", {
        params: { style, occasion },
      });
      return response.data.data;
    },
    enabled: false,
  });
}

export function useGenerateOutfit() {
  return useMutation({
    mutationFn: async (data: {
      style: string;
      occasion?: string;
      season?: string;
      preferences?: string[];
    }) => {
      const response = await apiClient.post<{ data: AIOutfitSuggestion }>("/ai/generate-outfit", data);
      return response.data.data;
    },
  });
}

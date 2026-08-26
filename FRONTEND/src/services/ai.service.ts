import axios from "axios";
import { apiClient } from "../api/client";
import type { Product } from "../types/product";

export interface AIStylistRequest {
  style?: string;
  occasion?: string;
  season?: string;
  preferences?: string;
  gender?: "MALE" | "FEMALE" | "UNISEX";
  priceMin?: number;
  priceMax?: number;
}

export interface OutfitRecommendation {
  title: string;
  productIds: string[];
  reason: string;
}

export interface AIStylistResponseData {
  advice: string;
  outfits: OutfitRecommendation[];
  products: Product[];
}

export interface AISearchRequest {
  query: string;
}

export interface SearchIntent {
  gender?: "MALE" | "FEMALE" | "UNISEX" | null;
  categories?: string[];
  colors?: string[];
  sizes?: string[];
  priceMin?: number | null;
  priceMax?: number | null;
  style?: string | null;
  occasion?: string | null;
  keywords?: string[];
}

export interface AISearchResponseData {
  intent: SearchIntent;
  products: Product[];
  count: number;
}

export const aiService = {
  getStylistRecommendations: async (
    data: AIStylistRequest
  ): Promise<AIStylistResponseData> => {
    try {
      const response = await apiClient.post<{
        success: boolean;
        message: string;
        data: AIStylistResponseData;
      }>("/ai/stylist", data);

      return {
        ...response.data.data,
        products: (response.data.data.products ?? []).map((product) => ({
          ...product,
          categories: product.categories ?? [],
          images: product.images ?? [],
          variants: product.variants ?? [],
        })),
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 401) {
          throw new Error("Please sign in to use AI Stylist.");
        }
        if (status === 400) {
          const serverMessage = error.response?.data?.message;
          throw new Error(
            serverMessage || "Please provide valid styling preferences."
          );
        }
        if (status === 429) {
          throw new Error(
            "You've reached your hourly AI Stylist limit (10 requests/hour). Please try again later."
          );
        }
        if (status === 500 || status === 503) {
          throw new Error(
            "The AI Stylist is temporarily unavailable. Please try again in a few moments."
          );
        }
        if (!error.response) {
          throw new Error(
            "Unable to connect to DressMe. Please check your internet connection and try again."
          );
        }
      }
      throw error;
    }
  },

  searchProducts: async (
    query: string
  ): Promise<AISearchResponseData> => {
    try {
      const response = await apiClient.post<{
        success: boolean;
        message: string;
        data: AISearchResponseData;
      }>("/ai/search", { query });

      return {
        ...response.data.data,
        products: (response.data.data.products ?? []).map((product) => ({
          ...product,
          categories: product.categories ?? [],
          images: product.images ?? [],
          variants: product.variants ?? [],
        })),
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 401) {
          throw new Error("Please sign in to use AI Search.");
        }
        if (status === 400) {
          const serverMessage = error.response?.data?.message;
          throw new Error(
            serverMessage || "Please provide a valid search query."
          );
        }
        if (status === 429) {
          throw new Error(
            "You've reached your hourly AI request limit (10 requests/hour). Please try again later."
          );
        }
        if (status === 500 || status === 503) {
          throw new Error(
            "The AI Search is temporarily unavailable. Please try again in a few moments."
          );
        }
        if (!error.response) {
          throw new Error(
            "Unable to connect to DressMe. Please check your internet connection and try again."
          );
        }
      }
      throw error;
    }
  },
};

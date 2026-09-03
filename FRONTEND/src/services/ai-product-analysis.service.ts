import axios from "axios";
import { apiClient } from "../api/client";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AIProductIdentity {
  productName: string;
  productType: string;
  category: string;
  subcategory: string;
  gender: string;
  brand: string;
  productGroup: string;
}

export interface AIProductAppearance {
  primaryColor: string;
  secondaryColors: string;
  colorFamily: string;
  pattern: string;
  print: string;
  texture: string;
  material: string;
  finish: string;
  visibleDetails: string[];
  logoBranding: string;
}

export interface AIProductStyle {
  style: string;
  aesthetic: string;
  fit: string;
  silhouette: string;
  length: string;
  formality: string;
  fashionLevel: string;
  styleKeywords: string[];
}

export interface AIProductOccasion {
  primaryOccasion: string;
  suitableOccasions: string[];
}

export interface AIProductWeather {
  weatherSuitability: string[];
  climateSuitability: string;
  season: string;
  layeringSuitability: string;
}

export interface AIProductOutfitIntelligence {
  recommendedTops: string;
  recommendedBottoms: string;
  recommendedShoes: string[];
  recommendedOuterwear: string[];
  recommendedAccessories: string[];
  complementaryColors: string[];
}

export interface AIProductDescriptions {
  shortDescription: string;
  fullDescription: string;
  marketingDescription: string;
}

export interface AIProductSEO {
  seoTitle: string;
  metaDescription: string;
  urlSlug: string;
  searchKeywords: string[];
  searchSynonyms: string[];
  relatedSearchTerms: string[];
}

export interface AIProductAIStylist {
  bestFor: string[];
  styleProfile: string;
  recommendedUserIntent: string;
  compatibleProductCategories: string[];
  compatibleColors: string[];
  outfitIdeas: string[];
  stylingNotes: string;
}

export interface AIProductConfidence {
  overallConfidence: "High" | "Medium" | "Low";
  highConfidenceAttributes: string[];
  uncertainAttributes: string[];
  humanVerificationRequired: string[];
}

export interface AIProductManualFields {
  brand: string;
  vendor: string;
  sku: string;
  price: string;
  discountPrice: string;
  currency: string;
  availableSizes: string;
  availableQuantity: string;
  stockStatus: string;
  materialComposition: string;
  productMeasurements: string;
  careInstructions: string;
}

export interface AIProductSummary {
  productName: string;
  category: string;
  primaryColor: string;
  style: string;
  primaryOccasion: string;
  weatherSuitability: string;
  topDressMetags: string;
  oneLineSellingPoint: string;
}

export interface AIProductAnalysisResult {
  identity: AIProductIdentity;
  appearance: AIProductAppearance;
  style: AIProductStyle;
  occasion: AIProductOccasion;
  weather: AIProductWeather;
  outfitIntelligence: AIProductOutfitIntelligence;
  descriptions: AIProductDescriptions;
  seo: AIProductSEO;
  dressMeTags: string[];
  aiStylist: AIProductAIStylist;
  confidence: AIProductConfidence;
  manualFields: AIProductManualFields;
  summary: AIProductSummary;
}

// ── Service ───────────────────────────────────────────────────────────────────

export const aiProductAnalysisService = {
  analyzeProduct: async (imageUrls: string[]): Promise<AIProductAnalysisResult> => {
    try {
      const response = await apiClient.post<{
        success: boolean;
        message: string;
        data: AIProductAnalysisResult;
      }>("/ai/analyze-product", { imageUrls });

      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 401) {
          throw new Error("Admin authentication required to use AI Product Analysis.");
        }
        if (status === 400) {
          const serverMessage = error.response?.data?.message;
          throw new Error(serverMessage || "Invalid request. Please provide valid image URLs.");
        }
        if (status === 429) {
          throw new Error(
            "You've reached your hourly AI request limit. Please try again later."
          );
        }
        if (status === 500 || status === 503) {
          throw new Error(
            "AI Product Analysis is temporarily unavailable. Please try again in a few moments."
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

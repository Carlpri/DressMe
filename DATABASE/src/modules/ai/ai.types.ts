export interface OutfitRecommendation {
  title: string;
  productIds: string[];
  reason: string;
}

export interface AIStylistResponseData {
  advice: string;
  outfits: OutfitRecommendation[];
  products: unknown[];
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
  products: unknown[];
  count: number;
}

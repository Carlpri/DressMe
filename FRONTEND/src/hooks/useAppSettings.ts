import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface AppSettingsData {
  id?: string;
  siteName: string;
  tagline?: string;
  logoUrl?: string;
  logoDarkUrl?: string;
  faviconUrl?: string;
  heroBannerUrl?: string;

  supportEmail?: string;
  supportPhone?: string;
  whatsappNumber?: string;

  facebook?: string;
  instagram?: string;
  tiktok?: string;
  x?: string;
  linkedin?: string;
  youtube?: string;

  heroTitle?: string;
  heroSubtitle?: string;
  heroCtaText?: string;
  heroCtaLink?: string;
  featuredCategorySlug?: string;
  featuredBrandSlug?: string;
  featuredProductsLimit?: number;
  trendingProductsLimit?: number;
  newArrivalsLimit?: number;
  bestSellersLimit?: number;

  physicalAddress?: string;
  businessHours?: string;

  currency: string;
  defaultShippingFee: number;

  aboutUs?: string;
  privacyPolicy?: string;
  termsOfService?: string;
  refundPolicy?: string;
  shippingPolicy?: string;

  siteTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogImageUrl?: string;
  twitterCardType?: string;

  maintenanceMode: boolean;
  country?: string;
  language?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export function useAppSettings() {
  const query = useQuery<AppSettingsData>({
    queryKey: ["app-settings-public"],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/app-settings/public`);
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    settings: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

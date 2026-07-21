import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";

export interface SiteSettings {
  id: string;
  siteName: string;
  tagline: string | null;
  logoUrl: string | null;
  logoDarkUrl: string | null;
  faviconUrl: string | null;
  heroBannerUrl: string | null;
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  heroCtaText?: string | null;
  heroCtaLink?: string | null;
  supportEmail: string | null;
  supportPhone: string | null;
  whatsapp: string | null;
  whatsappNumber?: string | null;
  facebook: string | null;
  instagram: string | null;
  tiktok: string | null;
  x: string | null;
  linkedin: string | null;
  youtube: string | null;
  physicalAddress: string | null;
  businessHours?: string | null;
  country?: string | null;
  language?: string | null;
  siteTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  ogImageUrl?: string | null;
  currency: string;
  defaultShippingFee: number;
  aboutUs: string | null;
  privacyPolicy: string | null;
  termsOfService: string | null;
  refundPolicy: string | null;
  shippingPolicy: string | null;
  maintenanceMode: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSiteSettingsData {
  siteName?: string;
  tagline?: string;
  logoUrl?: string;
  logoDarkUrl?: string;
  faviconUrl?: string;
  heroBannerUrl?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroCtaText?: string;
  heroCtaLink?: string;
  supportEmail?: string;
  supportPhone?: string;
  whatsapp?: string;
  whatsappNumber?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  x?: string;
  linkedin?: string;
  youtube?: string;
  physicalAddress?: string;
  businessHours?: string;
  country?: string;
  language?: string;
  siteTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogImageUrl?: string;
  currency?: string;
  defaultShippingFee?: number;
  aboutUs?: string;
  privacyPolicy?: string;
  termsOfService?: string;
  refundPolicy?: string;
  shippingPolicy?: string;
  maintenanceMode?: boolean;
}

export function usePublicSiteSettings() {
  return useQuery({
    queryKey: ["publicSiteSettings"],
    queryFn: async () => {
      const response = await apiClient.get<{ data: SiteSettings }>("/settings/public");
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}

export function useSiteSettings() {
  return useQuery({
    queryKey: ["siteSettings"],
    queryFn: async () => {
      const response = await apiClient.get<{ data: SiteSettings }>("/settings");
      return response.data.data;
    },
  });
}

export function useUpdateSiteSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateSiteSettingsData }) => {
      const response = await apiClient.patch<{ data: SiteSettings }>(`/settings/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["siteSettings"] });
      queryClient.invalidateQueries({ queryKey: ["publicSiteSettings"] });
    },
  });
}

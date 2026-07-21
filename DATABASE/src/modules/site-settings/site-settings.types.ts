export interface CreateSiteSettingsDto {
  siteName: string;
  tagline?: string;
  logoUrl?: string;
  logoDarkUrl?: string;
  faviconUrl?: string;
  heroBannerUrl?: string;

  // Contact
  supportEmail?: string;
  supportPhone?: string;
  whatsappNumber?: string;
  physicalAddress?: string;
  businessHours?: string;

  // Socials
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  x?: string;
  linkedin?: string;
  youtube?: string;

  // Homepage CMS
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

  // Commerce & Legal
  currency?: string;
  defaultShippingFee?: number;
  aboutUs?: string;
  privacyPolicy?: string;
  termsOfService?: string;
  refundPolicy?: string;
  shippingPolicy?: string;

  // SEO
  siteTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogImageUrl?: string;
  twitterCardType?: string;

  // Controls
  maintenanceMode?: boolean;
  country?: string;
  language?: string;
}

export interface UpdateSiteSettingsDto {
  siteName?: string;
  tagline?: string;
  logoUrl?: string;
  logoDarkUrl?: string;
  faviconUrl?: string;
  heroBannerUrl?: string;

  // Contact
  supportEmail?: string;
  supportPhone?: string;
  whatsappNumber?: string;
  physicalAddress?: string;
  businessHours?: string;

  // Socials
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  x?: string;
  linkedin?: string;
  youtube?: string;

  // Homepage CMS
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

  // Commerce & Legal
  currency?: string;
  defaultShippingFee?: number;
  aboutUs?: string;
  privacyPolicy?: string;
  termsOfService?: string;
  refundPolicy?: string;
  shippingPolicy?: string;

  // SEO
  siteTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogImageUrl?: string;
  twitterCardType?: string;

  // Controls
  maintenanceMode?: boolean;
  country?: string;
  language?: string;
}

export interface PublicSiteSettings {
  id: string;
  siteName: string;
  tagline?: string | null;
  logoUrl?: string | null;
  logoDarkUrl?: string | null;
  faviconUrl?: string | null;
  heroBannerUrl?: string | null;

  // Contact
  supportEmail?: string | null;
  supportPhone?: string | null;
  whatsappNumber?: string | null;
  physicalAddress?: string | null;
  businessHours?: string | null;

  // Socials
  facebook?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  x?: string | null;
  linkedin?: string | null;
  youtube?: string | null;

  // Homepage CMS
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  heroCtaText?: string | null;
  heroCtaLink?: string | null;
  featuredCategorySlug?: string | null;
  featuredBrandSlug?: string | null;
  featuredProductsLimit: number;
  trendingProductsLimit: number;
  newArrivalsLimit: number;
  bestSellersLimit: number;

  // Commerce & Legal
  currency: string;
  defaultShippingFee: number;
  aboutUs?: string | null;
  privacyPolicy?: string | null;
  termsOfService?: string | null;
  refundPolicy?: string | null;
  shippingPolicy?: string | null;

  // SEO
  siteTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  ogImageUrl?: string | null;
  twitterCardType?: string | null;

  // Controls
  maintenanceMode: boolean;
  country?: string | null;
  language?: string | null;

  createdAt: string;
  updatedAt: string;
}


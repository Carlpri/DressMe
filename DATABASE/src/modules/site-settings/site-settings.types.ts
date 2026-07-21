export interface CreateSiteSettingsDto {
  siteName: string;
  tagline?: string;
  logoUrl?: string;
  logoDarkUrl?: string;
  faviconUrl?: string;
  heroBannerUrl?: string;
  supportEmail?: string;
  supportPhone?: string;
  whatsapp?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  x?: string;
  linkedin?: string;
  youtube?: string;
  physicalAddress?: string;
  currency?: string;
  defaultShippingFee?: number;
  aboutUs?: string;
  privacyPolicy?: string;
  termsOfService?: string;
  refundPolicy?: string;
  shippingPolicy?: string;
  maintenanceMode?: boolean;
}

export interface UpdateSiteSettingsDto {
  siteName?: string;
  tagline?: string;
  logoUrl?: string;
  logoDarkUrl?: string;
  faviconUrl?: string;
  heroBannerUrl?: string;
  supportEmail?: string;
  supportPhone?: string;
  whatsapp?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  x?: string;
  linkedin?: string;
  youtube?: string;
  physicalAddress?: string;
  currency?: string;
  defaultShippingFee?: number;
  aboutUs?: string;
  privacyPolicy?: string;
  termsOfService?: string;
  refundPolicy?: string;
  shippingPolicy?: string;
  maintenanceMode?: boolean;
}

export interface PublicSiteSettings {
  siteName: string;
  tagline?: string;
  logoUrl?: string;
  logoDarkUrl?: string;
  faviconUrl?: string;
  heroBannerUrl?: string;
  supportEmail?: string;
  supportPhone?: string;
  whatsapp?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  x?: string;
  linkedin?: string;
  youtube?: string;
  physicalAddress?: string;
  currency: string;
  defaultShippingFee: number;
  aboutUs?: string;
  privacyPolicy?: string;
  termsOfService?: string;
  refundPolicy?: string;
  shippingPolicy?: string;
  maintenanceMode: boolean;
}

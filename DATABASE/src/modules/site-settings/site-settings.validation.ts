import { z } from "zod";

export const updateSiteSettingsSchema = z.object({
  body: z.object({
    siteName: z
      .string()
      .trim()
      .min(2, "Site name must be at least 2 characters")
      .optional(),

    tagline: z
      .string()
      .trim()
      .max(200)
      .optional(),

    logoUrl: z
      .string()
      .url("Logo URL must be a valid URL")
      .optional(),

    logoDarkUrl: z
      .string()
      .url("Dark logo URL must be a valid URL")
      .optional(),

    faviconUrl: z
      .string()
      .url("Favicon URL must be a valid URL")
      .optional(),

    heroBannerUrl: z
      .string()
      .url("Hero banner URL must be a valid URL")
      .optional(),

    supportEmail: z
      .string()
      .email("Support email must be a valid email")
      .optional(),

    supportPhone: z
      .string()
      .trim()
      .optional(),

    whatsapp: z
      .string()
      .trim()
      .optional(),

    facebook: z
      .string()
      .url("Facebook URL must be a valid URL")
      .optional(),

    instagram: z
      .string()
      .url("Instagram URL must be a valid URL")
      .optional(),

    tiktok: z
      .string()
      .url("TikTok URL must be a valid URL")
      .optional(),

    x: z
      .string()
      .url("X (Twitter) URL must be a valid URL")
      .optional(),

    linkedin: z
      .string()
      .url("LinkedIn URL must be a valid URL")
      .optional(),

    youtube: z
      .string()
      .url("YouTube URL must be a valid URL")
      .optional(),

    physicalAddress: z
      .string()
      .trim()
      .optional(),

    currency: z
      .string()
      .trim()
      .length(3, "Currency must be a 3-letter code")
      .optional(),

    defaultShippingFee: z
      .number()
      .min(0, "Default shipping fee must be non-negative")
      .optional(),

    aboutUs: z
      .string()
      .trim()
      .optional(),

    privacyPolicy: z
      .string()
      .trim()
      .optional(),

    termsOfService: z
      .string()
      .trim()
      .optional(),

    refundPolicy: z
      .string()
      .trim()
      .optional(),

    shippingPolicy: z
      .string()
      .trim()
      .optional(),

    maintenanceMode: z
      .boolean()
      .optional(),
  }),
});

export type UpdateSiteSettingsInput = z.infer<typeof updateSiteSettingsSchema>;

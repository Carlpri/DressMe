import prisma from "../../config/prisma.js";
import {
  UpdateSiteSettingsDto,
} from "./site-settings.types.js";

export class SiteSettingsRepository {
  async findFirst() {
    return prisma.siteSettings.findFirst();
  }

  async findById(id: string) {
    return prisma.siteSettings.findUnique({
      where: { id },
    });
  }

  async update(
    id: string,
    data: UpdateSiteSettingsDto
  ) {
    return prisma.siteSettings.update({
      where: { id },
      data,
    });
  }

  async create(data: {
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
  }) {
    return prisma.siteSettings.create({
      data,
    });
  }
}

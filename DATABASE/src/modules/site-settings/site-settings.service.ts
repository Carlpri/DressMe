import { ApiError } from "../../utils/api-error.js";
import { SiteSettingsRepository } from "./site-settings.repository.js";
import type {
  UpdateSiteSettingsDto,
  PublicSiteSettings,
} from "./site-settings.types.js";

export class SiteSettingsService {
  private repository = new SiteSettingsRepository();

  async getPublic() {
    const settings = await this.repository.findFirst();

    if (!settings) {
      throw new ApiError(
        404,
        "Site settings not found. Please contact administrator."
      );
    }

    const publicSettings: PublicSiteSettings = {
      siteName: settings.siteName,
      tagline: settings.tagline || undefined,
      logoUrl: settings.logoUrl || undefined,
      logoDarkUrl: settings.logoDarkUrl || undefined,
      faviconUrl: settings.faviconUrl || undefined,
      heroBannerUrl: settings.heroBannerUrl || undefined,
      supportEmail: settings.supportEmail || undefined,
      supportPhone: settings.supportPhone || undefined,
      whatsapp: settings.whatsapp || undefined,
      facebook: settings.facebook || undefined,
      instagram: settings.instagram || undefined,
      tiktok: settings.tiktok || undefined,
      x: settings.x || undefined,
      linkedin: settings.linkedin || undefined,
      youtube: settings.youtube || undefined,
      physicalAddress: settings.physicalAddress || undefined,
      currency: settings.currency,
      defaultShippingFee: settings.defaultShippingFee,
      aboutUs: settings.aboutUs || undefined,
      privacyPolicy: settings.privacyPolicy || undefined,
      termsOfService: settings.termsOfService || undefined,
      refundPolicy: settings.refundPolicy || undefined,
      shippingPolicy: settings.shippingPolicy || undefined,
      maintenanceMode: settings.maintenanceMode,
    };

    return publicSettings;
  }

  async getAll() {
    const settings = await this.repository.findFirst();

    if (!settings) {
      throw new ApiError(
        404,
        "Site settings not found. Please contact administrator."
      );
    }

    return settings;
  }

  async update(id: string, data: UpdateSiteSettingsDto) {
    const settings = await this.repository.findById(id);

    if (!settings) {
      throw new ApiError(
        404,
        "Site settings not found."
      );
    }

    return this.repository.update(id, data);
  }

  async seedDefault() {
    const existing = await this.repository.findFirst();

    if (existing) {
      return existing;
    }

    return this.repository.create({
      siteName: "DressMe",
      tagline: "Your Style. Powered by AI. Inspired by You.",
      currency: "KES",
      defaultShippingFee: 500,
      maintenanceMode: false,
    });
  }
}

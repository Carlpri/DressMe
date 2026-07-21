import { ApiError } from "../../utils/api-error.js";
import { SiteSettingsRepository } from "./site-settings.repository.js";
import type {
  UpdateSiteSettingsDto,
  PublicSiteSettings,
} from "./site-settings.types.js";

export class SiteSettingsService {
  private repository = new SiteSettingsRepository();

  async getPublic() {
    let settings = await this.repository.findFirst();

    if (!settings) {
      settings = await this.seedDefault();
    }

    return settings;
  }

  async getAll() {
    let settings = await this.repository.findFirst();

    if (!settings) {
      settings = await this.seedDefault();
    }

    return settings;
  }

  async update(id: string, data: any) {
    const settings = await this.repository.findById(id);

    if (!settings) {
      throw new ApiError(404, "App settings not found.");
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
      tagline: "Your Fashion Destination",
      whatsappNumber: "254700000000",
      supportPhone: "+254 700 000 000",
      supportEmail: "support@dressme.com",
      currency: "KES",
      defaultShippingFee: 500,
      maintenanceMode: false,
    });
  }
}

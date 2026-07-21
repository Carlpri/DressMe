import { SiteSettingsService } from "./site-settings.service.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { ApiResponse } from "../../utils/api-response.js";

const siteSettingsService = new SiteSettingsService();

export class SiteSettingsController {
  getPublicSettings = asyncHandler(async (_req, res) => {
    const settings = await siteSettingsService.getPublic();

    ApiResponse.success(
      res,
      200,
      "Public site settings retrieved successfully.",
      settings
    );
  });

  getSettings = asyncHandler(async (_req, res) => {
    const settings = await siteSettingsService.getAll();

    ApiResponse.success(
      res,
      200,
      "Site settings retrieved successfully.",
      settings
    );
  });

  updateSettings = asyncHandler(async (req, res) => {
    const settings = await siteSettingsService.update(
      req.params.id as string,
      req.body
    );

    ApiResponse.success(
      res,
      200,
      "Site settings updated successfully.",
      settings
    );
  });

  seedDefaultSettings = asyncHandler(async (_req, res) => {
    const settings = await siteSettingsService.seedDefault();

    ApiResponse.success(
      res,
      200,
      "Default site settings seeded successfully.",
      settings
    );
  });
}

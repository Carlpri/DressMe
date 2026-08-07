import { VendorService } from "./vendor.service.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { ApiResponse } from "../../utils/api-response.js";

const vendorService = new VendorService();

export class VendorController {
  createVendor = asyncHandler(async (req, res) => {
    const { userId: bodyUserId, ...vendorData } = req.body;
    const userId = bodyUserId || req.user.userId;

    const vendor = await vendorService.create(userId, vendorData);

    ApiResponse.success(
      res,
      201,
      "Vendor profile created successfully.",
      vendor
    );
  });

  getVendors = asyncHandler(async (_req, res) => {
    const vendors = await vendorService.getAll();

    ApiResponse.success(
      res,
      200,
      "Vendors retrieved successfully.",
      vendors
    );
  });

  getVendor = asyncHandler(async (req, res) => {
    const vendor = await vendorService.getById(
      req.params.id as string
    );

    ApiResponse.success(
      res,
      200,
      "Vendor retrieved successfully.",
      vendor
    );
  });

  updateVendor = asyncHandler(async (req, res) => {
    const vendor = await vendorService.update(
      req.params.id as string,
      req.body
    );

    ApiResponse.success(
      res,
      200,
      "Vendor updated successfully.",
      vendor
    );
  });

  deleteVendor = asyncHandler(async (req, res) => {
    await vendorService.delete(
      req.params.id as string
    );

    ApiResponse.success(
      res,
      200,
      "Vendor deleted successfully.",
      null
    );
  });
}
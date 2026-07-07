import { BrandService } from "./brand.service.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { ApiResponse } from "../../utils/api-response.js";

const brandService = new BrandService();

export class BrandController {
  createBrand = asyncHandler(async (req, res) => {
    const brand = await brandService.create(req.body);

    ApiResponse.success(
      res,
      201,
      "Brand created successfully.",
      brand
    );
  });

  getBrands = asyncHandler(async (_req, res) => {
    const brands = await brandService.getAll();

    ApiResponse.success(
      res,
      200,
      "Brands retrieved successfully.",
      brands
    );
  });

  getBrand = asyncHandler(async (req, res) => {
    const brand = await brandService.getBySlug(
      req.params.slug as string
    );

    ApiResponse.success(
      res,
      200,
      "Brand retrieved successfully.",
      brand
    );
  });

  updateBrand = asyncHandler(async (req, res) => {
    const brand = await brandService.update(
      req.params.id as string,
      req.body
    );

    ApiResponse.success(
      res,
      200,
      "Brand updated successfully.",
      brand
    );
  });

  deleteBrand = asyncHandler(async (req, res) => {
    await brandService.delete(req.params.id as string);

    ApiResponse.success(
      res,
      200,
      "Brand deleted successfully.",
      null
    );
  });
}
import { ApiResponse } from "../../utils/api-response.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { AddressService } from "./address.service.js";

const addressService = new AddressService();

export class AddressController {
  createAddress = asyncHandler(async (req, res) => {
    const address = await addressService.create(
      req.user.userId,
      req.body
    );

    ApiResponse.success(
      res,
      201,
      "Address created successfully.",
      address
    );
  });

  getAddresses = asyncHandler(async (req, res) => {
    const addresses = await addressService.getAll(req.user.userId);

    ApiResponse.success(
      res,
      200,
      "Addresses retrieved successfully.",
      addresses
    );
  });

  getAddress = asyncHandler(async (req, res) => {
    const address = await addressService.getById(
      req.user.userId,
      req.params.id as string
    );

    ApiResponse.success(
      res,
      200,
      "Address retrieved successfully.",
      address
    );
  });

  getDefaultAddress = asyncHandler(async (req, res) => {
    const address = await addressService.getDefault(req.user.userId);

    ApiResponse.success(
      res,
      200,
      "Default address retrieved successfully.",
      address
    );
  });

  updateAddress = asyncHandler(async (req, res) => {
    const address = await addressService.update(
      req.user.userId,
      req.params.id as string,
      req.body
    );

    ApiResponse.success(
      res,
      200,
      "Address updated successfully.",
      address
    );
  });

  setDefaultAddress = asyncHandler(async (req, res) => {
    const address = await addressService.setDefault(
      req.user.userId,
      req.params.id as string
    );

    ApiResponse.success(
      res,
      200,
      "Default address updated successfully.",
      address
    );
  });

  deleteAddress = asyncHandler(async (req, res) => {
    await addressService.delete(
      req.user.userId,
      req.params.id as string
    );

    ApiResponse.success(
      res,
      200,
      "Address deleted successfully.",
      null
    );
  });
}

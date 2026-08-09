import { asyncHandler } from "../../utils/async-handler.js";
import { ApiResponse } from "../../utils/api-response.js";
import { UserService } from "./user.service.js";

const userService = new UserService();

export class UserController {
  getProfile = asyncHandler(async (req, res) => {
    const user = await userService.getProfile(req.user.userId);
    ApiResponse.success(res, 200, "Profile retrieved successfully.", user);
  });

  getAllUsers = asyncHandler(async (_req, res) => {
    const users = await userService.getAllUsers();
    ApiResponse.success(res, 200, "Users retrieved successfully.", users);
  });

  updateProfile = asyncHandler(async (req, res) => {
    const user = await userService.updateProfile(req.user.userId, req.body);
    ApiResponse.success(res, 200, "Profile updated successfully.", user);
  });

  changePassword = asyncHandler(async (req, res) => {
    await userService.changePassword(req.user.userId, req.body);
    ApiResponse.success(res, 200, "Password changed successfully.", null);
  });

  updateUserRole = asyncHandler(async (req, res) => {
    const user = await userService.updateUserRole(req.body.userId, req.body.role);
    ApiResponse.success(res, 200, "User role updated successfully.", user);
  });

  promoteToVendor = asyncHandler(async (req, res) => {
    const { userId, ...vendorData } = req.body;
    const promotion = await userService.promoteToVendor(userId, vendorData);
    ApiResponse.success(res, 201, "User promoted to vendor successfully.", promotion);
  });
}

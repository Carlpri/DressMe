import { Request, Response } from "express";
import { UserService } from "./user.service.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { ApiResponse } from "../../utils/api-response.js";

const userService = new UserService();

export class UserController {
     getProfile = asyncHandler(
  async (req, res) => {
    const user = await userService.getProfile(
      req.user.userId
    );

    ApiResponse.success(
      res,
      200,
      "Profile retrieved successfully.",
      user
    );
  }
);

  getAllUsers = asyncHandler(
    async (_req, res) => {
      const users = await userService.getAllUsers();
      ApiResponse.success(
        res,
        200,
        "Users retrieved successfully.",
        users
      );
    }
  );

  updateProfile = asyncHandler(
    async (req, res) => {
      const updatedUser = await userService.updateProfile(
        req.user.userId,
        req.body
      );
      ApiResponse.success(
        res, 
        200,
        "Profile updated successfully.",
    updatedUser
    );
 } 
 );

 changePassword = asyncHandler(
    async ( req, res)=>{
        await userService.changePassword(
            req.user.userId,
            req.body
        );
    ApiResponse.success(
        res,
        200,
        "Password changed successfully.",
        null
       );
    }
 );

  updateUserRole = asyncHandler(
    async (req, res) => {
      const { userId, role } = req.body;
      const updatedUser = await userService.updateUserRole(userId, role);
      ApiResponse.success(
        res,
        200,
        "User role updated successfully.",
        updatedUser
      );
    }
  );

  promoteToVendor = asyncHandler(
    async (req, res) => {
      const { userId, ...vendorData } = req.body;
      // Normalise field names — frontend always sends businessName + whatsappNumber
      const cleanData = {
        ...vendorData,
        businessName:   vendorData.businessName,
        whatsappNumber: vendorData.whatsappNumber,
      };
      const vendor = await userService.promoteToVendor(userId, cleanData);
      ApiResponse.success(
        res,
        201,
        "User promoted to vendor successfully.",
        vendor
      );
    }
  );

}
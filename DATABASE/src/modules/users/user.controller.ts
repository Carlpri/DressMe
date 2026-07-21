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
    async ( req, res) =>{
        console.log(req.body);
        
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

}
import { ApiError } from "../../utils/api-error.js";
import { UserRepository } from "./user.repository.js";
import type { updateProfileDto, changePasswordDto } from "./user.types.js";
import bcrypt from "bcrypt";

export class UserService {
  private repository = new UserRepository();

  async getProfile(userId: string) {
    const user = await this.repository.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    return user;
  }

  async getAllUsers() {
    return this.repository.findAll();
  }

  async updateProfile(
    userId: string,
    data: updateProfileDto
  ){
    return this.repository.updateProfile(userId, data);
  }


  async changePassword(
  userId: string,
  data: changePasswordDto
) {
  const user = await this.repository.findByIdWithPassword(userId);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const isMatch = await bcrypt.compare(
    data.currentPassword,
    user.password
  );

  if (!isMatch) {
    throw new ApiError(401, "Current password is incorrect.");
  }

  const isSamePassword = await bcrypt.compare(
  data.newPassword,
  user.password
);

if (isSamePassword) {
  throw new ApiError(
    400,
    "New password must be different from the current password."
  );
}

  const hashedPassword = await bcrypt.hash(
    data.newPassword,
    12
  );

  await this.repository.updatePassword(
    userId,
    hashedPassword
  );
}

  async updateUserRole(userId: string, role: string) {
    const user = await this.repository.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    return this.repository.updateRole(userId, role);
  }

  async promoteToVendor(userId: string, vendorData: any) {
    const user = await this.repository.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    if (user.role === "VENDOR") {
      throw new ApiError(409, "User is already a vendor.");
    }

    // Update user role to VENDOR
    await this.repository.updateRole(userId, "VENDOR");

    // Import VendorService to create vendor profile
    const { VendorRepository } = await import("../vendors/vendor.repository.js");
    const vendorRepository = new VendorRepository();

    // Check if vendor profile already exists
    const existingVendor = await vendorRepository.findByUserId(userId);
    if (existingVendor) {
      throw new ApiError(409, "Vendor profile already exists for this user.");
    }

    // Create vendor profile
    return vendorRepository.create(userId, vendorData);
  }
}
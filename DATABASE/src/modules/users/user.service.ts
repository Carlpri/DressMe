import bcrypt from "bcrypt";
import prisma from "../../config/prisma.js";
import { ApiError } from "../../utils/api-error.js";
import type { CreateVendorDto } from "../vendors/vendor.types.js";
import { UserRepository } from "./user.repository.js";
import type { changePasswordDto, updateProfileDto } from "./user.types.js";

export class UserService {
  private repository = new UserRepository();

  async getProfile(userId: string) {
    const user = await this.repository.findById(userId);
    if (!user) throw new ApiError(404, "User not found.");
    return user;
  }

  async getAllUsers() {
    return this.repository.findAll();
  }

  async updateProfile(userId: string, data: updateProfileDto) {
    return this.repository.updateProfile(userId, data);
  }

  async changePassword(userId: string, data: changePasswordDto) {
    const user = await this.repository.findByIdWithPassword(userId);
    if (!user) throw new ApiError(404, "User not found.");
    if (!(await bcrypt.compare(data.currentPassword, user.password))) {
      throw new ApiError(401, "Current password is incorrect.");
    }
    if (await bcrypt.compare(data.newPassword, user.password)) {
      throw new ApiError(400, "New password must be different from the current password.");
    }
    await this.repository.updatePassword(userId, await bcrypt.hash(data.newPassword, 12));
  }

  async updateUserRole(userId: string, role: string) {
    const user = await this.repository.findById(userId);
    if (!user) throw new ApiError(404, "User not found.");
    return this.repository.updateRole(userId, role);
  }

  async promoteToVendor(userId: string, vendorData: Omit<CreateVendorDto, "userId">) {
    const user = await this.repository.findById(userId);
    if (!user) throw new ApiError(404, "User not found.");
    if (user.status !== "ACTIVE") throw new ApiError(403, "Inactive users cannot be promoted to vendor.");

    const existingVendor = await prisma.vendor.findUnique({ where: { userId } });
    if (existingVendor) throw new ApiError(409, "Vendor profile already exists for this user.");

    return prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { role: "VENDOR" },
        select: { id: true, name: true, email: true, avatar: true, role: true, status: true },
      });
      const vendor = await tx.vendor.create({
        data: {
          userId,
          businessName: vendorData.businessName,
          whatsappNumber: vendorData.whatsappNumber,
          address: vendorData.address,
          location: vendorData.location,
          phoneNumber: vendorData.phoneNumber ?? null,
          email: vendorData.email ?? null,
          businessEmail: vendorData.businessEmail ?? null,
          city: vendorData.city ?? null,
          county: vendorData.county ?? null,
          town: vendorData.town ?? null,
          contactPerson: vendorData.contactPerson ?? null,
          logo: vendorData.logo ?? null,
          description: vendorData.description ?? null,
          coverImage: vendorData.coverImage ?? null,
          facebook: vendorData.facebook ?? null,
          instagram: vendorData.instagram ?? null,
          tiktok: vendorData.tiktok ?? null,
          website: vendorData.website ?? null,
        },
      });
      return { user: updatedUser, vendor };
    });
  }
}

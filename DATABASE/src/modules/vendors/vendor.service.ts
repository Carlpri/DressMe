import { ApiError } from "../../utils/api-error.js";
import { VendorRepository } from "./vendor.repository.js";
import type {
  CreateVendorDto,
  UpdateVendorDto,
} from "./vendor.types.js";
import { Role } from "@prisma/client";

export class VendorService {
  private repository = new VendorRepository();

  async create(
    userId: string,
    data: CreateVendorDto
  ) {
    // Admin can create vendor for another user by specifying userId in data
    const targetUserId = data.userId || userId;

    const existingVendor =
      await this.repository.findByUserId(targetUserId);

    if (existingVendor) {
      throw new ApiError(
        409,
        "Vendor profile already exists for this user."
      );
    }

    return this.repository.create(targetUserId, data);
  }

  async getAll() {
    return this.repository.findAll();
  }

  async getById(id: string) {
    const vendor = await this.repository.findById(id);

    if (!vendor) {
      throw new ApiError(404, "Vendor not found.");
    }

    return vendor;
  }

  async update(
    id: string,
    userId: string,
    role: Role,
    data: UpdateVendorDto
  ) {
    const vendor = await this.repository.findById(id);

    if (!vendor) {
      throw new ApiError(404, "Vendor not found.");
    }

    this.ensureCanManageVendor(vendor.userId, userId, role);
    return this.repository.update(id, data);
  }

  async delete(id: string, userId: string, role: Role) {
    const vendor = await this.repository.findById(id);

    if (!vendor) {
      throw new ApiError(404, "Vendor not found.");
    }

    this.ensureCanManageVendor(vendor.userId, userId, role);
    await this.repository.delete(id);
  }

  private ensureCanManageVendor(vendorUserId: string, userId: string, role: Role) {
    if (role !== Role.ADMIN && vendorUserId !== userId) {
      throw new ApiError(403, "You can only manage your own vendor profile.");
    }
  }
}

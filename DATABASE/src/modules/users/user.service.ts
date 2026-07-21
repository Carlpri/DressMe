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
}
export interface updateProfileDto {
  name?: string;
  avatar?: string;
}

export interface changePasswordDto {
  currentPassword: string;
  newPassword: string;
}

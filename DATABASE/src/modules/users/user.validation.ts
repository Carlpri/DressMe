import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(100)
    .optional(),

  avatar: z
    .string()
    .url()
    .optional(),
});

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(8,
     "Current password must contain at least 8 characters"),
    newPassword: z.string()
      .min(8,
        "New password must contain at least 8 characters")
        .max(100)
 }
);
import { z } from "zod";

const optionalUrl = z.string().url().or(z.literal("")).optional();
const optionalWebsite = z.string().optional();

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

export const updateRoleSchema = z.object({
  body: z.object({
    userId: z.string().cuid(),
    role: z.enum(["USER", "VENDOR", "ADMIN"]),
  }),
});

export const promoteToVendorSchema = z.object({
  body: z.object({
    userId: z.string().cuid(),
    businessName: z.string().min(3),
    whatsappNumber: z.string().min(10),
    address: z.string().min(5),
    location: z.string().min(2).optional(),
    logo: optionalUrl,
    description: z.string().optional(),
    coverImage: optionalUrl,
    facebook: optionalUrl,
    instagram: optionalUrl,
    tiktok: optionalUrl,
    website: optionalWebsite,
  }),
});

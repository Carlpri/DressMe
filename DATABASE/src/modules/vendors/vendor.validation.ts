import { z } from "zod";

export const createVendorSchema = z.object({
  body: z.object({
    businessName: z.string().min(3),

    whatsappNumber: z.string().min(10),

    address: z.string().min(5),

    location: z.string().min(2),

    phoneNumber: z.string().min(10).optional(),

    email: z.string().email().optional(),

    city: z.string().min(2).optional(),

    county: z.string().min(2).optional(),

    town: z.string().min(2).optional(),

    contactPerson: z.string().min(2).optional(),

    logo: z.string().url().optional(),

    description: z.string().optional(),

    coverImage: z.string().url().optional(),

    businessEmail: z.string().email().optional(),

    facebook: z.string().url().optional(),

    instagram: z.string().url().optional(),

    tiktok: z.string().url().optional(),

    website: z.string().url().optional(),
  }),
});

export const updateVendorSchema = z.object({
  body: z.object({
    businessName: z.string().min(3).optional(),

    whatsappNumber: z.string().min(10).optional(),

    address: z.string().min(5).optional(),

    location: z.string().min(2).optional(),

    phoneNumber: z.string().min(10).optional(),

    email: z.string().email().optional(),

    city: z.string().min(2).optional(),

    county: z.string().min(2).optional(),

    town: z.string().min(2).optional(),

    contactPerson: z.string().min(2).optional(),

    logo: z.string().url().optional(),

    description: z.string().optional(),

    coverImage: z.string().url().optional(),

    businessEmail: z.string().email().optional(),

    facebook: z.string().url().optional(),

    instagram: z.string().url().optional(),

    tiktok: z.string().url().optional(),

    website: z.string().url().optional(),
  }),
});

export type CreateVendorInput = z.infer<typeof createVendorSchema>;
export type UpdateVendorInput = z.infer<typeof updateVendorSchema>;

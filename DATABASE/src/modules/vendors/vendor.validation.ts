import { z } from "zod";

// Accepts a valid URL OR an empty string (so optional fields don't 400 when blank)
const optionalUrl = z.string().url().or(z.literal("")).optional();

// Website is display-only — accept any non-empty string or omit it
const optionalWebsite = z.string().optional();

export const createVendorSchema = z.object({
  body: z.object({
    userId: z.string().cuid().optional(),
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

    logo: optionalUrl,

    description: z.string().optional(),

    coverImage: optionalUrl,


    facebook: optionalUrl,

    instagram: optionalUrl,

    tiktok: optionalUrl,

    website: optionalWebsite,
  }),
});

export const updateVendorSchema = z.object({
  body: z.object({
    businessName: z.string().min(3).optional(),

    whatsappNumber: z.string().min(10).optional(),

    address: z.string().min(5).optional(),

    location: z.string().min(2).optional(),

    phoneNumber: z.string().min(10).optional(),

    email: z.string().email().or(z.literal("")).optional(),

    city: z.string().min(2).optional(),

    county: z.string().min(2).optional(),

    town: z.string().min(2).optional(),

    contactPerson: z.string().min(2).optional(),

    logo: optionalUrl,

    description: z.string().optional(),

    coverImage: optionalUrl,


    facebook: optionalUrl,

    instagram: optionalUrl,

    tiktok: optionalUrl,

    website: optionalWebsite,
  }),
});

export type CreateVendorInput = z.infer<typeof createVendorSchema>;
export type UpdateVendorInput = z.infer<typeof updateVendorSchema>;

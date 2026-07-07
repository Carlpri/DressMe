import { z } from "zod";

export const createVendorSchema = z.object({
  body: z.object({
    shopName: z.string().min(3),

    phone: z.string().min(10),

    address: z.string().min(5),

    location: z.string().min(2),

    logo: z.string().url().optional(),

    description: z.string().optional(),
  }),
});

export const updateVendorSchema = z.object({
  body: z.object({
    shopName: z.string().min(3).optional(),

    phone: z.string().min(10).optional(),

    address: z.string().min(5).optional(),

    location: z.string().min(2).optional(),

    logo: z.string().url().optional(),

    description: z.string().optional(),
  }),
});

export type CreateVendorInput = z.infer<typeof createVendorSchema>;
export type UpdateVendorInput = z.infer<typeof updateVendorSchema>;
import { z } from "zod";

export const createBrandSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Brand name must be at least 2 characters"),

    logo: z
      .string()
      .url("Logo must be a valid URL")
      .optional(),

    website: z
      .string()
      .url("Website must be a valid URL")
      .optional(),

    description: z
      .string()
      .trim()
      .max(500)
      .optional(),
  }),
});

export const updateBrandSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2)
      .optional(),

    logo: z
      .string()
      .url()
      .optional(),

    website: z
      .string()
      .url()
      .optional(),

    description: z
      .string()
      .trim()
      .max(500)
      .optional(),
  }),
});

export type CreateBrandInput = z.infer<typeof createBrandSchema>;
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>;

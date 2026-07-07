import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters.")
    .max(50, "Category name cannot exceed 50 characters."),
});

export const updateCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(50)
    .optional(),
});
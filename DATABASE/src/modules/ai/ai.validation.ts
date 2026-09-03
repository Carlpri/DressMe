import { Gender } from "@prisma/client";
import { z } from "zod";

export const testAISchema = z.object({
  body: z.object({
    prompt: z
      .string()
      .trim()
      .min(1, "Prompt must not be empty.")
      .max(500, "Prompt must be 500 characters or fewer."),
  }),
});

export type TestAIInput = z.infer<typeof testAISchema>["body"];

export const aiStylistSchema = z.object({
  body: z
    .object({
      style: z.string().trim().max(50, "Style must be 50 characters or fewer.").optional(),
      occasion: z.string().trim().max(50, "Occasion must be 50 characters or fewer.").optional(),
      season: z.string().trim().max(50, "Season must be 50 characters or fewer.").optional(),
      preferences: z.string().trim().max(500, "Preferences must be 500 characters or fewer.").optional(),
      gender: z.enum(Gender).optional(),
      priceMin: z.number().min(0, "priceMin cannot be negative.").max(10000000, "priceMin is too large.").optional(),
      priceMax: z.number().min(0, "priceMax cannot be negative.").max(10000000, "priceMax is too large.").optional(),
    })
    .strict()
    .refine(
      (data) => {
        if (data.priceMin !== undefined && data.priceMax !== undefined) {
          return data.priceMin <= data.priceMax;
        }
        return true;
      },
      {
        message: "priceMin must not exceed priceMax.",
        path: ["priceMin"],
      }
    )
    .refine(
      (data) =>
        Boolean(
          data.style ||
          data.occasion ||
          data.season ||
          data.preferences ||
          data.gender ||
          data.priceMin !== undefined ||
          data.priceMax !== undefined
        ),
      {
        message: "At least one styling parameter or preference must be provided.",
      }
    ),
});

export type AIStylistInput = z.infer<typeof aiStylistSchema>["body"];

export const aiSearchSchema = z.object({
  body: z
    .object({
      query: z
        .string()
        .trim()
        .min(1, "Search query must not be empty.")
        .max(200, "Search query must be 200 characters or fewer."),
    })
    .strict(),
});

export type AISearchInput = z.infer<typeof aiSearchSchema>["body"];

export const analyzeProductSchema = z.object({
  body: z
    .object({
      imageUrls: z
        .array(
          z
            .string()
            .min(1, "Each image URL must not be empty.")
            .max(5000, "Image URL is too long.")
        )
        .min(1, "At least one image URL is required.")
        .max(5, "Maximum 5 images allowed per analysis."),
    })
    .strict(),
});

export type AnalyzeProductInput = z.infer<typeof analyzeProductSchema>["body"];

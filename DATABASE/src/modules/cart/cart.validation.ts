import { z } from "zod";

export const addCartItemSchema = z.object({
  body: z.object({
    productId: z.string().min(1),
    variantId: z.string().min(1).optional(),
    quantity: z.number().int().min(1),
  }),
});

export const updateCartItemSchema = z.object({
  params: z.object({
    itemId: z.string().min(1),
  }),
  body: z.object({
    quantity: z.number().int().min(1),
  }),
});

export const cartItemParamSchema = z.object({
  params: z.object({
    itemId: z.string().min(1),
  }),
});

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import type { Product } from "../types/product";

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    vendorId?: string;
    vendor?: {
      id: string;
      businessName: string;
      whatsappNumber: string;
    };
    images: Array<{ imageUrl: string; isPrimary: boolean }>;
    variants?: Array<{ id: string; sizeValue: string; colorValue: string; price?: number; stock?: number }>;
  };
  variant?: {
    id: string;
    sizeValue: string;
    colorValue: string;
    price?: number;
  };
}

export interface Cart {
  id: string;
  items: CartItem[];
}

const GUEST_CART_KEY = "dressme_guest_cart";

function getGuestCart(): Cart {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    if (!raw) return { id: "guest-cart", items: [] };
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.items)) return parsed;
    return { id: "guest-cart", items: [] };
  } catch {
    return { id: "guest-cart", items: [] };
  }
}

function saveGuestCart(cart: Cart) {
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
  } catch (e) {
    console.error("Failed to save guest cart", e);
  }
}

function isUserAuthenticated(): boolean {
  try {
    return Boolean(localStorage.getItem("dressme-studio.session"));
  } catch {
    return false;
  }
}

export function useCart() {
  const isAuth = isUserAuthenticated();

  return useQuery({
    queryKey: ["cart"],
    queryFn: async (): Promise<Cart> => {
      if (isAuth) {
        try {
          const response = await apiClient.get<{ data: Cart }>("/cart");
          return response.data.data;
        } catch (err) {
          // If backend returns error, fallback to guest cart or empty cart
          const guestCart = getGuestCart();
          if (guestCart.items.length > 0) return guestCart;
          return { id: "user-cart", items: [] };
        }
      } else {
        return getGuestCart();
      }
    },
  });
}

export interface AddToCartPayload {
  productId: string;
  variantId?: string;
  quantity: number;
  product?: Product | CartItem["product"];
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, variantId, quantity, product }: AddToCartPayload) => {
      const isAuth = isUserAuthenticated();

      // Determine variantId if missing
      let resolvedVariantId = variantId;
      if (!resolvedVariantId && product?.variants && product.variants.length > 0) {
        const inStock = product.variants.find((v: any) => (v.stock ?? 0) > 0) || product.variants[0];
        resolvedVariantId = inStock?.id;
      }

      if (isAuth) {
        try {
          await apiClient.post("/cart/items", {
            productId,
            variantId: resolvedVariantId,
            quantity,
          });
          return;
        } catch (err) {
          // Fallback to guest cart if API call fails
          console.warn("Failed to add to backend cart, saving locally:", err);
        }
      }

      // Guest cart / offline storage
      const cart = getGuestCart();
      const existingIndex = cart.items.findIndex(
        (i) => i.productId === productId && (resolvedVariantId ? i.variantId === resolvedVariantId : true)
      );

      const targetVariant = product?.variants?.find((v: any) => v.id === resolvedVariantId);

      if (existingIndex >= 0) {
        cart.items[existingIndex].quantity += quantity;
      } else {
        const newItem: CartItem = {
          id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          productId,
          variantId: resolvedVariantId,
          quantity,
          product: {
            id: product?.id || productId,
            name: product?.name || "Fashion Product",
            slug: (product as any)?.slug || productId,
            price: targetVariant?.price || product?.price || 0,
            vendorId: (product as any)?.vendor?.id,
            vendor: (product as any)?.vendor
              ? {
                  id: (product as any).vendor.id,
                  businessName: (product as any).vendor.businessName || "DressMe Store",
                  whatsappNumber: (product as any).vendor.whatsappNumber || "254700000000",
                }
              : undefined,
            images: (product?.images || []).map((img: any) => ({
              imageUrl: img.imageUrl,
              isPrimary: img.isPrimary ?? false,
            })),
            variants: product?.variants,
          },
          variant: targetVariant
            ? {
                id: targetVariant.id,
                sizeValue: targetVariant.sizeValue,
                colorValue: targetVariant.colorValue,
                price: targetVariant.price,
              }
            : undefined,
        };
        cart.items.push(newItem);
      }

      saveGuestCart(cart);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      const isAuth = isUserAuthenticated();

      if (isAuth && !itemId.startsWith("item_")) {
        try {
          await apiClient.patch(`/cart/items/${itemId}`, { quantity });
          return;
        } catch (err) {
          console.warn("Backend update cart item failed, falling back to local:", err);
        }
      }

      const cart = getGuestCart();
      const item = cart.items.find((i) => i.id === itemId);
      if (item) {
        item.quantity = quantity;
        saveGuestCart(cart);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      const isAuth = isUserAuthenticated();

      if (isAuth && !itemId.startsWith("item_")) {
        try {
          await apiClient.delete(`/cart/items/${itemId}`);
          return;
        } catch (err) {
          console.warn("Backend remove cart item failed, falling back to local:", err);
        }
      }

      const cart = getGuestCart();
      cart.items = cart.items.filter((i) => i.id !== itemId);
      saveGuestCart(cart);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

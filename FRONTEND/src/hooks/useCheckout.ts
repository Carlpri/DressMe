import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";

export interface CheckoutRequest {
  addressId: string;
  paymentMethod: string;
}

export interface OrderResponse {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  items: Array<{
    id: string;
    productId: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      slug: string;
      images: Array<{ imageUrl: string; isPrimary: boolean }>;
    };
  }>;
  shippingAddress: {
    street: string;
    city: string;
    country: string;
    postalCode: string;
  };
  createdAt: string;
}

export function useCheckout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CheckoutRequest) => {
      const response = await apiClient.post<{ data: OrderResponse }>("/orders", data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

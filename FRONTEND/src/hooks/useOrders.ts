import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";

export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string | null;
  productName: string;
  productImage: string;
  variantName?: string | null;
  price: number;
  quantity: number;
  subtotal: number;
  product?: {
    id: string;
    name: string;
    slug?: string;
    images: Array<{ imageUrl: string; isPrimary: boolean }>;
  };
}

export interface OrderAddress {
  id: string;
  fullName: string;
  phone: string;
  county: string;
  city: string;
  area: string;
  street: string;
  building?: string | null;
  postalCode?: string | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
  items: OrderItem[];
  address: OrderAddress;
  createdAt: string;
  updatedAt: string;
}

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await apiClient.get<{ data: Order[] }>("/orders/my");
      return response.data.data;
    },
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const response = await apiClient.get<{ data: Order }>(`/orders/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { addressId: string; notes?: string }) => {
      const response = await apiClient.post<{ data: Order }>("/orders", data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.patch<{ data: Order }>(`/orders/${id}/cancel`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

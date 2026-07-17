import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  county: string;
  city: string;
  area: string;
  street: string;
  building?: string | null;
  postalCode?: string | null;
  landmark?: string | null;
  label?: string | null;
  isDefault: boolean;
}

export interface AddressInput {
  fullName: string;
  phone: string;
  county: string;
  city: string;
  area: string;
  street: string;
  building?: string;
  postalCode?: string;
  landmark?: string;
  label?: string;
  isDefault?: boolean;
}

export function useAddresses() {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const response = await apiClient.get<{ data: Address[] }>("/addresses");
      return response.data.data;
    },
  });
}

export function useAddAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (address: AddressInput) => {
      await apiClient.post("/addresses", address);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, address }: { id: string; address: Partial<AddressInput> }) => {
      await apiClient.patch(`/addresses/${id}`, address);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/addresses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.patch(`/addresses/${id}/default`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
}

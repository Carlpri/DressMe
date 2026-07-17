import { apiClient } from "../api/client";
import type { Vendor } from "../types/vendor";

export const vendorService = {
  getVendors: async () => {
    const response = await apiClient.get<{ data: Vendor[] }>("/vendors");
    return response.data.data;
  },

  getVendor: async (id: string) => {
    const response = await apiClient.get<{ data: Vendor }>(`/vendors/${id}`);
    return response.data.data;
  },
};

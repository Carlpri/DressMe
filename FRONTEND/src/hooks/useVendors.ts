import { useQuery } from "@tanstack/react-query";
import { vendorService } from "../services/vendor.service";

export function useVendors() {
  return useQuery({
    queryKey: ["vendors"],
    queryFn: () => vendorService.getVendors(),
  });
}

export function useVendor(id: string) {
  return useQuery({
    queryKey: ["vendor", id],
    queryFn: () => vendorService.getVendor(id),
    enabled: !!id,
  });
}

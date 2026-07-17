import { useQuery } from "@tanstack/react-query";
import { brandService } from "../services/brand.service";

export function useBrands() {
  return useQuery({
    queryKey: ["brands"],
    queryFn: () => brandService.getBrands(),
  });
}

export function useBrand(slug: string) {
  return useQuery({
    queryKey: ["brand", slug],
    queryFn: () => brandService.getBrand(slug),
    enabled: !!slug,
  });
}

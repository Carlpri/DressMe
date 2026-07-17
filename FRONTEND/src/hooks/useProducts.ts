import { useQuery } from "@tanstack/react-query";
import { productService } from "../services/product.service";
import type { ProductFilters } from "../types/product";

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => productService.getProducts(filters),
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => productService.getProduct(slug),
    enabled: !!slug,
  });
}

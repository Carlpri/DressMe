import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../services/category.service";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getCategories(),
  });
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: ["category", slug],
    queryFn: () => categoryService.getCategory(slug),
    enabled: !!slug,
  });
}

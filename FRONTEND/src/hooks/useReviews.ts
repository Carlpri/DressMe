import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  product: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export function useReviews(productId: string) {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      const response = await apiClient.get<{ data: Review[] }>(`/reviews/products/${productId}`);
      return response.data.data;
    },
    enabled: !!productId,
  });
}

export function useAddReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, rating, comment }: { productId: string; rating: number; comment?: string }) => {
      await apiClient.post("/reviews", { productId, rating, comment });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

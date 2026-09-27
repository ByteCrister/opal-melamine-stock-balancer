import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/utils/axios";
import { StockBalancerResponse } from "@/types/stock-balancer.types";

interface UseStockBalancerOptions {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  classCode?: string;
  material?: string;
}

export function useStockBalancer({
  page,
  limit,
  search,
  category,
  classCode,
  material,
}: UseStockBalancerOptions) {
  return useQuery({
    queryKey: ["stock-balancer", page, limit, search, category, classCode, material],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (search) params.append("search", search);
      if (category) params.append("category", category);
      if (classCode) params.append("classCode", classCode);
      if (material) params.append("material", material);

      const response = await apiClient.get<{ data: StockBalancerResponse }>(
        `/v1/stock-balancer?${params.toString()}`
      );
      return response.data.data;
    },
  });
}

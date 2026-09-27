import { useQuery } from "@tanstack/react-query";
import { apiClient, getApiError } from "@/utils/axios";
import { StockMovement, StockMovementsResponse, StockMovementFilters } from "@/types/stock-movements.types";
import { StockMovementType } from "@/const/stock.const";

export function useStockMovements(type: StockMovementType, filters: StockMovementFilters) {
  // Map IN to stock-in and OUT to stock-out for the API endpoint
  const endpoint = type === "IN" ? "/v1/stock-in" : "/v1/stock-out";

  return useQuery({
    queryKey: ["stock-movements", type, filters],
    queryFn: async (): Promise<StockMovementsResponse> => {
      try {
        const params = new URLSearchParams();
        if (filters.page) params.append("page", filters.page.toString());
        if (filters.limit) params.append("limit", filters.limit.toString());
        if (filters.search) params.append("search", filters.search);
        if (filters.sort) params.append("sort", filters.sort);
        if (filters.sortBy) params.append("sortBy", filters.sortBy);

        const response = await apiClient.get<{ data: StockMovementsResponse }>(`${endpoint}?${params.toString()}`);
        return response.data.data;
      } catch (error) {
        throw new Error(getApiError(error));
      }
    },
  });
}

export function useStockMovement(type: StockMovementType, id: string) {
  const endpoint = type === "IN" ? "/v1/stock-in" : "/v1/stock-out";

  return useQuery({
    queryKey: ["stock-movement", type, id],
    queryFn: async (): Promise<StockMovement> => {
      try {
        const response = await apiClient.get<{ data: { movement: StockMovement } }>(`${endpoint}/${id}`);
        return response.data.data.movement;
      } catch (error) {
        throw new Error(getApiError(error));
      }
    },
    enabled: !!id,
  });
}

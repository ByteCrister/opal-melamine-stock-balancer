import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, getApiError } from "@/utils/axios";
import { StockMovement } from "@/types/stock-movements.types";
import { CreateStockMovementFormValues, UpdateStockMovementFormValues } from "@/utils/zod/stock-movement.schema";
import { StockMovementType } from "@/const/stock.const";

export function useCreateStockMovement(type: StockMovementType) {
  const queryClient = useQueryClient();
  const endpoint = type === "IN" ? "/v1/stock-in" : "/v1/stock-out";

  return useMutation({
    mutationFn: async (payload: CreateStockMovementFormValues) => {
      try {
        const response = await apiClient.post<{ data: { success: boolean; message: string; movement: StockMovement } }>(endpoint, payload);
        return response.data.data;
      } catch (error) {
        throw new Error(getApiError(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-movements", type] });
      queryClient.invalidateQueries({ queryKey: ["stock-balancer"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateStockMovement(type: StockMovementType) {
  const queryClient = useQueryClient();
  const endpoint = type === "IN" ? "/v1/stock-in" : "/v1/stock-out";

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateStockMovementFormValues }) => {
      try {
        const response = await apiClient.put<{ data: { success: boolean; message: string; movement: StockMovement } }>(`${endpoint}/${id}`, payload);
        return response.data.data;
      } catch (error) {
        throw new Error(getApiError(error));
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["stock-movements", type] });
      queryClient.invalidateQueries({ queryKey: ["stock-movement", type, variables.id] });
      queryClient.invalidateQueries({ queryKey: ["stock-balancer"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDeleteStockMovement(type: StockMovementType) {
  const queryClient = useQueryClient();
  const endpoint = type === "IN" ? "/v1/stock-in" : "/v1/stock-out";

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await apiClient.delete<{ data: { success: boolean; message: string } }>(`${endpoint}/${id}`);
        return response.data.data;
      } catch (error) {
        throw new Error(getApiError(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-movements", type] });
      queryClient.invalidateQueries({ queryKey: ["stock-balancer"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

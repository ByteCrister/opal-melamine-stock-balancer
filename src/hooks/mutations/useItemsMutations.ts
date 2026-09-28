
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, getApiError } from "@/utils/axios";
import { Item } from "@/types/item.types";
import { CreateItemFormValues, UpdateItemFormValues } from "@/utils/zod/item.schema";

const API_URL = "/v1/items";

export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateItemFormValues) => {
      try {
        const response = await apiClient.post<{ data: { success: boolean; message: string; item: Item } }>(API_URL, payload);
        return response.data.data;
      } catch (error) {
        throw new Error(getApiError(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["active-items"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateItemFormValues }) => {
      try {
        const response = await apiClient.put<{ data: { success: boolean; message: string; item: Item } }>(`${API_URL}/${id}`, payload);
        return response.data.data;
      } catch (error) {
        throw new Error(getApiError(error));
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["active-items"] });
      queryClient.invalidateQueries({ queryKey: ["item", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await apiClient.delete<{ data: { success: boolean; message: string } }>(`${API_URL}/${id}`);
        return response.data.data;
      } catch (error) {
        throw new Error(getApiError(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["active-items"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

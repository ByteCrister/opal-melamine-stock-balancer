import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, getApiError } from "@/utils/axios";
import { DROPDOWN_QUERY_KEYS } from "@/const/dropdown.const";
import {
  AddDropdownPayload,
  UpdateDropdownPayload,
  DeleteDropdownPayload,
} from "@/types/dropdown.types";
import { toast } from "sonner";

export function useAddDropdownItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AddDropdownPayload) => {
      try {
        const response = await apiClient.post("/v1/dropdowns", payload);
        return response.data;
      } catch (error) {
        throw new Error(getApiError(error));
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: DROPDOWN_QUERY_KEYS.all });
      toast.success(`Successfully added to ${variables.type}`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add item");
    },
  });
}

export function useUpdateDropdownItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateDropdownPayload) => {
      try {
        const response = await apiClient.put("/v1/dropdowns", payload);
        return response.data;
      } catch (error) {
        throw new Error(getApiError(error));
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: DROPDOWN_QUERY_KEYS.all });
      toast.success(`Successfully updated ${variables.type} item`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update item");
    },
  });
}

export function useDeleteDropdownItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: DeleteDropdownPayload) => {
      try {
        const response = await apiClient.delete("/v1/dropdowns", {
          data: payload,
        });
        return response.data;
      } catch (error) {
        throw new Error(getApiError(error));
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: DROPDOWN_QUERY_KEYS.all });
      toast.success(`Successfully deleted from ${variables.type}`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete item");
    },
  });
}

import { useQuery } from "@tanstack/react-query";
import { apiClient, getApiError } from "@/utils/axios";
import { Item, ItemsResponse, ItemFilters } from "@/types/item.types";

const API_URL = "/v1/items";

export function useItems(filters: ItemFilters) {
  return useQuery({
    queryKey: ["items", filters],
    queryFn: async (): Promise<ItemsResponse> => {
      try {
        const params = new URLSearchParams();
        if (filters.page) params.append("page", filters.page.toString());
        if (filters.limit) params.append("limit", filters.limit.toString());
        if (filters.search) params.append("search", filters.search);
        if (filters.category) params.append("category", filters.category);
        if (filters.classCode) params.append("classCode", filters.classCode);
        if (filters.material) params.append("material", filters.material);
        if (filters.sort) params.append("sort", filters.sort);
        if (filters.sortBy) params.append("sortBy", filters.sortBy);

        const response = await apiClient.get<{ data: ItemsResponse }>(`${API_URL}?${params.toString()}`);
        return response.data.data;
      } catch (error) {
        throw new Error(getApiError(error));
      }
    },
  });
}

export function useItem(id: string) {
  return useQuery({
    queryKey: ["item", id],
    queryFn: async (): Promise<Item> => {
      try {
        const response = await apiClient.get<{ data: { item: Item } }>(`${API_URL}/${id}`);
        return response.data.data.item;
      } catch (error) {
        throw new Error(getApiError(error));
      }
    },
    enabled: !!id,
  });
}

export interface ActiveItemOption {
  _id: string;
  itemCode: string;
  itemName: string;
  unit: string;
}

export function useActiveItemsOptions() {
  return useQuery({
    queryKey: ["active-items"],
    queryFn: async (): Promise<ActiveItemOption[]> => {
      try {
        const response = await apiClient.get<{ data: { items: ActiveItemOption[] } }>(`${API_URL}/active-options`);
        return response.data.data.items;
      } catch (error) {
        throw new Error(getApiError(error));
      }
    },
  });
}

import { useQuery } from "@tanstack/react-query";
import { apiClient, getApiError } from "@/utils/axios";
import { DROPDOWN_QUERY_KEYS } from "@/const/dropdown.const";
import { DropdownList } from "@/types/dropdown.types";

export function useDropdowns() {
  return useQuery<DropdownList, Error>({
    queryKey: DROPDOWN_QUERY_KEYS.all,
    queryFn: async () => {
      try {
        const response = await apiClient.get<{ data: DropdownList }>("/v1/dropdowns");
        return response.data.data;
      } catch (error) {
        throw new Error(getApiError(error));
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

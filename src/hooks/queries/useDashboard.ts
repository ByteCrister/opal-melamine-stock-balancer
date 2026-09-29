// src/hooks/queries/useDashboard.ts
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { DashboardData, DashboardQueryParams } from "@/types/dashboard.types";
import { format } from "date-fns";

/** Fetch the dashboard data from the API */
async function fetchDashboard(params: DashboardQueryParams): Promise<DashboardData> {
  const query = new URLSearchParams({
    from: params.from,
    to: params.to,
    ...(params.isInitialCall ? { isInitialCall: "true" } : {}),
  });

  const res = await fetch(`/api/v1/dashboard?${query.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error((err as { error?: string }).error ?? `HTTP ${res.status}`);
  }

  const json = (await res.json()) as { data: DashboardData } | { error: string };
  if ("error" in json) throw new Error(json.error);
  return json.data;
}

/**
 * React Query hook for the dashboard data.
 *
 * @param from  - Start date of the filter
 * @param to    - End date of the filter
 * @param isInitialCall - If true, backend will fallback to all-time data when empty
 */
export function useDashboard(from: Date, to: Date, isInitialCall = false) {
  const fromStr = format(from, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
  const toStr   = format(to, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");

  return useQuery<DashboardData, Error>({
    queryKey: ["dashboard", fromStr, toStr, isInitialCall],
    queryFn: () =>
      fetchDashboard({ from: fromStr, to: toStr, isInitialCall }),
    staleTime: 1000 * 60 * 2, // 2 min
    gcTime: 1000 * 60 * 10,
    retry: 2,
    enabled: from <= to, // Guard: only fetch when dates are valid
    placeholderData: keepPreviousData,
  });
}

import { create } from "zustand";
import { apiClient, getApiError } from "@/utils/axios";
import { User, AuditLog, PaginatedResponse } from "@/types";

interface AuditFetchParams {
    page?: number;
    limit?: number;
    search?: string;
    sort?: "asc" | "desc";
    sortBy?: string;
}

interface UserStoreState {
    user: User | null;
    isLoadingUser: boolean;
    userError: string | null;

    audits: AuditLog[];
    auditMeta: PaginatedResponse<AuditLog>["data"]["meta"] | null;
    isLoadingAudits: boolean;
    auditError: string | null;

    // Actions
    fetchUser: () => Promise<void>;
    updateUserName: (name: string) => Promise<void>;
    fetchAudits: (params?: AuditFetchParams) => Promise<void>;
}

export const useUserStore = create<UserStoreState>((set) => ({
    user: null,
    isLoadingUser: false,
    userError: null,

    audits: [],
    auditMeta: null,
    isLoadingAudits: false,
    auditError: null,

    fetchUser: async () => {
        set({ isLoadingUser: true, userError: null });
        try {
            const res = await apiClient.get<{ data: User }>("/v1/users/me");
            set({ user: res.data.data, isLoadingUser: false });
        } catch (error) {
            set({ userError: getApiError(error), isLoadingUser: false });
        }
    },

    updateUserName: async (name: string) => {
        set({ userError: null });
        try {
            const res = await apiClient.patch<{ data: User }>("/v1/users/me", { name });
            set({ user: res.data.data });
        } catch (error) {
            set({ userError: getApiError(error) });
            throw error; // Let caller handle throw if they want to show a toast
        }
    },

    fetchAudits: async (params = {}) => {
        set({ isLoadingAudits: true, auditError: null });
        try {
            const res = await apiClient.get<PaginatedResponse<AuditLog>>("/v1/audits", {
                params,
            });
            set({
                audits: res.data.data.items,
                auditMeta: res.data.data.meta,
                isLoadingAudits: false,
            });
        } catch (error) {
            set({ auditError: getApiError(error), isLoadingAudits: false });
        }
    },
}));

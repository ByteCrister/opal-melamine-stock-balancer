import { create } from "zustand";
import { toast } from "sonner";
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
    clearAuditCache: () => void;
}

// --- Audit Caching ---
const AUDIT_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface AuditCacheEntry {
    items: AuditLog[];
    meta: PaginatedResponse<AuditLog>["data"]["meta"];
    timestamp: number;
}

const auditCache: Record<string, AuditCacheEntry | undefined> = {};
const auditInFlight: Record<string, Promise<void> | undefined> = {};
let currentAuditCacheKey: string | null = null;

function getAuditCacheKey(params: AuditFetchParams) {
    return JSON.stringify({
        page: params.page ?? 1,
        limit: params.limit ?? 20,
        search: params.search ?? "",
        sort: params.sort ?? "desc",
        sortBy: params.sortBy ?? "createdAt",
    });
}
// ---------------------

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
            toast.success("Profile updated successfully!");
        } catch (error) {
            const errorMsg = getApiError(error);
            set({ userError: errorMsg });
            toast.error(errorMsg || "Failed to update profile");
            throw error; // Let caller handle throw if they want to show a toast
        }
    },

    fetchAudits: async (params = {}) => {
        const cacheKey = getAuditCacheKey(params);
        currentAuditCacheKey = cacheKey;
        
        const cached = auditCache[cacheKey];
        if (cached && Date.now() - cached.timestamp < AUDIT_CACHE_TTL) {
            set({
                audits: cached.items,
                auditMeta: cached.meta,
                isLoadingAudits: false,
                auditError: null,
            });
            return;
        }

        if (cacheKey in auditInFlight) {
            set({ isLoadingAudits: true, auditError: null });
            await auditInFlight[cacheKey];
            return;
        }

        set({ isLoadingAudits: true, auditError: null });

        const fetchPromise = (async () => {
            try {
                const res = await apiClient.get<PaginatedResponse<AuditLog>>("/v1/audits", {
                    params,
                });
                
                const items = res.data.data.items;
                const meta = res.data.data.meta;

                auditCache[cacheKey] = {
                    items,
                    meta,
                    timestamp: Date.now(),
                };

                if (currentAuditCacheKey === cacheKey) {
                    set({
                        audits: items,
                        auditMeta: meta,
                        isLoadingAudits: false,
                    });
                }
            } catch (error) {
                if (currentAuditCacheKey === cacheKey) {
                    set({ auditError: getApiError(error), isLoadingAudits: false });
                }
            } finally {
                delete auditInFlight[cacheKey];
            }
        })();

        auditInFlight[cacheKey] = fetchPromise;
        await fetchPromise;
    },

    clearAuditCache: () => {
        for (const key of Object.keys(auditCache)) {
            delete auditCache[key];
        }
    },
}));

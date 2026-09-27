import axios, { AxiosError } from "axios";

/**
 * Pre-configured Axios instance for internal API calls
 */
export const apiClient = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

/**
 * Extracts a readable error message from an Axios error object
 */
export function getApiError(error: unknown): string {
    if (axios.isAxiosError(error)) {
        const axError = error as AxiosError<{ error?: string }>;
        return axError.response?.data?.error || axError.message || "An unexpected API error occurred.";
    }
    if (error instanceof Error) {
        return error.message;
    }
    return String(error) || "An unexpected error occurred.";
}

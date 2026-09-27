/**
 * @file src/lib/auth/getUserId.ts
 *
 * Helper function to retrieve the authenticated user's ID from the session.
 * Intended for use in Next.js App Router API endpoints (Server Actions / Route Handlers).
 *
 * Throws an ApiError (handled by withErrorHandler) if the session is missing
 * or the user ID is not found.
 */

import { auth } from "@/lib/auth/auth";
import { ApiError } from "@/lib/helpers/withErrorHandler";

/**
 * Retrieves the currently authenticated user's ID.
 *
 * @returns The user's ID as a string.
 * @throws {ApiError} (401) If the user is not authenticated or ID is missing.
 */
export async function getUserId(): Promise<string> {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
        throw new ApiError("Unauthorized. Please sign in to continue.", 401);
    }

    return session.user.id;
}

/**
 * @file src/app/api/auth/[...nextauth]/route.ts
 *
 * NextAuth v5 catch-all route handler.
 * Exports GET and POST handlers from the auth config.
 */

import { handlers } from "@/lib/auth/auth";

export const { GET, POST } = handlers;

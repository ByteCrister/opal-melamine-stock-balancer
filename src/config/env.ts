/**
 * @file src/config/env.ts
 *
 * Validated, typed environment configuration.
 *
 * Uses Zod to parse `process.env` at module-load time so any missing or
 * malformed variable throws immediately with a clear, human-readable error
 * — not silently at runtime deep inside business logic.
 *
 * Variables are sourced from `.env.local` (dev) or the deployment environment.
 * Never import `process.env` directly anywhere else; always use `env` from here.
 */

import { z, ZodIssue } from "zod";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const envSchema = z.object({

    // ── App ──────────────────────────────────────────────────────────────────

    // ── Database ─────────────────────────────────────────────────────────────

    /** MongoDB Atlas / local connection string */
    MONGODB_URI: z
        .string()
        .min(1, "MONGODB_URI is required")
        .refine(
            (v) => v.startsWith("mongodb://") || v.startsWith("mongodb+srv://"),
            "MONGODB_URI must start with mongodb:// or mongodb+srv://"
        ),

    // ── Auth ─────────────────────────────────────────────────────────────────

    /** NextAuth / Auth.js base URL */
    AUTH_URL: z
        .string()
        .url("AUTH_URL must be a valid URL")
        .default("http://localhost:3000"),

    /** NextAuth / Auth.js signing secret — min 32 chars recommended */
    AUTH_SECRET: z
        .string()
        .min(32, "AUTH_SECRET must be at least 32 characters"),

    /** JWT signing secret for custom tokens */
    JWT_SECRET: z
        .string()
        .min(20, "JWT_SECRET must be at least 20 characters"),

    /**
     * Server-side token used to verify internal Next.js API requests.
     * Must match the token sent in x-next-token / Authorization headers.
     */
    NEXT_TOKEN: z
        .string()
        .min(1, "NEXT_TOKEN is required"),

    // ── Google OAuth ─────────────────────────────────────────────────────────

    GOOGLE_CLIENT_ID: z
        .string()
        .min(1, "GOOGLE_CLIENT_ID is required"),

    GOOGLE_CLIENT_SECRET: z
        .string()
        .min(1, "GOOGLE_CLIENT_SECRET is required"),

    // ── Redis (Upstash) ───────────────────────────────────────────────────────

    UPSTASH_REDIS_REST_URL: z
        .string()
        .url("UPSTASH_REDIS_REST_URL must be a valid URL"),

    UPSTASH_REDIS_REST_TOKEN: z
        .string()
        .min(1, "UPSTASH_REDIS_REST_TOKEN is required"),

    // ── SMTP / Mailer ─────────────────────────────────────────────────────────

    /** Gmail address (or any SMTP username) used as the sender */
    SMTP_USER: z
        .string()
        .email("SMTP_USER must be a valid email address"),

    /** App password (Gmail) or SMTP account password */
    SMTP_PASSWORD: z
        .string()
        .min(1, "SMTP_PASSWORD is required"),

});

// ---------------------------------------------------------------------------
// Parse
// ---------------------------------------------------------------------------

const _parsed = envSchema.safeParse(process.env);

if (!_parsed.success) {
    const formatted = _parsed.error.issues
        .map((e: ZodIssue) => `  • [${e.path.join(".")}] ${e.message}`)
        .join("\n");

    throw new Error(
        `\n\n❌ Invalid environment variables:\n${formatted}\n\n` +
        `Check your .env.local file and ensure all required variables are set.\n`
    );
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

/** Validated, typed environment object. Use this everywhere instead of process.env. */
export const env = _parsed.data;

/** Inferred type of the env object — useful for function signatures. */
export type Env = typeof env;

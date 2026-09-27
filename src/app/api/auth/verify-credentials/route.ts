/**
 * @file src/app/api/auth/verify-credentials/route.ts
 *
 * POST /api/auth/verify-credentials
 *
 * Pre-verification step called by the sign-in page BEFORE invoking
 * NextAuth's signIn() with credentials. This separation means:
 *   1. Raw password validation + bcrypt comparison happens here, not inside
 *      the NextAuth authorize() callback.
 *   2. Rate-limiting and cooldown logic can be applied per email/IP.
 *   3. The NextAuth callback only receives a pre-verified user id — no
 *      password ever flows through the NextAuth layer.
 *
 * On success → returns { userId } which the client passes to NextAuth's
 * signIn("credentials", { verifiedUserId }) call.
 *
 * Rate limiting:
 *   - 5 attempts per IP per 60 seconds  (rateLimit)
 *   - 10-second cooldown per email after each failed attempt (setCooldown)
 */

import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";

import ConnectDB from "@/config/db";
import UserModel from "@/models/user.model";
import { ApiError, withErrorHandler } from "@/lib/helpers/withErrorHandler";
import { rateLimit, isInCooldown, setCooldown } from "@/lib/services/redis.service";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Failed-attempt cooldown window (seconds) applied per email */
const FAILED_ATTEMPT_COOLDOWN_S = 10;

/** Rate-limit window (seconds) applied per IP */
const RATE_LIMIT_WINDOW_S = 60;

/** Max credential attempts per IP within the window */
const RATE_LIMIT_MAX = 5;

// ---------------------------------------------------------------------------
// Input validation
// ---------------------------------------------------------------------------

interface VerifyBody {
    email:    string;
    password: string;
}

function parseBody(body: unknown): VerifyBody {
    if (!body || typeof body !== "object") {
        throw new ApiError("Request body must be a JSON object.", 400);
    }

    const { email, password } = body as Record<string, unknown>;

    if (!email || typeof email !== "string" || !email.includes("@")) {
        throw new ApiError("A valid email address is required.", 400);
    }
    if (!password || typeof password !== "string" || password.length < 1) {
        throw new ApiError("Password is required.", 400);
    }

    return {
        email:    email.trim().toLowerCase(),
        password: password as string,
    };
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export const POST = withErrorHandler(async (req: NextRequest) => {
    // 1. Get client IP for rate-limiting
    const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        req.headers.get("x-real-ip") ??
        "unknown";

    // 2. Rate limit by IP — max 5 attempts / 60 s
    const allowed = await rateLimit(`signin:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_S);
    if (!allowed) {
        throw new ApiError(
            "Too many sign-in attempts. Please wait a moment and try again.",
            429
        );
    }

    // 3. Parse body
    let body: unknown;
    try {
        body = await req.json();
    } catch {
        throw new ApiError("Invalid JSON in request body.", 400);
    }

    const { email, password } = parseBody(body);

    // 4. Check cooldown per email (applied after each failed attempt)
    const coolingDown = await isInCooldown("signin_fail", email);
    if (coolingDown) {
        throw new ApiError(
            "Too many failed attempts for this account. Please wait a moment.",
            429
        );
    }

    // 5. Look up user
    await ConnectDB();
    const user = await UserModel.findOne({ email, deletedAt: null }).select(
        "passwordHash name email _id"
    ).lean();

    if (!user) {
        // Set cooldown even on "user not found" to prevent user enumeration
        await setCooldown("signin_fail", email, FAILED_ATTEMPT_COOLDOWN_S);
        throw new ApiError("Invalid email or password.", 401);
    }

    // 6. Compare password
    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
        await setCooldown("signin_fail", email, FAILED_ATTEMPT_COOLDOWN_S);
        throw new ApiError("Invalid email or password.", 401);
    }

    // 7. Success — return the user id to be passed to NextAuth
    return {
        data: {
            userId: user._id.toString(),
            name:   user.name,
            email:  user.email,
        },
        status: 200,
    };
});

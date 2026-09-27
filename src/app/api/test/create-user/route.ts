import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import ConnectDB from "@/config/db";
import UserModel from "@/models/user.model";
import { ApiError, withErrorHandler } from "@/lib/helpers/withErrorHandler";
import { withTransaction } from "@/lib/helpers/withTransaction";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BCRYPT_SALT_ROUNDS = 12;

const MIN_PASSWORD_LENGTH = 6;

// ---------------------------------------------------------------------------
// Input validation
// ---------------------------------------------------------------------------

interface CreateUserBody {
    name: string;
    email: string;
    password: string;
    /** Optional: ID of the admin creating this user (null for bootstrap admin) */
    createdBy?: string | null;
}

function validateBody(body: unknown): CreateUserBody {
    if (!body || typeof body !== "object") {
        throw new ApiError("Request body must be a JSON object.", 400);
    }

    const { name, email, password, createdBy } = body as Record<string, unknown>;

    // --- name ---
    if (!name || typeof name !== "string" || name.trim().length === 0) {
        throw new ApiError("'name' is required and must be a non-empty string.", 400);
    }

    // --- email ---
    if (!email || typeof email !== "string") {
        throw new ApiError("'email' is required.", 400);
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
        throw new ApiError("'email' must be a valid email address.", 400);
    }

    // --- password ---
    if (!password || typeof password !== "string") {
        throw new ApiError("'password' is required.", 400);
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
        throw new ApiError(
            `'password' must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
            400
        );
    }
    // At least one uppercase, one lowercase, one digit
    if (!/[A-Z]/.test(password)) {
        throw new ApiError("'password' must contain at least one uppercase letter.", 400);
    }
    if (!/[a-z]/.test(password)) {
        throw new ApiError("'password' must contain at least one lowercase letter.", 400);
    }
    if (!/[0-9]/.test(password)) {
        throw new ApiError("'password' must contain at least one digit.", 400);
    }

    // --- createdBy (optional) ---
    if (createdBy !== undefined && createdBy !== null) {
        if (typeof createdBy !== "string" || !mongoose.Types.ObjectId.isValid(createdBy)) {
            throw new ApiError("'createdBy' must be a valid MongoDB ObjectId string.", 400);
        }
    }

    return {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        createdBy: (createdBy as string | null | undefined) ?? null,
    };
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export const POST = withErrorHandler(async (req: NextRequest) => {
    // 1. Parse & validate body
    let body: unknown;
    try {
        body = await req.json();
    } catch {
        throw new ApiError("Invalid JSON in request body.", 400);
    }

    const { name, email, password, createdBy } = validateBody(body);

    // 2. Connect to DB
    await ConnectDB();

    // 3. Execute DB operations within a managed transaction
    const user = await withTransaction(async (session) => {
        // 4. Check for duplicate email (within the transaction)
        const existing = await UserModel.findOne(
            { email, deletedAt: null },
            null,
            { session }
        ).lean();

        if (existing) {
            throw new ApiError(
                `A user with email '${email}' already exists.`,
                409  // 409 Conflict
            );
        }

        // 5. Hash the password
        const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

        // 6. Create the user document inside the transaction
        const [newUser] = await UserModel.create(
            [
                {
                    name,
                    email,
                    passwordHash,
                    createdBy: createdBy
                        ? new mongoose.Types.ObjectId(createdBy)
                        : null,
                    deletedAt: null,
                },
            ],
            { session }
        );

        return newUser;
    });

    // 7. Return the safe user projection (never return passwordHash)
    return {
        data: {
            id:        user._id,
            name:      user.name,
            email:     user.email,
            createdBy: user.createdBy,
            createdAt: user.createdAt,
        },
        status: 201,
    };
});

import { NextRequest } from "next/server";
import ConnectDB from "@/config/db";
import UserModel from "@/models/user.model";
import { withErrorHandler, ApiError } from "@/lib/helpers/withErrorHandler";
import { getUserId } from "@/lib/auth/getUserId";
import { withTransaction } from "@/lib/helpers/withTransaction";

export const GET = withErrorHandler(async () => {
    const userId = await getUserId();

    await ConnectDB();
    const user = await UserModel.findById(userId)
        .select("-passwordHash -__v")
        .lean();

    if (!user) {
        throw new ApiError("User not found", 404);
    }

    return { data: user };
});

export const PATCH = withErrorHandler(async (request: NextRequest) => {
    const userId = await getUserId();
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string" || name.trim() === "") {
        throw new ApiError("Valid name is required", 400);
    }

    await ConnectDB();

    const updatedUser = await withTransaction(async (session) => {
        const user = await UserModel.findByIdAndUpdate(
            userId,
            { name: name.trim() },
            { returnDocument: "after", runValidators: true, session }
        )
        .select("-passwordHash -__v")
        .lean();

        if (!user) {
            throw new ApiError("User not found", 404);
        }
        
        return user;
    });

    return { data: updatedUser };
});

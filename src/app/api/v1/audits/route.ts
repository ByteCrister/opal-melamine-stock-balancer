import { NextRequest } from "next/server";
import ConnectDB from "@/config/db";
import AuditLogModel from "@/models/auditLog.model";
import { withErrorHandler } from "@/lib/helpers/withErrorHandler";
import { sanitizeSearch } from "@/lib/helpers/sanitize-search";
import { getUserId } from "@/lib/auth/getUserId";

export const GET = withErrorHandler(async (request: NextRequest) => {
    const userId = await getUserId();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const rawSearch = searchParams.get("search");
    const search = sanitizeSearch(rawSearch);
    const sort = searchParams.get("sort") === "asc" ? 1 : -1;
    const sortBy = searchParams.get("sortBy") || "createdAt";

    const query: Record<string, unknown> = { user: userId };
    
    if (search) {
        query.$or = [
            { action: { $regex: search, $options: "i" } },
            { entity: { $regex: search, $options: "i" } },
            { userName: { $regex: search, $options: "i" } },
        ];
    }

    await ConnectDB();

    const skip = (page - 1) * limit;

    const [audits, total] = await Promise.all([
        AuditLogModel.find(query)
            .sort({ [sortBy]: sort })
            .skip(skip)
            .limit(limit)
            .lean(),
        AuditLogModel.countDocuments(query),
    ]);

    return {
        data: {
            items: audits,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        },
    };
});

import { NextRequest } from "next/server";
import { QueryFilter, Types } from "mongoose";
import ConnectDB from "@/config/db";
import ItemModel, { IItem } from "@/models/items.model";
import AuditLogModel, { AuditAction } from "@/models/auditLog.model";
import { withErrorHandler, ApiError } from "@/lib/helpers/withErrorHandler";
import { withTransaction } from "@/lib/helpers/withTransaction";
import { getUserId } from "@/lib/auth/getUserId";
import { createItemSchema } from "@/utils/zod/item.schema";
import { sanitizeSearch } from "@/lib/helpers/sanitize-search";

export const GET = withErrorHandler(async (request: NextRequest) => {
  await getUserId(); // ensure authenticated
  await ConnectDB();

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const search = sanitizeSearch(searchParams.get("search")) || "";
  const category = searchParams.get("category") || "";
  const classCode = searchParams.get("classCode") || "";
  const material = searchParams.get("material") || "";
  const sort = searchParams.get("sort") || "desc";
  const sortBy = searchParams.get("sortBy") || "createdAt";

  // Build query
  const query: QueryFilter<IItem> = { deletedAt: null };

  if (search) {
    query.$or = [
      { itemCode: { $regex: search, $options: "i" } },
      { itemName: { $regex: search, $options: "i" } },
      { className: { $regex: search, $options: "i" } }
    ];
  }
  if (category) query.category = category;
  if (classCode) query.classCode = classCode;
  if (material) query.material = material;

  const skip = (page - 1) * limit;

  // Build sort options
  const sortOptions: Record<string, 1 | -1> = {};
  sortOptions[sortBy] = sort === "asc" ? 1 : -1;

  const [items, total] = await Promise.all([
    ItemModel.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean(),
    ItemModel.countDocuments(query),
  ]);

  return {
    data: {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    },
  };
});

export const POST = withErrorHandler(async (request: NextRequest) => {
  const userId = await getUserId();
  await ConnectDB();

  const payload = await request.json();
  const data = createItemSchema.parse(payload);

  return withTransaction(async (session) => {
    const existingItem = await ItemModel.findOne({ itemCode: data.itemCode }).session(session);
    if (existingItem) {
      throw new ApiError(`Item code "${data.itemCode}" already exists.`, 400);
    }

    const newItem = new ItemModel({
      ...data,
      createdBy: userId,
    });

    await newItem.save({ session });

    await AuditLogModel.create(
      [
        {
          user: new Types.ObjectId(userId),
          action: AuditAction.ITEM_CREATED,
          entityType: "Item",
          entityId: newItem._id,
          details: {
            itemCode: newItem.itemCode,
            itemName: newItem.itemName,
            category: newItem.category,
            classCode: newItem.classCode,
          },
        },
      ],
      { session }
    );

    return {
      data: { success: true, message: "Item created successfully", item: newItem },
    };
  });
});

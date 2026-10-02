import { NextRequest } from "next/server";
import ConnectDB from "@/config/db";
import StockMovementModel from "@/models/stock-movements.model";
import ItemModel from "@/models/items.model";
import DropdownListModel from "@/models/dropdown-list.model";
import { AuditAction } from "@/models/auditLog.model";
import { createAuditLog } from "@/lib/helpers/audit";
import { withErrorHandler, ApiError } from "@/lib/helpers/withErrorHandler";
import { withTransaction } from "@/lib/helpers/withTransaction";
import { getUserId } from "@/lib/auth/getUserId";
import { createStockMovementSchema } from "@/utils/zod/stock-movement.schema";
import { sanitizeSearch } from "@/lib/helpers/sanitize-search";
import { QueryFilter, Types } from "mongoose";
import { IStockMovement } from "@/models/stock-movements.model";
import { STOCK_MOVEMENT_TYPE } from "@/const/stock.const";

export const GET = withErrorHandler(async (request: NextRequest) => {
  await getUserId(); // ensure authenticated
  await ConnectDB();

  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const search = sanitizeSearch(searchParams.get("search")) || "";
  const sort = searchParams.get("sort") || "desc";
  const sortBy = searchParams.get("sortBy") || "date";

  const query: QueryFilter<IStockMovement> = { 
    deletedAt: null, 
    type: STOCK_MOVEMENT_TYPE.STOCK_OUT 
  };

  if (search) {
    const matchedItems = await ItemModel.find({
      $or: [
        { itemCode: { $regex: search, $options: "i" } },
        { itemName: { $regex: search, $options: "i" } },
      ]
    }).select("_id").lean();
    
    query.itemId = { $in: matchedItems.map(item => item._id as Types.ObjectId) };
  }

  const skip = (page - 1) * limit;

  const sortOptions: Record<string, 1 | -1> = {};
  sortOptions[sortBy] = sort === "asc" ? 1 : -1;

  const [rawItems, total, dropdowns] = await Promise.all([
    StockMovementModel.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate("itemId")
      .lean(),
    StockMovementModel.countDocuments(query),
    DropdownListModel.findOne().lean(),
  ]);

  const items = rawItems.map(m => {
    const item = m.itemId as any;
    return {
      ...m,
      itemId: item?._id?.toString() || m.itemId,
      itemCode: item?.itemCode || "—",
      itemName: item?.itemName || "—",
      unit: dropdowns?.units?.find((u: any) => u._id.toString() === item?.unitId?.toString())?.value || "—",
    };
  });

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

  const body = await request.json();
  const parsedData = createStockMovementSchema.parse(body);

  return withTransaction(async (session) => {
    // Validate the item actually exists
    const item = await ItemModel.findById(parsedData.itemId).session(session).lean();
    if (!item) {
      throw new ApiError("Item not found", 404);
    }

    const [movement] = await StockMovementModel.create([{
      ...parsedData,
      type: STOCK_MOVEMENT_TYPE.STOCK_OUT,
      createdBy: userId,
    }], { session });

    await createAuditLog(request, {
      user: userId,
      action: AuditAction.STOCK_DISPATCHED,
      entityType: "StockMovement",
      entityId: movement._id,
      details: {
        itemCode: parsedData.itemCode,
        itemName: parsedData.itemName,
        quantity: parsedData.quantity,
        date: parsedData.date,
        remarks: parsedData.remarks,
      },
    }, session);

    return {
      data: {
        success: true,
        message: "Stock out recorded successfully",
        movement,
      },
    };
  });
});

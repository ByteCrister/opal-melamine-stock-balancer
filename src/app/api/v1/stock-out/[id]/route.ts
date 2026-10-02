import { NextRequest } from "next/server";
import ConnectDB from "@/config/db";
import StockMovementModel from "@/models/stock-movements.model";
import ItemModel from "@/models/items.model";
import { AuditAction } from "@/models/auditLog.model";
import { createAuditLog } from "@/lib/helpers/audit";
import { withErrorHandler, ApiError } from "@/lib/helpers/withErrorHandler";
import { withTransaction } from "@/lib/helpers/withTransaction";
import { getUserId } from "@/lib/auth/getUserId";
import { updateStockMovementSchema } from "@/utils/zod/stock-movement.schema";
import { STOCK_MOVEMENT_TYPE } from "@/const/stock.const";

export const GET = withErrorHandler(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  await getUserId();
  await ConnectDB();

  const movementRaw = await StockMovementModel.findOne({
    _id: id,
    type: STOCK_MOVEMENT_TYPE.STOCK_OUT,
    deletedAt: null,
  }).populate("itemId").lean();

  if (!movementRaw) {
    throw new ApiError("Stock out not found", 404);
  }

  const item = movementRaw.itemId as any;
  const movement = {
    ...movementRaw,
    itemId: item?._id?.toString() || movementRaw.itemId,
    itemCode: item?.itemCode || "—",
    itemName: item?.itemName || "—",
  };

  return { data: { movement } };
});

export const PUT = withErrorHandler(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const userId = await getUserId();
  await ConnectDB();

  const body = await request.json();
  const parsedData = updateStockMovementSchema.parse(body);

  return withTransaction(async (session) => {
    if (parsedData.itemId) {
      const item = await ItemModel.findById(parsedData.itemId).session(session).lean();
      if (!item) {
        throw new ApiError("Item not found", 404);
      }
    }

    const movement = await StockMovementModel.findOneAndUpdate(
      { _id: id, type: STOCK_MOVEMENT_TYPE.STOCK_OUT, deletedAt: null },
      { $set: parsedData },
      { returnDocument: "after", session }
    ).lean();

    if (!movement) {
      throw new ApiError("Stock out not found", 404);
    }

    const itemRecord = await ItemModel.findById(movement.itemId).session(session).lean();

    await createAuditLog(
      request,
      {
        user: userId,
        action: AuditAction.STOCK_ADJUSTED,
        entityType: "StockMovement",
        entityId: id,
        details: {
          operation: "UPDATE",
          type: STOCK_MOVEMENT_TYPE.STOCK_OUT,
          itemCode: itemRecord?.itemCode || "—",
          itemName: itemRecord?.itemName || "—",
          changedFields: Object.keys(parsedData),
        },
      },
      session
    );

    return {
      data: {
        success: true,
        message: "Stock out updated successfully",
        movement,
      },
    };
  });
});

export const DELETE = withErrorHandler(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const userId = await getUserId();
  await ConnectDB();

  return withTransaction(async (session) => {
    const movement = await StockMovementModel.findOneAndUpdate(
      { _id: id, type: STOCK_MOVEMENT_TYPE.STOCK_OUT, deletedAt: null },
      { $set: { deletedAt: new Date() } },
      { returnDocument: "after", session }
    ).lean();

    if (!movement) {
      throw new ApiError("Stock out not found", 404);
    }

    const itemRecord = await ItemModel.findById(movement.itemId).session(session).lean();

    await createAuditLog(
      request,
      {
        user: userId,
        action: AuditAction.STOCK_REVERTED,
        entityType: "StockMovement",
        entityId: id,
        details: {
          operation: "DELETE",
          type: STOCK_MOVEMENT_TYPE.STOCK_OUT,
          itemCode: itemRecord?.itemCode || "—",
          itemName: itemRecord?.itemName || "—",
          softDeleted: true,
        },
      },
      session
    );

    return {
      data: {
        success: true,
        message: "Stock out deleted successfully",
      },
    };
  });
});

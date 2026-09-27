import { NextRequest } from "next/server";
import ConnectDB from "@/config/db";
import StockMovementModel from "@/models/stock-movements.model";
import ItemModel from "@/models/items.model";
import { withErrorHandler, ApiError } from "@/lib/helpers/withErrorHandler";
import { getUserId } from "@/lib/auth/getUserId";
import { updateStockMovementSchema } from "@/utils/zod/stock-movement.schema";
import { STOCK_MOVEMENT_TYPE } from "@/const/stock.const";

export const GET = withErrorHandler(async (request: NextRequest, { params }: { params: { id: string } }) => {
  await getUserId();
  await ConnectDB();

  const movement = await StockMovementModel.findOne({
    _id: params.id,
    type: STOCK_MOVEMENT_TYPE.STOCK_OUT,
    deletedAt: null,
  }).lean();

  if (!movement) {
    throw new ApiError("Stock out not found", 404);
  }

  return { data: { movement } };
});

export const PUT = withErrorHandler(async (request: NextRequest, { params }: { params: { id: string } }) => {
  await getUserId();
  await ConnectDB();

  const body = await request.json();
  const parsedData = updateStockMovementSchema.parse(body);

  if (parsedData.itemId) {
    const item = await ItemModel.findById(parsedData.itemId).lean();
    if (!item) {
      throw new ApiError("Item not found", 404);
    }
  }

  const movement = await StockMovementModel.findOneAndUpdate(
    { _id: params.id, type: STOCK_MOVEMENT_TYPE.STOCK_OUT, deletedAt: null },
    { $set: parsedData },
    { new: true }
  ).lean();

  if (!movement) {
    throw new ApiError("Stock out not found", 404);
  }

  return {
    data: {
      success: true,
      message: "Stock out updated successfully",
      movement,
    },
  };
});

export const DELETE = withErrorHandler(async (request: NextRequest, { params }: { params: { id: string } }) => {
  await getUserId();
  await ConnectDB();

  const movement = await StockMovementModel.findOneAndUpdate(
    { _id: params.id, type: STOCK_MOVEMENT_TYPE.STOCK_OUT, deletedAt: null },
    { $set: { deletedAt: new Date() } },
    { new: true }
  ).lean();

  if (!movement) {
    throw new ApiError("Stock out not found", 404);
  }

  return {
    data: {
      success: true,
      message: "Stock out deleted successfully",
    },
  };
});

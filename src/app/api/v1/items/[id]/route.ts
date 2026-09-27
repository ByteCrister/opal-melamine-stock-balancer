import { NextRequest } from "next/server";
import ConnectDB from "@/config/db";
import ItemModel from "@/models/items.model";
import { withErrorHandler, ApiError } from "@/lib/helpers/withErrorHandler";
import { getUserId } from "@/lib/auth/getUserId";
import { updateItemSchema } from "@/utils/zod/item.schema";

interface RouteParams {
  params: {
    id: string;
  };
}

export const GET = withErrorHandler(async (request: NextRequest, { params }: RouteParams) => {
  await getUserId();
  await ConnectDB();

  const item = await ItemModel.findOne({ _id: params.id, deletedAt: null }).lean();
  if (!item) {
    throw new ApiError("Item not found", 404);
  }

  return {
    data: { item },
  };
});

export const PUT = withErrorHandler(async (request: NextRequest, { params }: RouteParams) => {
  await getUserId();
  await ConnectDB();

  const payload = await request.json();
  const data = updateItemSchema.parse(payload);

  if (data.itemCode) {
    const existing = await ItemModel.findOne({ itemCode: data.itemCode, _id: { $ne: params.id } });
    if (existing) {
      throw new ApiError(`Item code "${data.itemCode}" already exists.`, 400);
    }
  }

  const updatedItem = await ItemModel.findOneAndUpdate(
    { _id: params.id, deletedAt: null },
    { $set: data },
    { new: true }
  );

  if (!updatedItem) {
    throw new ApiError("Item not found", 404);
  }

  return {
    data: { success: true, message: "Item updated successfully", item: updatedItem },
  };
});

export const DELETE = withErrorHandler(async (request: NextRequest, { params }: RouteParams) => {
  await getUserId();
  await ConnectDB();

  const item = await ItemModel.findOneAndUpdate(
    { _id: params.id, deletedAt: null },
    { $set: { deletedAt: new Date() } },
    { new: true }
  );

  if (!item) {
    throw new ApiError("Item not found", 404);
  }

  return {
    data: { success: true, message: "Item deleted successfully" },
  };
});

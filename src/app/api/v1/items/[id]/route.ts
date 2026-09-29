import { NextRequest } from "next/server";
import { Types } from "mongoose";
import ConnectDB from "@/config/db";
import ItemModel from "@/models/items.model";
import StockMovementModel from "@/models/stock-movements.model";
import AuditLogModel, { AuditAction } from "@/models/auditLog.model";
import { withErrorHandler, ApiError } from "@/lib/helpers/withErrorHandler";
import { withTransaction } from "@/lib/helpers/withTransaction";
import { getUserId } from "@/lib/auth/getUserId";
import { updateItemSchema } from "@/utils/zod/item.schema";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export const GET = withErrorHandler(async (request: NextRequest, { params }: RouteParams) => {
  const { id } = await params;
  await getUserId();
  await ConnectDB();

  if (!Types.ObjectId.isValid(id)) throw new ApiError("Invalid item ID", 400);

  const [item] = await ItemModel.aggregate([
    { $match: { _id: new Types.ObjectId(id), deletedAt: null } },

    // Join the single DropdownList document
    { $lookup: { from: "dropdownlists", pipeline: [{ $limit: 1 }], as: "dl" } },
    { $unwind: { path: "$dl", preserveNullAndEmptyArrays: true } },

    // Resolve all labels in one $addFields pass
    {
      $addFields: {
        className:    {
          $let: {
            vars: { m: { $arrayElemAt: [{ $filter: { input: { $ifNull: ["$dl.classes",     []] }, as: "el", cond: { $eq: ["$$el._id", "$classId"]    } } }, 0] } },
            in: { $ifNull: ["$$m.className", "—"] },
          },
        },
        categoryName: {
          $let: {
            vars: { m: { $arrayElemAt: [{ $filter: { input: { $ifNull: ["$dl.categories", []] }, as: "el", cond: { $eq: ["$$el._id", "$categoryId"] } } }, 0] } },
            in: { $ifNull: ["$$m.value", "—"] },
          },
        },
        materialName: {
          $let: {
            vars: { m: { $arrayElemAt: [{ $filter: { input: { $ifNull: ["$dl.materials",  []] }, as: "el", cond: { $eq: ["$$el._id", "$materialId"] } } }, 0] } },
            in: { $ifNull: ["$$m.value", "—"] },
          },
        },
        shapeName: {
          $let: {
            vars: { m: { $arrayElemAt: [{ $filter: { input: { $ifNull: ["$dl.shapes",     []] }, as: "el", cond: { $eq: ["$$el._id", "$shapeId"]    } } }, 0] } },
            in: { $ifNull: ["$$m.value", "—"] },
          },
        },
        unitName: {
          $let: {
            vars: { m: { $arrayElemAt: [{ $filter: { input: { $ifNull: ["$dl.units",      []] }, as: "el", cond: { $eq: ["$$el._id", "$unitId"]     } } }, 0] } },
            in: { $ifNull: ["$$m.value", "—"] },
          },
        },
        doUnitName: {
          $let: {
            vars: { m: { $arrayElemAt: [{ $filter: { input: { $ifNull: ["$dl.units",      []] }, as: "el", cond: { $eq: ["$$el._id", "$doUnitId"]   } } }, 0] } },
            in: { $ifNull: ["$$m.value", "—"] },
          },
        },
      },
    },

    { $project: { dl: 0 } },
  ]);

  if (!item) throw new ApiError("Item not found", 404);

  return { data: { item } };
});

export const PUT = withErrorHandler(async (request: NextRequest, { params }: RouteParams) => {
  const { id } = await params;
  const userId = await getUserId();
  await ConnectDB();

  const payload = await request.json();
  const data = updateItemSchema.parse(payload);

  return withTransaction(async (session) => {
    if (data.itemCode) {
      const existing = await ItemModel.findOne({ itemCode: data.itemCode, _id: { $ne: id } }).session(session);
      if (existing) {
        throw new ApiError(`Item code "${data.itemCode}" already exists.`, 400);
      }
    }

    const oldItem = await ItemModel.findOne({ _id: id, deletedAt: null }).session(session).lean();
    if (!oldItem) {
      throw new ApiError("Item not found", 404);
    }

    const updatedItem = await ItemModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { $set: data },
      { returnDocument: "after", session }
    ).lean();

    if (!updatedItem) {
      throw new ApiError("Failed to update item", 500);
    }


    await AuditLogModel.create(
      [
        {
          user: new Types.ObjectId(userId),
          action: AuditAction.ITEM_UPDATED,
          entityType: "Item",
          entityId: new Types.ObjectId(id),
          details: {
            itemCode: updatedItem.itemCode,
            itemName: updatedItem.itemName,
            changedFields: Object.keys(data),
          },
        },
      ],
      { session }
    );

    return {
      data: { success: true, message: "Item updated successfully", item: updatedItem },
    };
  });
});

export const DELETE = withErrorHandler(async (request: NextRequest, { params }: RouteParams) => {
  const { id } = await params;
  const userId = await getUserId();
  await ConnectDB();

  return withTransaction(async (session) => {
    const item = await ItemModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { $set: { deletedAt: new Date() } },
      { returnDocument: "after", session }
    ).lean();

    if (!item) {
      throw new ApiError("Item not found", 404);
    }

    await AuditLogModel.create(
      [
        {
          user: new Types.ObjectId(userId),
          action: AuditAction.ITEM_DELETED,
          entityType: "Item",
          entityId: new Types.ObjectId(id),
          details: {
            itemCode: item.itemCode,
            itemName: item.itemName,
            softDeleted: true,
          },
        },
      ],
      { session }
    );

    return {
      data: { success: true, message: "Item deleted successfully" },
    };
  });
});

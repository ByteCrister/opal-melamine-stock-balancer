import { NextRequest } from "next/server";
import ConnectDB from "@/config/db";
import ItemModel from "@/models/items.model";
import { withErrorHandler } from "@/lib/helpers/withErrorHandler";
import { getUserId } from "@/lib/auth/getUserId";
import { sanitizeSearch } from "@/lib/helpers/sanitize-search";
import { PipelineStage } from "mongoose";

export const GET = withErrorHandler(async (request: NextRequest) => {
  await getUserId();
  await ConnectDB();

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const search = sanitizeSearch(searchParams.get("search")) || "";
  const category = searchParams.get("category") || "";
  const classCode = searchParams.get("classCode") || "";
  const material = searchParams.get("material") || "";

  // 1. Match pipeline for Items
  const matchStage: Record<string, unknown> = { deletedAt: null };

  if (search) {
    matchStage.$or = [
      { itemCode: { $regex: search, $options: "i" } },
      { itemName: { $regex: search, $options: "i" } },
      { className: { $regex: search, $options: "i" } },
    ];
  }
  if (category) matchStage.category = category;
  if (classCode) matchStage.classCode = classCode;
  if (material) matchStage.material = material;

  const skip = (page - 1) * limit;

  // 2. Aggregate
  const pipeline: PipelineStage[] = [
    { $match: matchStage },
    { $sort: { itemCode: 1 } },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "stockmovements",
        let: { itemId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$itemId", "$$itemId"] },
              deletedAt: null,
            },
          },
          {
            $group: {
              _id: null,
              totalIn: {
                $sum: {
                  $cond: [{ $eq: ["$type", "IN"] }, "$quantity", 0],
                },
              },
              totalOut: {
                $sum: {
                  $cond: [{ $eq: ["$type", "OUT"] }, "$quantity", 0],
                },
              },
            },
          },
        ],
        as: "stockData",
      },
    },
    {
      $addFields: {
        totalIn: { $ifNull: [{ $arrayElemAt: ["$stockData.totalIn", 0] }, 0] },
        totalOut: { $ifNull: [{ $arrayElemAt: ["$stockData.totalOut", 0] }, 0] },
      },
    },
    {
      $addFields: {
        balance: { $subtract: ["$totalIn", "$totalOut"] },
      },
    },
    {
      $project: {
        stockData: 0,
      },
    },
  ];

  const [items, total] = await Promise.all([
    ItemModel.aggregate(pipeline),
    ItemModel.countDocuments(matchStage),
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

// src/app/api/v1/dashboard/route.ts
import { NextRequest } from "next/server";
import ConnectDB from "@/config/db";
import ItemModel from "@/models/items.model";
import StockMovementModel from "@/models/stock-movements.model";
import DropdownListModel from "@/models/dropdown-list.model";
import { withErrorHandler } from "@/lib/helpers/withErrorHandler";
import { getUserId } from "@/lib/auth/getUserId";
import { STOCK_MOVEMENT_TYPE } from "@/const/stock.const";
import { format } from "date-fns";
import { getCollectionName } from "@/lib/helpers/get-collection-name";

export const GET = withErrorHandler(async (request: NextRequest) => {
  await getUserId(); // Auth guard
  await ConnectDB();

  const itemsCol         = getCollectionName(ItemModel);
  const stockMovementsCol = getCollectionName(StockMovementModel);
  const dropdownsCol      = getCollectionName(DropdownListModel);

  const { searchParams } = new URL(request.url);
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  // Parse dates with safe fallback
  const from = fromParam ? new Date(fromParam) : new Date(Date.now() - 29 * 24 * 60 * 60 * 1000);
  const to = toParam ? new Date(toParam) : new Date();

  // Validate dates
  if (isNaN(from.getTime()) || isNaN(to.getTime()) || from > to) {
    throw new Error("Invalid date range");
  }

  // Previous period for comparison (same length)
  const periodLength = to.getTime() - from.getTime();
  const prevFrom = new Date(from.getTime() - periodLength);
  const prevTo = new Date(from.getTime() - 1);

  // Active match filter
  const activeFilter = { deletedAt: null };
  const movementFilter = { deletedAt: null, date: { $gte: from, $lte: to } };
  const prevMovementFilter = { deletedAt: null, date: { $gte: prevFrom, $lte: prevTo } };

  // Run all aggregations in parallel
  const [
    totalProducts,
    activeProducts,
    currentPeriodAgg,
    prevPeriodAgg,
    trendRaw,
    categoryRaw,
    topStockInRaw,
    topStockOutRaw,
    recentActivityRaw,
    lowStockCount,
    dropdownsRaw,
  ] = await Promise.all([
    // Total product count (including soft-deleted)
    ItemModel.countDocuments({}),

    // Active products
    ItemModel.countDocuments(activeFilter),

    // Current period aggregation
    StockMovementModel.aggregate([
      { $match: movementFilter },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$quantity" },
        },
      },
    ]),

    // Previous period aggregation (for % change)
    StockMovementModel.aggregate([
      { $match: prevMovementFilter },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$quantity" },
        },
      },
    ]),

    // Daily trend series
    StockMovementModel.aggregate([
      { $match: movementFilter },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            type: "$type",
          },
          total: { $sum: "$quantity" },
        },
      },
      { $sort: { "_id.date": 1 } },
    ]),

    // Category breakdown — name resolved inside the pipeline to avoid ObjectId mismatch
    StockMovementModel.aggregate([
      { $match: movementFilter },
      {
        $lookup: {
          from: itemsCol,
          localField: "itemId",
          foreignField: "_id",
          as: "item",
        },
      },
      { $unwind: { path: "$item", preserveNullAndEmptyArrays: false } },
      // Only include active (non-deleted) items in the breakdown
      { $match: { "item.deletedAt": null } },
      {
        $group: {
          _id: {
            categoryId: "$item.categoryId",
            type: "$type",
          },
          total: { $sum: "$quantity" },
          itemCount: { $addToSet: "$itemId" },
        },
      },
      // Resolve the category name from the DropdownList sub-document
      {
        $lookup: {
          from: dropdownsCol,
          pipeline: [{ $limit: 1 }, { $project: { categories: 1 } }],
          as: "_ddl",
        },
      },
      {
        $addFields: {
          categoryName: {
            $let: {
              vars: {
                matched: {
                  $filter: {
                    input: { $arrayElemAt: ["$_ddl.categories", 0] },
                    as: "cat",
                    cond: { $eq: ["$$cat._id", "$_id.categoryId"] },
                  },
                },
              },
              in: {
                $ifNull: [
                  { $arrayElemAt: ["$$matched.value", 0] },
                  "Uncategorized",
                ],
              },
            },
          },
        },
      },
      { $project: { _ddl: 0 } },
    ]),

    // Top 10 stock-in items
    StockMovementModel.aggregate([
      { $match: { ...movementFilter, type: STOCK_MOVEMENT_TYPE.STOCK_IN } },
      {
        $group: {
          _id: "$itemId",
          quantity: { $sum: "$quantity" },
        },
      },
      { $sort: { quantity: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: itemsCol,
          localField: "_id",
          foreignField: "_id",
          as: "item",
        }
      },
      { $unwind: "$item" }
    ]),

    // Top 10 stock-out items
    StockMovementModel.aggregate([
      { $match: { ...movementFilter, type: STOCK_MOVEMENT_TYPE.STOCK_OUT } },
      {
        $group: {
          _id: "$itemId",
          quantity: { $sum: "$quantity" },
        },
      },
      { $sort: { quantity: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: itemsCol,
          localField: "_id",
          foreignField: "_id",
          as: "item",
        }
      },
      { $unwind: "$item" }
    ]),

    // Recent 10 activities
    StockMovementModel.aggregate([
      { $match: movementFilter },
      { $sort: { date: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: itemsCol,
          localField: "itemId",
          foreignField: "_id",
          as: "item",
        }
      },
      { $unwind: "$item" }
    ]),

    // Items whose current stock balance is below their reorder level
    ItemModel.aggregate([
      { $match: { deletedAt: null, reorderLevel: { $gt: 0 } } },
      {
        $lookup: {
          from: stockMovementsCol,
          let: { itemId: "$_id" },
          pipeline: [
            { $match: { $expr: { $and: [
              { $eq: ["$itemId", "$$itemId"] },
              { $eq: ["$deletedAt", null] },
            ]}}},
            { $group: {
              _id: null,
              balance: {
                $sum: {
                  $cond: [
                    { $eq: ["$type", STOCK_MOVEMENT_TYPE.STOCK_IN] },
                    "$quantity",
                    { $multiply: ["$quantity", -1] },
                  ],
                },
              },
            }},
          ],
          as: "stock",
        },
      },
      { $addFields: { balance: { $ifNull: [{ $arrayElemAt: ["$stock.balance", 0] }, 0] } } },
      { $match: { $expr: { $lt: ["$balance", "$reorderLevel"] } } },
      { $count: "total" },
    ]).then((res) => res[0]?.total ?? 0),

    DropdownListModel.findOne().lean(),
  ]);

  const dropdowns = dropdownsRaw as any;

  // --- Process KPIs ---
  const currIn  = currentPeriodAgg.find((a) => a._id === STOCK_MOVEMENT_TYPE.STOCK_IN)?.total ?? 0;
  const currOut = currentPeriodAgg.find((a) => a._id === STOCK_MOVEMENT_TYPE.STOCK_OUT)?.total ?? 0;
  const prevIn  = prevPeriodAgg.find((a) => a._id === STOCK_MOVEMENT_TYPE.STOCK_IN)?.total ?? 0;
  const prevOut = prevPeriodAgg.find((a) => a._id === STOCK_MOVEMENT_TYPE.STOCK_OUT)?.total ?? 0;

  const pctChange = (curr: number, prev: number) =>
    prev === 0 ? (curr > 0 ? 100 : 0) : Math.round(((curr - prev) / prev) * 100);

  const stockInChange  = pctChange(currIn, prevIn);
  const stockOutChange = pctChange(currOut, prevOut);
  const currBalance    = currIn - currOut;
  const prevBalance    = prevIn - prevOut;
  const balanceChange  = pctChange(currBalance, prevBalance);

  // --- Process Trend ---
  // Build date→{ in, out } map
  const trendMap: Record<string, { stockIn: number; stockOut: number }> = {};
  for (const entry of trendRaw) {
    const d = entry._id.date as string;
    if (!trendMap[d]) trendMap[d] = { stockIn: 0, stockOut: 0 };
    if (entry._id.type === STOCK_MOVEMENT_TYPE.STOCK_IN) trendMap[d].stockIn += entry.total;
    else trendMap[d].stockOut += entry.total;
  }

  let runningBalance = 0;
  const trend = Object.entries(trendMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, { stockIn, stockOut }]) => {
      runningBalance += stockIn - stockOut;
      return { date, stockIn, stockOut, balance: runningBalance };
    });

  // --- Process Category Breakdown ---
  const catMap: Record<string, { stockIn: number; stockOut: number; itemCount: Set<string> }> = {};
  for (const entry of categoryRaw) {
    // categoryName is now resolved by the pipeline — no JS-side ObjectId comparison needed
    const cat = (entry.categoryName as string) || "Uncategorized";
    if (!catMap[cat]) catMap[cat] = { stockIn: 0, stockOut: 0, itemCount: new Set() };
    if (entry._id.type === STOCK_MOVEMENT_TYPE.STOCK_IN) catMap[cat].stockIn += entry.total;
    else catMap[cat].stockOut += entry.total;
    for (const id of entry.itemCount as string[]) catMap[cat].itemCount.add(String(id));
  }
  const categoryBreakdown = Object.entries(catMap).map(([category, { stockIn, stockOut, itemCount }]) => ({
    category,
    stockIn,
    stockOut,
    balance: stockIn - stockOut,
    itemCount: itemCount.size,
  }));

  // --- Top movers ---
  const topStockIn = topStockInRaw.map((entry) => ({
    itemCode: entry.item.itemCode as string,
    itemName: entry.item.itemName as string,
    quantity: entry.quantity as number,
    unit: dropdowns?.units?.find((u: any) => u._id.toString() === entry.item.unitId?.toString())?.value || "—",
    type: "IN" as const,
  }));
  const topStockOut = topStockOutRaw.map((entry) => ({
    itemCode: entry.item.itemCode as string,
    itemName: entry.item.itemName as string,
    quantity: entry.quantity as number,
    unit: dropdowns?.units?.find((u: any) => u._id.toString() === entry.item.unitId?.toString())?.value || "—",
    type: "OUT" as const,
  }));

  // --- Recent Activity ---
  const recentActivity = recentActivityRaw.map((m) => ({
    _id: String(m._id),
    date: format(new Date(m.date), "yyyy-MM-dd"),
    itemCode: m.item.itemCode,
    itemName: m.item.itemName,
    quantity: m.quantity,
    unit: dropdowns?.units?.find((u: any) => u._id.toString() === m.item.unitId?.toString())?.value || "—",
    type: m.type as "IN" | "OUT",
    remarks: m.remarks,
  }));

  return {
    data: {
      kpis: {
        totalProducts,
        activeProducts,
        totalStockIn: currIn,
        totalStockOut: currOut,
        stockBalance: currBalance,
        lowStockItems: lowStockCount,
        stockInChange,
        stockOutChange,
        balanceChange,
      },
      trend,
      categoryBreakdown,
      topStockIn,
      topStockOut,
      recentActivity,
    },
  };
});

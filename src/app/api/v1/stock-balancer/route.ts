import { NextRequest } from "next/server";
import { PipelineStage } from "mongoose";
import ConnectDB from "@/config/db";
import ItemModel from "@/models/items.model";
import { withErrorHandler } from "@/lib/helpers/withErrorHandler";
import { getUserId } from "@/lib/auth/getUserId";
import { sanitizeSearch } from "@/lib/helpers/sanitize-search";

// ---------------------------------------------------------------------------
// Helper — resolve a label from a DropdownList embedded array in the pipeline
// ---------------------------------------------------------------------------
function labelExpr(arrayField: string, itemIdField: string, labelKey: "value" | "className") {
  return {
    $let: {
      vars: {
        matched: {
          $arrayElemAt: [
            {
              $filter: {
                input: { $ifNull: [`$dl.${arrayField}`, []] },
                as: "el",
                cond: { $eq: ["$$el._id", `$${itemIdField}`] },
              },
            },
            0,
          ],
        },
      },
      in: { $ifNull: [`$$matched.${labelKey}`, "—"] },
    },
  };
}

// ---------------------------------------------------------------------------
// GET  /api/v1/stock-balancer
// ---------------------------------------------------------------------------
export const GET = withErrorHandler(async (request: NextRequest) => {
  await getUserId();
  await ConnectDB();

  const { searchParams } = new URL(request.url);
  const page     = Math.max(1, parseInt(searchParams.get("page")  || "1",  10));
  const limit    = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));
  const search   = sanitizeSearch(searchParams.get("search"))  || "";
  const category = (searchParams.get("category") || "").trim();
  const cls      = (searchParams.get("class")    || "").trim();
  const material = (searchParams.get("material") || "").trim();

  const skip = (page - 1) * limit;

  // ── 1. Initial $match on the Items collection (uses indexes) ───────────────
  const initialMatch: Record<string, unknown> = { deletedAt: null };
  if (search) {
    initialMatch.$or = [
      { itemCode: { $regex: search, $options: "i" } },
      { itemName: { $regex: search, $options: "i" } },
    ];
  }

  // ── 2. Build pipeline ──────────────────────────────────────────────────────
  const pipeline: PipelineStage[] = [
    { $match: initialMatch },

    // Join the single DropdownList document once
    { $lookup: { from: "dropdownlists", pipeline: [{ $limit: 1 }], as: "dl" } },
    { $unwind: { path: "$dl", preserveNullAndEmptyArrays: true } },

    // ── 3. String-name filters — resolved fully inside MongoDB ─────────────
    ...(category
      ? [{
          $match: {
            $expr: {
              $gt: [{
                $size: {
                  $filter: {
                    input: { $ifNull: ["$dl.categories", []] }, as: "c",
                    cond: {
                      $and: [
                        { $eq: ["$$c._id", "$categoryId"] },
                        { $eq: [{ $toLower: "$$c.value" }, category.toLowerCase()] },
                      ],
                    },
                  },
                },
              }, 0],
            },
          },
        } as PipelineStage]
      : []),

    ...(cls
      ? [{
          $match: {
            $expr: {
              $gt: [{
                $size: {
                  $filter: {
                    input: { $ifNull: ["$dl.classes", []] }, as: "c",
                    cond: {
                      $and: [
                        { $eq: ["$$c._id", "$classId"] },
                        { $eq: [{ $toLower: "$$c.className" }, cls.toLowerCase()] },
                      ],
                    },
                  },
                },
              }, 0],
            },
          },
        } as PipelineStage]
      : []),

    ...(material
      ? [{
          $match: {
            $expr: {
              $gt: [{
                $size: {
                  $filter: {
                    input: { $ifNull: ["$dl.materials", []] }, as: "m",
                    cond: {
                      $and: [
                        { $eq: ["$$m._id", "$materialId"] },
                        { $eq: [{ $toLower: "$$m.value" }, material.toLowerCase()] },
                      ],
                    },
                  },
                },
              }, 0],
            },
          },
        } as PipelineStage]
      : []),

    // ── 4. Resolve labels in a single $addFields pass ──────────────────────
    {
      $addFields: {
        className:    labelExpr("classes",    "classId",    "className"),
        categoryName: labelExpr("categories", "categoryId", "value"),
        materialName: labelExpr("materials",  "materialId", "value"),
        shapeName:    labelExpr("shapes",     "shapeId",    "value"),
        unitName:     labelExpr("units",      "unitId",     "value"),
        doUnitName:   labelExpr("units",      "doUnitId",   "value"),
      },
    },

    // Drop joined doc
    { $project: { dl: 0 } },

    // ── 5. Join stock movements ────────────────────────────────────────────
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
              totalIn:  { $sum: { $cond: [{ $eq: ["$type", "IN"]  }, "$quantity", 0] } },
              totalOut: { $sum: { $cond: [{ $eq: ["$type", "OUT"] }, "$quantity", 0] } },
            },
          },
        ],
        as: "stockData",
      },
    },
    {
      $addFields: {
        totalIn:  { $ifNull: [{ $arrayElemAt: ["$stockData.totalIn",  0] }, 0] },
        totalOut: { $ifNull: [{ $arrayElemAt: ["$stockData.totalOut", 0] }, 0] },
      },
    },
    {
      $addFields: {
        balance: { $subtract: ["$totalIn", "$totalOut"] },
      },
    },

    // ── 6. Facet: data page + total count in ONE round-trip ───────────────
    {
      $facet: {
        items: [
          { $sort:  { itemCode: 1 } },
          { $skip:  skip },
          { $limit: limit },
          { $project: { stockData: 0 } },
        ],
        totalCount: [{ $count: "n" }],
      },
    },
  ];

  const [result] = await ItemModel.aggregate(pipeline);
  const items = result?.items ?? [];
  const total = result?.totalCount?.[0]?.n ?? 0;

  return {
    data: {
      items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    },
  };
});

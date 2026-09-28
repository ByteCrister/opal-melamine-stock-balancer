import { NextRequest } from "next/server";
import { PipelineStage, Types } from "mongoose";
import ConnectDB from "@/config/db";
import ItemModel from "@/models/items.model";
import AuditLogModel, { AuditAction } from "@/models/auditLog.model";
import { withErrorHandler, ApiError } from "@/lib/helpers/withErrorHandler";
import { withTransaction } from "@/lib/helpers/withTransaction";
import { getUserId } from "@/lib/auth/getUserId";
import { createItemSchema } from "@/utils/zod/item.schema";
import { sanitizeSearch } from "@/lib/helpers/sanitize-search";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Extracts label from a DropdownList embedded-array field.
 *
 * For classes  → field is "className"
 * For others   → field is "value"
 *
 * Pattern:
 *   $arrayElemAt: [
 *     { $filter: { input: "$dl.<arrayField>", cond: { $eq: ["$$this._id", <itemField>] } } },
 *     0
 *   ]
 *
 * Then pluck the label key from the matched element.
 */
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
// GET  /api/v1/items
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
  const sort     = searchParams.get("sort")   || "desc";
  const sortBy   = searchParams.get("sortBy") || "createdAt";

  const skip = (page - 1) * limit;
  const sortDir = sort === "asc" ? 1 : -1;

  // ── 1. Initial $match on the Items collection (uses indexes) ──────────────
  const initialMatch: Record<string, unknown> = { deletedAt: null };
  if (search) {
    initialMatch.$or = [
      { itemCode: { $regex: search, $options: "i" } },
      { itemName:  { $regex: search, $options: "i" } },
    ];
  }

  // ── 2. Build pipeline ─────────────────────────────────────────────────────
  const pipeline: PipelineStage[] = [
    { $match: initialMatch },

    // Join the single DropdownList document
    {
      $lookup: {
        from: "dropdownlists",
        pipeline: [{ $limit: 1 }],
        as: "dl",
      },
    },
    { $unwind: { path: "$dl", preserveNullAndEmptyArrays: true } },

    // ── 3. Filter by string names (runs after $lookup so index still used above) ──
    ...(category
      ? [{
          $match: {
            $expr: {
              $gt: [
                {
                  $size: {
                    $filter: {
                      input: { $ifNull: ["$dl.categories", []] },
                      as: "c",
                      cond: {
                        $and: [
                          { $eq: ["$$c._id", "$categoryId"] },
                          { $eq: [{ $toLower: "$$c.value" }, category.toLowerCase()] },
                        ],
                      },
                    },
                  },
                },
                0,
              ],
            },
          },
        } as PipelineStage]
      : []),

    ...(cls
      ? [{
          $match: {
            $expr: {
              $gt: [
                {
                  $size: {
                    $filter: {
                      input: { $ifNull: ["$dl.classes", []] },
                      as: "c",
                      cond: {
                        $and: [
                          { $eq: ["$$c._id", "$classId"] },
                          { $eq: [{ $toLower: "$$c.className" }, cls.toLowerCase()] },
                        ],
                      },
                    },
                  },
                },
                0,
              ],
            },
          },
        } as PipelineStage]
      : []),

    ...(material
      ? [{
          $match: {
            $expr: {
              $gt: [
                {
                  $size: {
                    $filter: {
                      input: { $ifNull: ["$dl.materials", []] },
                      as: "m",
                      cond: {
                        $and: [
                          { $eq: ["$$m._id", "$materialId"] },
                          { $eq: [{ $toLower: "$$m.value" }, material.toLowerCase()] },
                        ],
                      },
                    },
                  },
                },
                0,
              ],
            },
          },
        } as PipelineStage]
      : []),

    // ── 4. Resolve human-readable labels in a single $addFields pass ─────────
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

    // Drop the joined doc — not needed in response
    { $project: { dl: 0 } },

    // ── 5. Facet: data page + total count in ONE round-trip ──────────────────
    {
      $facet: {
        items: [
          { $sort:  { [sortBy]: sortDir } },
          { $skip:  skip },
          { $limit: limit },
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

// ---------------------------------------------------------------------------
// POST  /api/v1/items
// ---------------------------------------------------------------------------
export const POST = withErrorHandler(async (request: NextRequest) => {
  const userId = await getUserId();
  await ConnectDB();

  const payload = await request.json();
  const data = createItemSchema.parse(payload);

  return withTransaction(async (session) => {
    const existingItem = await ItemModel
      .findOne({ itemCode: data.itemCode })
      .select("_id")
      .lean()
      .session(session);

    if (existingItem) {
      throw new ApiError(`Item code "${data.itemCode}" already exists.`, 400);
    }

    const newItem = new ItemModel({ ...data, createdBy: userId });
    await newItem.save({ session });

    await AuditLogModel.create(
      [{
        user:       new Types.ObjectId(userId),
        action:     AuditAction.ITEM_CREATED,
        entityType: "Item",
        entityId:   newItem._id,
        details: {
          itemCode:   newItem.itemCode,
          itemName:   newItem.itemName,
          categoryId: newItem.categoryId,
          classId:    newItem.classId,
        },
      }],
      { session }
    );

    return { data: { success: true, message: "Item created successfully", item: newItem } };
  });
});

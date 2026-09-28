import ConnectDB from "@/config/db";
import ItemModel from "@/models/items.model";
import DropdownListModel from "@/models/dropdown-list.model";
import { withErrorHandler } from "@/lib/helpers/withErrorHandler";
import { getUserId } from "@/lib/auth/getUserId";
import { getCollectionName } from "@/lib/helpers/get-collection-name";

export const GET = withErrorHandler(async () => {
  await getUserId(); // ensure authenticated
  await ConnectDB();

  const dropdownsCol = getCollectionName(DropdownListModel);

  // Aggregate: resolve unitId → unit label from the DropdownList sub-document
  const items = await ItemModel.aggregate([
    { $match: { deletedAt: null } },
    { $sort: { itemCode: 1 } },
    {
      $lookup: {
        from: dropdownsCol,
        pipeline: [{ $limit: 1 }, { $project: { units: 1 } }],
        as: "_ddl",
      },
    },
    {
      $addFields: {
        // Resolve unitId → label string for display and form validation
        unit: {
          $let: {
            vars: {
              matched: {
                $filter: {
                  input: { $arrayElemAt: ["$_ddl.units", 0] },
                  as: "u",
                  cond: { $eq: ["$$u._id", "$unitId"] },
                },
              },
            },
            in: { $ifNull: [{ $arrayElemAt: ["$$matched.value", 0] }, ""] },
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        itemCode: 1,
        itemName: 1,
        unitId: 1,   // ObjectId — available if needed
        unit: 1,     // Resolved label string (e.g. "PCS", "KG")
      },
    },
  ]);

  return {
    data: {
      items,
    },
  };
});

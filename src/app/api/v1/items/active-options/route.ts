import ConnectDB from "@/config/db";
import ItemModel from "@/models/items.model";
import { withErrorHandler } from "@/lib/helpers/withErrorHandler";
import { getUserId } from "@/lib/auth/getUserId";

export const GET = withErrorHandler(async () => {
  await getUserId(); // ensure authenticated
  await ConnectDB();

  // Find all active items, projecting only _id, itemCode, itemName, and unit
  const items = await ItemModel.find({ deletedAt: null })
    .select("_id itemCode itemName unit")
    .sort({ itemCode: 1 })
    .lean();

  return {
    data: {
      items,
    },
  };
});

/**
 * GET /api/test/update-dropdown
 *
 * One-shot migration: stamps a new ObjectId `_id` onto every ClassOption and
 * DropdownItem sub-document in the singleton DropdownList that is currently
 * missing one.
 *
 * ‼️  TEST/MIGRATION ONLY — remove this route once the migration is done.
 *
 * Safe to call multiple times — already-populated sub-documents are skipped.
 */

import ConnectDB from "@/config/db";
import DropdownListModel from "@/models/dropdown-list.model";
import { withErrorHandler, HandlerResult } from "@/lib/helpers/withErrorHandler";
import { Types } from "mongoose";

const ARRAY_KEYS = [
  "classes",
  "units",
  "categories",
  "materials",
  "shapes",
  "stockUnits",
] as const;

export const GET = withErrorHandler(async (): Promise<HandlerResult<Record<string, unknown>>> => {
  await ConnectDB();

  // Fetch the raw document so we can inspect subdoc _id presence
  const doc = await DropdownListModel.findOne().lean();
  if (!doc) {
    return { data: { message: "No DropdownList document found — nothing to migrate." } };
  }

  // Collect $set operations for every subdoc that is missing _id
  const setOps: Record<string, Types.ObjectId> = {};

  for (const key of ARRAY_KEYS) {
    const arr = (doc as Record<string, unknown[]>)[key] ?? [];
    arr.forEach((item, index) => {
      const sub = item as Record<string, unknown>;
      if (!sub._id) {
        setOps[`${key}.${index}._id`] = new Types.ObjectId();
      }
    });
  }

  if (Object.keys(setOps).length === 0) {
    return {
      data: {
        message: "All sub-documents already have _id — nothing to update.",
        migratedCount: 0,
      },
    };
  }

  // Apply all fixes in one atomic update via the native driver
  const collection = DropdownListModel.collection;
  const result = await collection.updateOne(
    { _id: doc._id },
    { $set: setOps }
  );

  return {
    data: {
      message: `Migration complete. ${Object.keys(setOps).length} sub-document(s) updated.`,
      migratedFields: Object.keys(setOps),
      mongoResult: {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
      },
    },
  };
});

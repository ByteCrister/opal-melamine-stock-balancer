// models/stock-movements.model.ts — merges Stock In + Stock Out
import { STOCK_MOVEMENT_TYPE, StockMovementType } from "@/const/stock.const";
import { Schema, model, models, Document, Types } from "mongoose";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Interface
// ---------------------------------------------------------------------------

export interface IStockMovement extends Document {
  date:      Date;
  itemId:    Types.ObjectId;   // ref → Item
  quantity:  number;
  type:      StockMovementType;
  remarks?:  string;

  // Audit
  /** Admin who recorded this movement */
  createdBy: Types.ObjectId;

  // Soft delete
  /**
   * Null = active movement.
   * Filled = voided/cancelled entry (kept for audit trail; excluded from balance calcs).
   */
  deletedAt: Date | null;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const StockMovementSchema = new Schema<IStockMovement>(
  {
    date:     { type: Date, required: true },
    itemId:   { type: Schema.Types.ObjectId, ref: "Item", required: true },
    quantity: { type: Number, required: true, min: 0 },
    type:     { type: String, enum: [STOCK_MOVEMENT_TYPE.STOCK_IN, STOCK_MOVEMENT_TYPE.STOCK_OUT], required: true },
    remarks:  { type: String, trim: true },

    // Audit
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },

    // Soft delete
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// ---------------------------------------------------------------------------
// Indexes
// ---------------------------------------------------------------------------

/**
 * Most common query: stock ledger for a single item, newest first.
 * Covers:  StockMovement.find({ itemId, deletedAt: null }).sort({ date: -1 })
 */
StockMovementSchema.index(
  { itemId: 1, deletedAt: 1, date: -1 },
  { name: "idx_item_ledger" }
);

/**
 * Stock balance aggregation per item (group by itemId, filter active).
 * Covers:  aggregate([{ $match: { itemId, deletedAt: null } }, { $group: … }])
 */
StockMovementSchema.index(
  { itemId: 1, deletedAt: 1, type: 1 },
  { name: "idx_item_balance" }
);

/**
 * Date-range report: all movements in a date window (e.g., daily/weekly report).
 * Covers:  find({ deletedAt: null, date: { $gte, $lte } })
 */
StockMovementSchema.index(
  { deletedAt: 1, date: -1 },
  { name: "idx_date_range" }
);

/**
 * Movement-type filter: list all INs or all OUTs in a period.
 * Covers:  find({ type, deletedAt: null, date: { $gte, $lte } })
 */
StockMovementSchema.index(
  { deletedAt: 1, type: 1, date: -1 },
  { name: "idx_type_date" }
);

/** Audit: movements recorded by a specific admin */
StockMovementSchema.index({ createdBy: 1 }, { name: "idx_created_by" });

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export default models.StockMovement ||
  model<IStockMovement>("StockMovement", StockMovementSchema);
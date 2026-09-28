// models/items.model.ts
import { Schema, model, models, Document, Types } from "mongoose";

// ---------------------------------------------------------------------------
// Interface
// ---------------------------------------------------------------------------

export interface IItem extends Document {
  itemCode:     string;
  itemName:     string;
  classId?:     Types.ObjectId; // ref → DropdownList class _id
  categoryId:   Types.ObjectId; // ref → DropdownList category _id
  materialId?:  Types.ObjectId; // ref → DropdownList material _id
  shapeId?:     Types.ObjectId; // ref → DropdownList shape _id
  size:         string;
  color:        string;
  design:       string;
  unitId:       Types.ObjectId; // ref → DropdownList unit _id
  reorderLevel: number;
  dp:           number;   // dealer price
  tp:           number;   // trade price
  mrp:          number;
  doUnitId?:    Types.ObjectId; // ref → DropdownList unit _id
  doQty:        number;

  // Audit
  /** Admin who created this item record */
  createdBy: Types.ObjectId;

  // Soft delete
  /** Null = active. Filled = soft-deleted (preserves historical stock movements). */
  deletedAt: Date | null;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const ItemSchema = new Schema<IItem>(
  {
    itemCode:     { type: String, required: true, unique: true, trim: true, uppercase: true },
    itemName:     { type: String, required: true, trim: true },
    classId:      { type: Schema.Types.ObjectId },
    categoryId:   { type: Schema.Types.ObjectId, required: true },
    materialId:   { type: Schema.Types.ObjectId },
    shapeId:      { type: Schema.Types.ObjectId },
    size:         { type: String, trim: true },
    color:        { type: String, trim: true },
    design:       { type: String, trim: true },
    unitId:       { type: Schema.Types.ObjectId, required: true },
    reorderLevel: { type: Number, default: 0, min: 0 },
    dp:           { type: Number, min: 0 },
    tp:           { type: Number, min: 0 },
    mrp:          { type: Number, min: 0 },
    doUnitId:     { type: Schema.Types.ObjectId },
    doQty:        { type: Number, min: 0 },

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
 * Full-text search index.
 * Allows:  Item.find({ $text: { $search: "OPAL plate" } })
 * Covers:  item code, item name — the fields users type in search boxes.
 */
ItemSchema.index(
  { itemCode: "text", itemName: "text" },
  { name: "item_search_text", weights: { itemCode: 10, itemName: 5 } }
);

/** Primary item listing: only active items, sorted by code */
ItemSchema.index({ deletedAt: 1, itemCode: 1 }, { name: "idx_active_by_code" });

/** Filter panel: class → then code */
ItemSchema.index({ deletedAt: 1, classId: 1, itemCode: 1 }, { name: "idx_active_by_class" });

/** Filter panel: category → then code */
ItemSchema.index({ deletedAt: 1, categoryId: 1, itemCode: 1 }, { name: "idx_active_by_category" });

/** Filter panel: material filter */
ItemSchema.index({ deletedAt: 1, materialId: 1 }, { name: "idx_active_by_material" });

/** Reorder-level alert queries */
ItemSchema.index({ deletedAt: 1, reorderLevel: 1 }, { name: "idx_reorder_check" });

/** Audit: see which items a specific admin created */
ItemSchema.index({ createdBy: 1 }, { name: "idx_created_by" });

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export default models.Item || model<IItem>("Item", ItemSchema);
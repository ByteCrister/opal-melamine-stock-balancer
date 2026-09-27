// models/items.model.ts
import { Schema, model, models, Document, Types } from "mongoose";

// ---------------------------------------------------------------------------
// Interface
// ---------------------------------------------------------------------------

export interface IItem extends Document {
  itemCode:     string;
  itemName:     string;
  classCode:    string;   // ref → DropdownList class code
  className:    string;   // auto-filled from classCode
  category:     string;
  material:     string;
  shape:        string;
  size:         string;
  color:        string;
  design:       string;
  unit:         string;
  reorderLevel: number;
  dp:           number;   // dealer price
  tp:           number;   // trade price
  mrp:          number;
  doUnit:       string;
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
    classCode:    { type: String, trim: true },
    className:    { type: String, trim: true },
    category:     { type: String, required: true, trim: true },
    material:     { type: String, trim: true },
    shape:        { type: String, trim: true },
    size:         { type: String, trim: true },
    color:        { type: String, trim: true },
    design:       { type: String, trim: true },
    unit:         { type: String, required: true, trim: true },
    reorderLevel: { type: Number, default: 0, min: 0 },
    dp:           { type: Number, min: 0 },
    tp:           { type: Number, min: 0 },
    mrp:          { type: Number, min: 0 },
    doUnit:       { type: String, trim: true },
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
 * Covers:  item code, item name, class name — the three fields users type in search boxes.
 */
ItemSchema.index(
  { itemCode: "text", itemName: "text", className: "text" },
  { name: "item_search_text", weights: { itemCode: 10, itemName: 5, className: 3 } }
);

/** Primary item listing: only active items, sorted by code */
ItemSchema.index({ deletedAt: 1, itemCode: 1 }, { name: "idx_active_by_code" });

/** Filter panel: class → then code */
ItemSchema.index({ deletedAt: 1, classCode: 1, itemCode: 1 }, { name: "idx_active_by_class" });

/** Filter panel: category → then code */
ItemSchema.index({ deletedAt: 1, category: 1, itemCode: 1 }, { name: "idx_active_by_category" });

/** Filter panel: material filter */
ItemSchema.index({ deletedAt: 1, material: 1 }, { name: "idx_active_by_material" });

/** Reorder-level alert queries */
ItemSchema.index({ deletedAt: 1, reorderLevel: 1 }, { name: "idx_reorder_check" });

/** Audit: see which items a specific admin created */
ItemSchema.index({ createdBy: 1 }, { name: "idx_created_by" });

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export default models.Item || model<IItem>("Item", ItemSchema);
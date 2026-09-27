// models/dropdown-list.model.ts — one doc per list type, or one doc holding all lists
import { Schema, model, models, Document, Types } from "mongoose";

// ---------------------------------------------------------------------------
// Sub-document interface
// ---------------------------------------------------------------------------

export interface IClassOption {
  code: string;      // e.g. RC2280010
  className: string; // e.g. OPAL Plate
}

// ---------------------------------------------------------------------------
// Interface
// ---------------------------------------------------------------------------

export interface IDropdownList extends Document {
  classes:    IClassOption[];
  units:      string[];
  categories: string[];
  materials:  string[];
  shapes:     string[];
  stockUnits: string[];

  // Audit
  /** Admin who created / last updated this list document */
  createdBy: Types.ObjectId;

  // Soft delete (rare, but keeps the audit pattern consistent)
  deletedAt: Date | null;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const DropdownListSchema = new Schema<IDropdownList>(
  {
    classes:    [{ code: String, className: String }],
    units:      [String],
    categories: [String],
    materials:  [String],
    shapes:     [String],
    stockUnits: [String],

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

/** Filter active list documents (the collection is usually a singleton, but still) */
DropdownListSchema.index({ deletedAt: 1 });

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export default models.DropdownList || model<IDropdownList>("DropdownList", DropdownListSchema);
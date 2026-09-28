// models/dropdown-list.model.ts — one doc per list type, or one doc holding all lists
import { Schema, model, models, Document, Types } from "mongoose";

// ---------------------------------------------------------------------------
// Sub-document interfaces
// ---------------------------------------------------------------------------

export interface IClassOption {
  _id: Types.ObjectId;
  code: string;      // e.g. RC2280010
  className: string; // e.g. OPAL Plate
  deletedAt: Date | null;
}

export interface IDropdownItem {
  _id: Types.ObjectId;
  value: string;
  deletedAt: Date | null;
}

// ---------------------------------------------------------------------------
// Interface
// ---------------------------------------------------------------------------

export interface IDropdownList extends Document {
  classes:    IClassOption[];
  units:      IDropdownItem[];
  categories: IDropdownItem[];
  materials:  IDropdownItem[];
  shapes:     IDropdownItem[];
  stockUnits: IDropdownItem[];

  // Audit
  createdBy: Types.ObjectId;

  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const DropdownItemSchema = new Schema<IDropdownItem>(
  {
    value: { type: String, required: true },
    deletedAt: { type: Date, default: null }
  },
  { _id: true }
);

const ClassOptionSchema = new Schema<IClassOption>(
  {
    code: { type: String, required: true },
    className: { type: String, required: true },
    deletedAt: { type: Date, default: null }
  },
  { _id: true }
);

const DropdownListSchema = new Schema<IDropdownList>(
  {
    classes:    [ClassOptionSchema],
    units:      [DropdownItemSchema],
    categories: [DropdownItemSchema],
    materials:  [DropdownItemSchema],
    shapes:     [DropdownItemSchema],
    stockUnits: [DropdownItemSchema],

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

DropdownListSchema.index({ deletedAt: 1 });

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export default models.DropdownList || model<IDropdownList>("DropdownList", DropdownListSchema);
// models/user.model.ts
import { Schema, model, models, Document, Types } from "mongoose";

// ---------------------------------------------------------------------------
// Interface
// ---------------------------------------------------------------------------

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;

  // Audit
  /** The user who created this account (null for the first/self-bootstrapped admin) */
  createdBy: Types.ObjectId | null;

  // Soft delete
  /** Null = active. Filled = soft-deleted (do not hard-delete users). */
  deletedAt: Date | null;

  // Timestamps (auto by mongoose)
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const UserSchema = new Schema<IUser>(
  {
    name:         { type: String, required: true, trim: true },
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },

    // Audit — self-reference; null for the bootstrap admin
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },

    // Soft delete
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// ---------------------------------------------------------------------------
// Indexes
// ---------------------------------------------------------------------------

// email is already uniquely indexed via `unique: true` above.
// Additional indexes:

/** Fast lookup of active (non-deleted) users */
UserSchema.index({ deletedAt: 1 });

/** Admin user-list page: sort/filter by name among active users */
UserSchema.index({ deletedAt: 1, name: 1 });

/** Audit trail: who created whom */
UserSchema.index({ createdBy: 1 });

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export default models.User || model<IUser>("User", UserSchema);
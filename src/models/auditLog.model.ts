import { Schema, model, models, Document, Types } from "mongoose";

// ---------------------------------------------------------------------------
// Enums & Types
// ---------------------------------------------------------------------------

/**
 * Standardized audit actions for Opal Melamine Stock Balancer.
 * Expand this enum as new features are built.
 */
export enum AuditAction {
    // Auth
    LOGIN_SUCCESS      = "LOGIN_SUCCESS",
    LOGIN_FAILED       = "LOGIN_FAILED",
    LOGOUT             = "LOGOUT",

    // User Management
    USER_CREATED       = "USER_CREATED",
    USER_UPDATED       = "USER_UPDATED",
    USER_DELETED       = "USER_DELETED",

    // Inventory Items
    ITEM_CREATED       = "ITEM_CREATED",
    ITEM_UPDATED       = "ITEM_UPDATED",
    ITEM_DELETED       = "ITEM_DELETED",

    // Stock Movements
    STOCK_RECEIVED     = "STOCK_RECEIVED",
    STOCK_DISPATCHED   = "STOCK_DISPATCHED",
    STOCK_ADJUSTED     = "STOCK_ADJUSTED",
    STOCK_REVERTED     = "STOCK_REVERTED",

    // Dropdowns
    DROPDOWN_UPDATED   = "DROPDOWN_UPDATED",
}

// ---------------------------------------------------------------------------
// Interface
// ---------------------------------------------------------------------------

export interface IAuditLog extends Document {
    /** The user who performed the action (null if anonymous/system) */
    user: Types.ObjectId | null;

    /** The specific action performed */
    action: AuditAction;

    /** The collection/entity affected (e.g., "Item", "User") */
    entityType?: string;

    /** The exact document ID affected */
    entityId?: Types.ObjectId;

    /** Arbitrary metadata (e.g., previous values vs new values, reason for adjustment) */
    details: Record<string, any>;

    /** Security context */
    ipAddress?: string;
    userAgent?: string;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const AuditLogSchema = new Schema<IAuditLog>(
    {
        user: { 
            type: Schema.Types.ObjectId, 
            ref: "User", 
            default: null,
            index: true 
        },
        action: { 
            type: String, 
            enum: Object.values(AuditAction), 
            required: true,
            index: true
        },
        entityType: { 
            type: String, 
            trim: true 
        },
        entityId: { 
            type: Schema.Types.ObjectId 
        },
        details: { 
            type: Schema.Types.Mixed, 
            default: {} 
        },
        ipAddress: { 
            type: String 
        },
        userAgent: { 
            type: String 
        },
    },
    { 
        timestamps: true,
        // Capped collections or TTL indexes are often used for logs,
        // but for an inventory system, persistent audit trails are required.
    }
);

// ---------------------------------------------------------------------------
// Indexes
// ---------------------------------------------------------------------------

// 1. Find all actions performed by a specific user (already handled by index: true on `user`)

// 2. Find all history for a specific entity (e.g., "Show me the history of Item X")
AuditLogSchema.index({ entityType: 1, entityId: 1 });

// 3. Time-based queries (e.g., "Show me all actions in the last 24 hours")
AuditLogSchema.index({ createdAt: -1 });

// 4. Combined lookup: "Show me all stock adjustments by User Y this week"
AuditLogSchema.index({ user: 1, action: 1, createdAt: -1 });

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export default models.AuditLog || model<IAuditLog>("AuditLog", AuditLogSchema);

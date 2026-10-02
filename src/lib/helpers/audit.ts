import { NextRequest } from "next/server";
import { Types, ClientSession } from "mongoose";
import AuditLogModel, { AuditAction } from "@/models/auditLog.model";

export interface AuditPayload {
  user: Types.ObjectId | string | null;
  action: AuditAction;
  entityType?: string;
  entityId?: Types.ObjectId | string;
  details?: Record<string, any>;
}

/**
 * Helper to create an audit log record and capture the correct IP address
 * from the Next.js request headers.
 */
export async function createAuditLog(
  request: NextRequest,
  payload: AuditPayload,
  session?: ClientSession
) {
  // Extract IP Address correctly behind proxies
  const forwardedFor = request.headers.get("x-forwarded-for");
  let ipAddress: string | undefined;

  if (forwardedFor) {
    ipAddress = forwardedFor.split(",")[0].trim();
  } else if (request.headers.get("x-real-ip")) {
    ipAddress = request.headers.get("x-real-ip") || undefined;
  }

  const userAgent = request.headers.get("user-agent") || undefined;

  return AuditLogModel.create(
    [
      {
        user: payload.user ? new Types.ObjectId(payload.user) : null,
        action: payload.action,
        entityType: payload.entityType,
        entityId: payload.entityId ? new Types.ObjectId(payload.entityId) : undefined,
        details: payload.details || {},
        ipAddress,
        userAgent,
      },
    ],
    { session }
  );
}

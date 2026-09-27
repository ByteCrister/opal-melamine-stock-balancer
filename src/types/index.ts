// src/types/index.ts

export interface User {
    _id: string;
    name: string;
    email: string;
    role: "admin" | "editor" | "viewer";
    status: "active" | "inactive" | "suspended";
    createdAt: string;
    updatedAt: string;
}

export interface AuditLog {
    _id: string;
    userId: string;
    userName: string;
    action: string;
    entity: string;
    entityId?: string;
    details: Record<string, unknown>;
    ipAddress?: string;
    createdAt: string;
}

export interface PaginatedResponse<T> {
    data: {
        items: T[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    };
}

export interface ApiError {
    error: string;
}

export * from './item.types';
export * from './dropdown.types';

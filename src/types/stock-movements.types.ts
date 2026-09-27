import { StockMovementType } from "@/const/stock.const";

export interface StockMovement {
  _id: string;
  date: string;
  itemCode: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unit: string;
  type: StockMovementType;
  remarks?: string;

  createdBy: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovementsResponse {
  items: StockMovement[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface StockMovementFilters {
  search?: string;
  page?: number;
  limit?: number;
  sort?: "asc" | "desc";
  sortBy?: string;
}

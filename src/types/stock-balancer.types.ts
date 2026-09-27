import { IItem } from "@/models/items.model";

export interface StockBalance extends Omit<IItem, "_id" | "createdAt" | "updatedAt" | "deletedAt" | "createdBy"> {
  _id: string;
  totalIn: number;
  totalOut: number;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface StockBalancerResponse {
  items: StockBalance[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

import { Item } from "@/types/item.types";

export interface StockBalance extends Item {
  totalIn: number;
  totalOut: number;
  balance: number;
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

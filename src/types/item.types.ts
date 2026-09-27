export interface Item {
  _id: string;
  itemCode: string;
  itemName: string;
  classCode?: string;
  className?: string;
  category: string;
  material?: string;
  shape?: string;
  size?: string;
  color?: string;
  design?: string;
  unit: string;
  reorderLevel: number;
  dp?: number;
  tp?: number;
  mrp?: number;
  doUnit?: string;
  doQty?: number;
  
  createdBy: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ItemsResponse {
  items: Item[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ItemFilters {
  search?: string;
  category?: string;
  classCode?: string;
  material?: string;
  page?: number;
  limit?: number;
  sort?: "asc" | "desc";
  sortBy?: string;
}

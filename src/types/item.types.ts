export interface Item {
  _id: string;
  itemCode: string;
  itemName: string;
  classId?: string;
  className?: string;
  categoryId: string;
  categoryName?: string;
  materialId?: string;
  materialName?: string;
  shapeId?: string;
  shapeName?: string;
  size?: string;
  color?: string;
  design?: string;
  unitId: string;
  unitName?: string;
  reorderLevel: number;
  dp?: number;
  tp?: number;
  mrp?: number;
  doUnitId?: string;
  doUnitName?: string;
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
  class?: string;
  material?: string;
  page?: number;
  limit?: number;
  sort?: "asc" | "desc";
  sortBy?: string;
}

// src/types/dashboard.types.ts

/** KPI summary returned by the dashboard API */
export interface DashboardKPIs {
  totalProducts: number;
  activeProducts: number;
  totalStockIn: number;
  totalStockOut: number;
  stockBalance: number;
  lowStockItems: number;
  /** Percentage change vs previous period (positive = up, negative = down) */
  stockInChange: number;
  stockOutChange: number;
  balanceChange: number;
}

/** One data point in a time-series chart */
export interface StockTrendPoint {
  date: string; // ISO date string (YYYY-MM-DD)
  stockIn: number;
  stockOut: number;
  balance: number;
}

/** One data point for the category breakdown chart */
export interface CategoryBreakdown {
  category: string;
  stockIn: number;
  stockOut: number;
  balance: number;
  itemCount: number;
}

/** One data point for the top-movers chart */
export interface TopMoverItem {
  itemCode: string;
  itemName: string;
  quantity: number;
  unit: string;
  type: "IN" | "OUT";
}

/** Dashboard API response shape */
export interface DashboardData {
  kpis: DashboardKPIs;
  trend: StockTrendPoint[];
  categoryBreakdown: CategoryBreakdown[];
  topStockIn: TopMoverItem[];
  topStockOut: TopMoverItem[];
  recentActivity: RecentActivityEntry[];
}

/** A recent stock movement entry */
export interface RecentActivityEntry {
  _id: string;
  date: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  unit: string;
  type: "IN" | "OUT";
  remarks?: string;
}

/** Date filter state for the dashboard */
export interface DashboardDateFilter {
  from: Date;
  to: Date;
}

/** Query params sent to the API */
export interface DashboardQueryParams {
  from: string; // ISO string
  to: string;   // ISO string
  isInitialCall?: boolean;
}

/** Period comparison labels */
export type ComparisonPeriod = "7d" | "30d" | "90d" | "custom";

"use client";

import { useState } from "react";
import { useDashboard } from "@/hooks/queries/useDashboard";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { KPICard } from "@/components/dashboard/KPICard";
import { StockTrendChart } from "@/components/dashboard/StockTrendChart";
import { CategoryChart } from "@/components/dashboard/CategoryChart";
import { CategoryBarChart } from "@/components/dashboard/CategoryBarChart";
import { TopMoversChart } from "@/components/dashboard/TopMoversChart";
import { RecentActivityTable } from "@/components/dashboard/RecentActivityTable";
import { DateFilterBar } from "@/components/dashboard/DateFilterBar";
import { SharedBreadcrumb } from "@/components/shared/SharedBreadcrumb";
import { DashboardDateFilter } from "@/types/dashboard.types";
import { DEFAULT_DATE_FILTER } from "@/const/dashboard.const";
import {
  Package2,
  PackageCheck,
  ArrowDownToLine,
  ArrowUpFromLine,
  Scale,
  AlertTriangle,
} from "lucide-react";

/**
 * Main dashboard content.
 * Orchestrates data fetching via TanStack Query and renders all sections.
 */
export function DashboardContent() {
  const [dateFilter, setDateFilter] = useState<DashboardDateFilter>(DEFAULT_DATE_FILTER);
  const [isInitialCall] = useState(true);

  const { data, isLoading, isError, error, refetch, isFetching } = useDashboard(
    dateFilter.from,
    dateFilter.to,
    isInitialCall
  );

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return (
      <div className="glass-panel p-8 flex flex-col items-center justify-center gap-3 text-center min-h-[300px]">
        <AlertTriangle className="h-8 w-8" style={{ color: "var(--color-status-danger)" }} />
        <p className="font-medium" style={{ color: "var(--text-primary)", fontFamily: "var(--font-geist)" }}>
          Failed to load dashboard
        </p>
        <p className="text-sm" style={{ color: "var(--text-muted)", maxWidth: 400 }}>
          {error?.message || "An unexpected error occurred. Please try again."}
        </p>
        <button
          onClick={() => refetch()}
          className="btn-primary px-5 py-2 text-sm mt-2"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  const { kpis, trend, categoryBreakdown, topStockIn, topStockOut, recentActivity } = data;

  return (
    <div className="flex flex-col gap-6">
      <SharedBreadcrumb items={[{ label: "Dashboard" }]} />

      {/* Page Header */}
      <div className="relative flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div>
          <h1
            className="font-semibold tracking-tight"
            style={{
              fontFamily: "var(--font-geist)",
              fontSize: "var(--text-display-md)",
              color: "var(--text-primary)",
              letterSpacing: "var(--tracking-tight)",
            }}
          >
            Dashboard
          </h1>
          <p style={{ fontSize: "var(--text-body-md)", color: "var(--text-secondary)" }} className="mt-0.5">
            Overview of your stock movements and inventory health
          </p>
        </div>

        {/* Date Filter — relative-positioned container so dropdown can escape */}
        <div className="relative flex-shrink-0">
          <DateFilterBar
            value={dateFilter}
            onChange={setDateFilter}
            onRefresh={() => refetch()}
            isLoading={isFetching}
          />
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <KPICard
          title="Stock Balance"
          value={kpis.stockBalance}
          change={kpis.balanceChange}
          icon={Scale}
          featured
          className="col-span-2 sm:col-span-1"
        />
        <KPICard
          title="Total Products"
          value={kpis.totalProducts}
          subtitle={`${kpis.activeProducts} active`}
          icon={Package2}
        />
        <KPICard
          title="Active Products"
          value={kpis.activeProducts}
          icon={PackageCheck}
        />
        <KPICard
          title="Stock In"
          value={kpis.totalStockIn}
          change={kpis.stockInChange}
          subtitle="this period"
          icon={ArrowDownToLine}
        />
        <KPICard
          title="Stock Out"
          value={kpis.totalStockOut}
          change={kpis.stockOutChange}
          subtitle="this period"
          icon={ArrowUpFromLine}
        />
        <KPICard
          title="Low Stock"
          value={kpis.lowStockItems}
          subtitle="items at risk"
          icon={AlertTriangle}
        />
      </div>

      {/* Trend + Donut Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <StockTrendChart data={trend} />
        </div>
        <CategoryChart data={categoryBreakdown} />
      </div>

      {/* Category Bar Chart */}
      <CategoryBarChart data={categoryBreakdown} />

      {/* Top Movers */}
      <TopMoversChart stockIn={topStockIn} stockOut={topStockOut} />

      {/* Recent Activity */}
      <RecentActivityTable data={recentActivity} />
    </div>
  );
}

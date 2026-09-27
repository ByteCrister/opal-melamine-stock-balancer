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
import { FadeInUp, ScaleIn, StaggerContainer, StaggerItem } from "@/components/shared/motion";
import {
  Package2,
  PackageCheck,
  ArrowDownToLine,
  ArrowUpFromLine,
  Scale,
  AlertTriangle,
  RefreshCw,
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
      <div
        className="relative overflow-hidden rounded-[var(--radius-xl)] p-12 flex flex-col items-center justify-center gap-4 text-center"
        style={{
          background: "var(--card-bg)",
          backgroundImage: "var(--card-bg-overlay)",
          border: "1px solid var(--border-crimson)",
          boxShadow: "var(--glow-card-crimson)",
          minHeight: 320,
        }}
      >
        <div
          className="h-14 w-14 rounded-2xl flex items-center justify-center"
          style={{ background: "var(--badge-danger-bg)", border: "1px solid var(--badge-danger-border)" }}
        >
          <AlertTriangle className="h-7 w-7" style={{ color: "var(--color-status-danger)" }} />
        </div>
        <div className="flex flex-col gap-1.5">
          <p
            className="font-semibold"
            style={{ fontFamily: "var(--font-geist)", fontSize: "var(--text-heading-md)", color: "var(--text-primary)" }}
          >
            Failed to load dashboard
          </p>
          <p style={{ fontSize: "var(--text-body-sm)", color: "var(--text-muted)", maxWidth: 380 }}>
            {error?.message || "An unexpected error occurred. Please try again."}
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm mt-1"
        >
          <RefreshCw className="h-3.5 w-3.5" />
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

      {/* ── Page Header ────────────────────────────────────────────── */}
      <FadeInUp delay={0.05} duration={0.5}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div className="flex flex-col gap-1">
            <h1
              style={{
                fontFamily: "var(--font-geist)",
                fontSize: "var(--text-display-md)",
                fontWeight: 700,
                color: "var(--text-primary)",
                letterSpacing: "var(--tracking-tight)",
                lineHeight: "var(--leading-display-md)",
              }}
            >
              Dashboard
            </h1>
            <p style={{ fontSize: "var(--text-body-md)", color: "var(--text-secondary)" }}>
              Real-time overview of stock movements &amp; inventory health
            </p>
          </div>

          {/* Date Filter — relative so dropdown can escape */}
          <div className="relative flex-shrink-0 self-start">
            <DateFilterBar
              value={dateFilter}
              onChange={setDateFilter}
              onRefresh={() => refetch()}
              isLoading={isFetching}
            />
          </div>
        </div>
      </FadeInUp>

      {/* ── KPI Grid ────────────────────────────────────────────────── */}
      <StaggerContainer delay={0.1} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StaggerItem className="col-span-2 sm:col-span-1">
          <KPICard
            title="Stock Balance"
            value={kpis.stockBalance}
            change={kpis.balanceChange}
            icon={Scale}
            featured
          />
        </StaggerItem>
        <StaggerItem><KPICard title="Total Products"   value={kpis.totalProducts}  subtitle={`${kpis.activeProducts} active`} icon={Package2} /></StaggerItem>
        <StaggerItem><KPICard title="Active Products"  value={kpis.activeProducts}  icon={PackageCheck} /></StaggerItem>
        <StaggerItem><KPICard title="Stock In"         value={kpis.totalStockIn}   change={kpis.stockInChange}  subtitle="this period" icon={ArrowDownToLine} /></StaggerItem>
        <StaggerItem><KPICard title="Stock Out"        value={kpis.totalStockOut}  change={kpis.stockOutChange} subtitle="this period" icon={ArrowUpFromLine} /></StaggerItem>
        <StaggerItem><KPICard title="Low Stock"        value={kpis.lowStockItems}  subtitle="items at risk"     icon={AlertTriangle} /></StaggerItem>
      </StaggerContainer>

      {/* ── Trend + Donut ───────────────────────────────────────────── */}
      <FadeInUp delay={0.25} duration={0.5}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <StockTrendChart data={trend} />
          </div>
          <CategoryChart data={categoryBreakdown} />
        </div>
      </FadeInUp>

      {/* ── Category Bar Chart ──────────────────────────────────────── */}
      <ScaleIn delay={0.35} duration={0.5}>
        <CategoryBarChart data={categoryBreakdown} />
      </ScaleIn>

      {/* ── Top Movers ──────────────────────────────────────────────── */}
      <FadeInUp delay={0.45} duration={0.5}>
        <TopMoversChart stockIn={topStockIn} stockOut={topStockOut} />
      </FadeInUp>

      {/* ── Recent Activity ─────────────────────────────────────────── */}
      <FadeInUp delay={0.55} duration={0.5}>
        <RecentActivityTable data={recentActivity} />
      </FadeInUp>
    </div>
  );
}

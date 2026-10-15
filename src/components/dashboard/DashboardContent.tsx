"use client";

import { useState } from "react";
import Link from "next/link";
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
  Plus,
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
        <div className="flex flex-col gap-4 sm:gap-5">
          {/* Top Row: Page Title + Executive Quick Action CTA */}
          <div className="flex items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2.5">
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
                <span
                  className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide"
                  style={{
                    background: "rgba(47,191,113,0.12)",
                    color: "var(--color-status-success)",
                    border: "1px solid rgba(47,191,113,0.22)",
                  }}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-status-success)] animate-pulse" />
                  Live
                </span>
              </div>
              <p style={{ fontSize: "var(--text-body-md)", color: "var(--text-secondary)" }}>
                Real-time overview of stock movements &amp; inventory health
              </p>
            </div>

            {/* Quick Action Button — Modern, sleek & responsive for all screens */}
            <Link href="/items/new" className="group shrink-0">
              <button
                type="button"
                className="relative overflow-hidden inline-flex items-center gap-2 sm:gap-2.5 px-3.5 py-2 sm:px-4.5 sm:py-2.5 rounded-[11px] text-[13px] sm:text-[13.5px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-crimson-400)] focus-visible:ring-offset-2 cursor-pointer select-none"
                style={{
                  backgroundImage: "linear-gradient(180deg, #FF3B57 0%, #C41230 100%)",
                  border: "1px solid rgba(255, 255, 255, 0.22)",
                  boxShadow:
                    "inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 2px 8px rgba(227, 28, 61, 0.35), 0 8px 20px rgba(227, 28, 61, 0.2)",
                  color: "#FFFFFF",
                }}
              >
                {/* Subtle glass sheen overlay */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-[10px] bg-gradient-to-t from-transparent via-white/5 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                />

                {/* Frosted Icon Badge */}
                <span
                  className="flex items-center justify-center h-5 w-5 rounded-[6px] shrink-0 transition-transform duration-300 group-hover:rotate-90"
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    border: "1px solid rgba(255, 255, 255, 0.25)",
                    boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <Plus className="h-3.5 w-3.5" strokeWidth={2.75} style={{ color: "#FFFFFF" }} />
                </span>

                <span style={{ color: "#FFFFFF", letterSpacing: "-0.01em" }}>
                  New Item
                </span>
              </button>
            </Link>
          </div>

          {/* Controls Row: Date Filter Toolbar */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="relative w-full sm:w-auto">
              <DateFilterBar
                value={dateFilter}
                onChange={setDateFilter}
                onRefresh={() => refetch()}
                isLoading={isFetching}
              />
            </div>
          </div>
        </div>
      </FadeInUp>

      {/* ── KPI Grid ────────────────────────────────────────────────── */}
      <StaggerContainer delay={0.1} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StaggerItem className="col-span-2 sm:col-span-1 flex">
          <KPICard
            title="Stock Balance"
            value={kpis.stockBalance}
            change={kpis.balanceChange}
            icon={Scale}
            featured
            className="h-full w-full"
          />
        </StaggerItem>
        <StaggerItem className="flex"><KPICard title="Total Products"   value={kpis.totalProducts}  subtitle={`${kpis.activeProducts} active`} icon={Package2}        className="h-full w-full" /></StaggerItem>
        <StaggerItem className="flex"><KPICard title="Active Products"  value={kpis.activeProducts}                                            icon={PackageCheck}     className="h-full w-full" /></StaggerItem>
        <StaggerItem className="flex"><KPICard title="Stock In"         value={kpis.totalStockIn}   change={kpis.stockInChange}  subtitle="this period" icon={ArrowDownToLine} className="h-full w-full" /></StaggerItem>
        <StaggerItem className="flex"><KPICard title="Stock Out"        value={kpis.totalStockOut}  change={kpis.stockOutChange} subtitle="this period" icon={ArrowUpFromLine} className="h-full w-full" /></StaggerItem>
        <StaggerItem className="flex"><KPICard title="Low Stock"        value={kpis.lowStockItems}  subtitle="items at risk"                   icon={AlertTriangle}   className="h-full w-full" /></StaggerItem>
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

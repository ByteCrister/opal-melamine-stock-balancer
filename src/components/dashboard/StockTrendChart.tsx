"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { StockTrendPoint } from "@/types/dashboard.types";
import { CHART_COLORS, CHART_TICK_STYLE, CHART_GRID_STYLE } from "@/const/dashboard.const";
import { format, parseISO } from "date-fns";
import { TrendingUp } from "lucide-react";

interface StockTrendChartProps {
  data: StockTrendPoint[];
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--popover-bg)",
        border: "1px solid var(--popover-border)",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--popover-shadow)",
        padding: "10px 14px",
        minWidth: 160,
      }}
    >
      <p
        className="mb-2.5 font-semibold"
        style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.04em", textTransform: "uppercase" }}
      >
        {label ? (() => { try { return format(parseISO(label), "MMM d, yyyy"); } catch { return label; } })() : ""}
      </p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-8 mb-1">
          <span className="flex items-center gap-1.5" style={{ fontSize: 12, color: "var(--text-secondary)" }}>
            <span className="inline-block h-2 w-2 rounded-full shrink-0" style={{ background: p.color }} />
            {p.name}
          </span>
          <span className="font-semibold tabular-nums" style={{ fontSize: 12, color: "var(--text-primary)" }}>
            {p.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export function StockTrendChart({ data }: StockTrendChartProps) {
  const formatted = data.map((d) => ({
    ...d,
    label: d.date,
    displayDate: format(parseISO(d.date), "MMM d"),
  }));

  return (
    <div
      className="relative overflow-hidden flex flex-col gap-5 h-full"
      style={{
        background: "var(--card-bg)",
        backgroundImage: "var(--card-bg-overlay)",
        border: "1px solid var(--card-border)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--card-shadow)",
        padding: "20px 20px 16px",
      }}
    >
      {/* Top gloss */}
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent 0%, var(--border-strong) 50%, transparent 100%)" }}
      />

      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <div
              className="h-6 w-6 rounded-md flex items-center justify-center"
              style={{ background: "var(--badge-info-bg)", border: "1px solid var(--badge-info-border)" }}
            >
              <TrendingUp className="h-3.5 w-3.5" style={{ color: "var(--badge-info-text)" }} />
            </div>
            <h3
              style={{
                fontFamily: "var(--font-geist)",
                fontSize: "var(--text-heading-md)",
                fontWeight: 600,
                color: "var(--text-primary)",
              }}
            >
              Stock Movement Trend
            </h3>
          </div>
          <p style={{ fontSize: "var(--text-body-sm)", color: "var(--text-muted)" }}>
            Daily stock in vs. out over selected period
          </p>
        </div>

        {/* Live series legend pills */}
        <div className="flex items-center gap-2 shrink-0">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold"
            style={{ background: "rgba(47,191,113,0.12)", color: "#3DCB7E", border: "1px solid rgba(47,191,113,0.22)" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#2FBF71]" />
            In
          </span>
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold"
            style={{ background: "rgba(227,28,61,0.12)", color: "var(--color-crimson-400)", border: "1px solid rgba(227,28,61,0.22)" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#E31C3D]" />
            Out
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={formatted} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gradIn" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={CHART_COLORS.stockIn} stopOpacity={0.28} />
              <stop offset="95%" stopColor={CHART_COLORS.stockIn} stopOpacity={0.01} />
            </linearGradient>
            <linearGradient id="gradOut" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={CHART_COLORS.stockOut} stopOpacity={0.28} />
              <stop offset="95%" stopColor={CHART_COLORS.stockOut} stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid {...CHART_GRID_STYLE} vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={(val) => { try { return format(parseISO(val), "MMM d"); } catch { return val; } }}
            tick={CHART_TICK_STYLE}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={CHART_TICK_STYLE}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--border-default)", strokeWidth: 1 }} />
          <Legend
            wrapperStyle={{ fontSize: 11, color: "var(--text-muted)", paddingTop: 12, fontFamily: "Inter, sans-serif" }}
            iconType="circle"
            iconSize={7}
          />
          <Area
            type="monotone"
            dataKey="stockIn"
            name="Stock In"
            stroke={CHART_COLORS.stockIn}
            strokeWidth={2}
            fill="url(#gradIn)"
            dot={false}
            activeDot={{ r: 4, stroke: CHART_COLORS.stockIn, strokeWidth: 2, fill: "var(--card-bg)" }}
          />
          <Area
            type="monotone"
            dataKey="stockOut"
            name="Stock Out"
            stroke={CHART_COLORS.stockOut}
            strokeWidth={2}
            fill="url(#gradOut)"
            dot={false}
            activeDot={{ r: 4, stroke: CHART_COLORS.stockOut, strokeWidth: 2, fill: "var(--card-bg)" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

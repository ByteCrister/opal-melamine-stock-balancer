"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { CategoryBreakdown } from "@/types/dashboard.types";
import { CHART_COLORS, CHART_TICK_STYLE, CHART_GRID_STYLE } from "@/const/dashboard.const";
import { BarChart2 } from "lucide-react";

interface CategoryBarChartProps {
  data: CategoryBreakdown[];
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
        minWidth: 148,
      }}
    >
      <p className="font-semibold mb-2.5" style={{ fontSize: 11, color: "var(--text-primary)" }}>{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-6 mb-1">
          <span className="flex items-center gap-1.5" style={{ fontSize: 11, color: "var(--text-secondary)" }}>
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: p.color }} />
            {p.name}
          </span>
          <span className="font-semibold tabular-nums" style={{ fontSize: 11, color: "var(--text-primary)" }}>
            {p.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export function CategoryBarChart({ data }: CategoryBarChartProps) {
  const sorted = [...data]
    .sort((a, b) => (b.stockIn + b.stockOut) - (a.stockIn + a.stockOut))
    .slice(0, 8);

  return (
    <div
      className="relative overflow-hidden flex flex-col gap-5"
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
              <BarChart2 className="h-3.5 w-3.5" style={{ color: "var(--badge-info-text)" }} />
            </div>
            <h3
              style={{
                fontFamily: "var(--font-geist)",
                fontSize: "var(--text-heading-md)",
                fontWeight: 600,
                color: "var(--text-primary)",
              }}
            >
              Category Breakdown
            </h3>
          </div>
          <p style={{ fontSize: "var(--text-body-sm)", color: "var(--text-muted)" }}>
            Stock in vs. out per category — top 8 by volume
          </p>
        </div>

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

      <ResponsiveContainer width="100%" height={248}>
        <BarChart data={sorted} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barCategoryGap="32%">
          <CartesianGrid {...CHART_GRID_STYLE} vertical={false} />
          <XAxis
            dataKey="category"
            tick={{ ...CHART_TICK_STYLE, fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            interval={0}
            tickFormatter={(v: string) => v.length > 8 ? `${v.slice(0, 8)}…` : v}
          />
          <YAxis
            tick={CHART_TICK_STYLE}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--table-row-hover)" }} />
          <Legend
            wrapperStyle={{ fontSize: 11, color: "var(--text-muted)", paddingTop: 12, fontFamily: "Inter, sans-serif" }}
            iconType="circle"
            iconSize={7}
          />
          <Bar dataKey="stockIn"  name="Stock In"  fill={CHART_COLORS.stockIn}  radius={[4, 4, 0, 0]} maxBarSize={24} />
          <Bar dataKey="stockOut" name="Stock Out" fill={CHART_COLORS.stockOut} radius={[4, 4, 0, 0]} maxBarSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

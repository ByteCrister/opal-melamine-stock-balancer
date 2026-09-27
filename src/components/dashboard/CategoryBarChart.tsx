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
import { CHART_COLORS, CHART_TICK_STYLE, CHART_TOOLTIP_STYLE, CHART_GRID_STYLE } from "@/const/dashboard.const";

interface CategoryBarChartProps {
  data: CategoryBreakdown[];
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={CHART_TOOLTIP_STYLE.contentStyle}>
      <p style={{ ...CHART_TOOLTIP_STYLE.labelStyle, marginBottom: 8, fontWeight: 500 }}>{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-6 text-[11px] mb-1">
          <span className="flex items-center gap-1.5" style={{ color: "#9BA1AB" }}>
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: p.color }} />
            {p.name}
          </span>
          <span className="font-medium tabular-nums" style={{ color: "#E9EBEF" }}>
            {p.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Grouped bar chart showing stock in vs out per category */
export function CategoryBarChart({ data }: CategoryBarChartProps) {
  // Sort by total volume and take top 8
  const sorted = [...data]
    .sort((a, b) => (b.stockIn + b.stockOut) - (a.stockIn + a.stockOut))
    .slice(0, 8);

  return (
    <div className="glass-panel p-5 flex flex-col gap-4">
      <div>
        <h3
          className="font-medium"
          style={{ fontFamily: "var(--font-geist)", fontSize: "var(--text-heading-md)", color: "var(--text-primary)" }}
        >
          Category Breakdown
        </h3>
        <p style={{ fontSize: "var(--text-body-sm)", color: "var(--text-muted)" }} className="mt-0.5">
          Stock in vs. out per category
        </p>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={sorted} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barCategoryGap="30%">
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
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Legend
            wrapperStyle={{ fontSize: 11, color: "#9BA1AB", paddingTop: 12, fontFamily: "Inter, sans-serif" }}
            iconType="circle"
            iconSize={8}
          />
          <Bar
            dataKey="stockIn"
            name="Stock In"
            fill={CHART_COLORS.stockIn}
            radius={[4, 4, 0, 0]}
            maxBarSize={24}
          />
          <Bar
            dataKey="stockOut"
            name="Stock Out"
            fill={CHART_COLORS.stockOut}
            radius={[4, 4, 0, 0]}
            maxBarSize={24}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

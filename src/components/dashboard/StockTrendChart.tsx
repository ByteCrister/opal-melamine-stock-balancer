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
import {
  CHART_COLORS,
  CHART_TICK_STYLE,
  CHART_TOOLTIP_STYLE,
  CHART_GRID_STYLE,
} from "@/const/dashboard.const";
import { format, parseISO } from "date-fns";

interface StockTrendChartProps {
  data: StockTrendPoint[];
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={CHART_TOOLTIP_STYLE.contentStyle}>
      <p style={CHART_TOOLTIP_STYLE.labelStyle} className="mb-2">
        {label ? format(parseISO(label), "MMM d, yyyy") : ""}
      </p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-6 text-[12px]">
          <span className="flex items-center gap-1.5" style={{ color: "var(--color-fog-200)" }}>
            <span
              className="inline-block h-2 w-2 rounded-full shrink-0"
              style={{ background: p.color }}
            />
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

/** Area chart showing daily stock in / out trend */
export function StockTrendChart({ data }: StockTrendChartProps) {
  const formatted = data.map((d) => ({
    ...d,
    label: d.date,
    displayDate: format(parseISO(d.date), "MMM d"),
  }));

  return (
    <div className="glass-panel p-5 flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h3
            className="font-medium"
            style={{ fontFamily: "var(--font-geist)", fontSize: "var(--text-heading-md)", color: "var(--text-primary)" }}
          >
            Stock Movement Trend
          </h3>
          <p style={{ fontSize: "var(--text-body-sm)", color: "var(--text-muted)" }} className="mt-0.5">
            Daily stock in vs. out over selected period
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={formatted} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gradIn" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS.stockIn} stopOpacity={0.3} />
              <stop offset="95%" stopColor={CHART_COLORS.stockIn} stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gradOut" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS.stockOut} stopOpacity={0.3} />
              <stop offset="95%" stopColor={CHART_COLORS.stockOut} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid {...CHART_GRID_STYLE} vertical={false} />
          <XAxis
            dataKey="displayDate"
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
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#2E333B", strokeWidth: 1 }} />
          <Legend
            wrapperStyle={{ fontSize: 11, color: "#9BA1AB", paddingTop: 12, fontFamily: "Inter, sans-serif" }}
            iconType="circle"
            iconSize={8}
          />
          <Area
            type="monotone"
            dataKey="stockIn"
            name="Stock In"
            stroke={CHART_COLORS.stockIn}
            strokeWidth={2}
            fill="url(#gradIn)"
            dot={false}
            activeDot={{ r: 4, stroke: CHART_COLORS.stockIn, strokeWidth: 2, fill: "#181B1F" }}
          />
          <Area
            type="monotone"
            dataKey="stockOut"
            name="Stock Out"
            stroke={CHART_COLORS.stockOut}
            strokeWidth={2}
            fill="url(#gradOut)"
            dot={false}
            activeDot={{ r: 4, stroke: CHART_COLORS.stockOut, strokeWidth: 2, fill: "#181B1F" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

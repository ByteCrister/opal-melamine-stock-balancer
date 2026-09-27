"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { TopMoverItem } from "@/types/dashboard.types";
import { CHART_TICK_STYLE, CHART_TOOLTIP_STYLE, CHART_GRID_STYLE, CHART_COLORS } from "@/const/dashboard.const";

interface TopMoversChartProps {
  stockIn: TopMoverItem[];
  stockOut: TopMoverItem[];
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { value: number; payload: TopMoverItem }[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={CHART_TOOLTIP_STYLE.contentStyle}>
      <p className="font-medium mb-1" style={{ fontSize: 12, color: "#E9EBEF" }}>{d.itemCode}</p>
      <p className="mb-2 text-[11px]" style={{ color: "#9BA1AB" }}>{d.itemName}</p>
      <p style={{ fontSize: 12 }}>
        <span style={{ color: d.type === "IN" ? CHART_COLORS.stockIn : CHART_COLORS.stockOut, fontWeight: 600 }}>
          {d.quantity.toLocaleString()} {d.unit}
        </span>
      </p>
    </div>
  );
}

/** Horizontal bar chart for top-moving items */
export function TopMoversChart({ stockIn, stockOut }: TopMoversChartProps) {
  return (
    <div className="glass-panel p-5 flex flex-col gap-4">
      <h3
        className="font-medium"
        style={{ fontFamily: "var(--font-geist)", fontSize: "var(--text-heading-md)", color: "var(--text-primary)" }}
      >
        Top Moving Items
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Stock In */}
        <div>
          <p className="text-[12px] font-medium mb-3" style={{ color: CHART_COLORS.stockIn }}>
            ↑ Top Stock In
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={stockIn.slice(0, 8)}
              layout="vertical"
              margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid {...CHART_GRID_STYLE} horizontal={false} />
              <XAxis
                type="number"
                tick={CHART_TICK_STYLE}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)}
              />
              <YAxis
                type="category"
                dataKey="itemCode"
                tick={{ ...CHART_TICK_STYLE, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={70}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="quantity" radius={[0, 4, 4, 0]} maxBarSize={16}>
                {stockIn.slice(0, 8).map((_, i) => (
                  <Cell
                    key={i}
                    fill={CHART_COLORS.stockIn}
                    opacity={1 - i * 0.08}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Stock Out */}
        <div>
          <p className="text-[12px] font-medium mb-3" style={{ color: CHART_COLORS.stockOut }}>
            ↓ Top Stock Out
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={stockOut.slice(0, 8)}
              layout="vertical"
              margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid {...CHART_GRID_STYLE} horizontal={false} />
              <XAxis
                type="number"
                tick={CHART_TICK_STYLE}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)}
              />
              <YAxis
                type="category"
                dataKey="itemCode"
                tick={{ ...CHART_TICK_STYLE, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={70}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="quantity" radius={[0, 4, 4, 0]} maxBarSize={16}>
                {stockOut.slice(0, 8).map((_, i) => (
                  <Cell
                    key={i}
                    fill={CHART_COLORS.stockOut}
                    opacity={1 - i * 0.08}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

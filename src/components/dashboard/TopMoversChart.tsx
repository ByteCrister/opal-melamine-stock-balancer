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
import { CHART_TICK_STYLE, CHART_GRID_STYLE, CHART_COLORS } from "@/const/dashboard.const";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

interface TopMoversChartProps {
  stockIn: TopMoverItem[];
  stockOut: TopMoverItem[];
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value: number; payload: TopMoverItem }[];
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div
      style={{
        background: "var(--popover-bg)",
        border: "1px solid var(--popover-border)",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--popover-shadow)",
        padding: "10px 14px",
        minWidth: 156,
      }}
    >
      <p className="font-semibold mb-0.5" style={{ fontSize: 12, color: "var(--text-primary)" }}>{d.itemCode}</p>
      <p className="mb-2" style={{ fontSize: 11, color: "var(--text-muted)" }}>{d.itemName}</p>
      <p
        className="font-bold tabular-nums"
        style={{
          fontSize: 13,
          color: d.type === "IN" ? CHART_COLORS.stockIn : CHART_COLORS.stockOut,
        }}
      >
        {d.quantity.toLocaleString()} <span style={{ fontWeight: 400, fontSize: 11 }}>{d.unit}</span>
      </p>
    </div>
  );
}

interface HalfChartProps {
  items: TopMoverItem[];
  color: string;
  label: string;
  icon: React.ReactNode;
  accentBg: string;
  accentBorder: string;
  accentText: string;
}

function HalfChart({ items, color, label, icon, accentBg, accentBorder, accentText }: HalfChartProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div
          className="h-6 w-6 rounded-md flex items-center justify-center"
          style={{ background: accentBg, border: `1px solid ${accentBorder}` }}
        >
          <div className="[&>svg]:h-3.5 [&>svg]:w-3.5" style={{ color: accentText }}>{icon}</div>
        </div>
        <span className="font-semibold" style={{ fontSize: "var(--text-label)", color: accentText }}>
          {label}
        </span>
      </div>

      <ResponsiveContainer width="100%" height={224}>
        <BarChart
          data={items.slice(0, 8)}
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
            width={68}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--table-row-hover)" }} />
          <Bar dataKey="quantity" radius={[0, 4, 4, 0]} maxBarSize={14}>
            {items.slice(0, 8).map((_, i) => (
              <Cell key={i} fill={color} opacity={1 - i * 0.09} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TopMoversChart({ stockIn, stockOut }: TopMoversChartProps) {
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

      <div className="flex flex-col gap-0.5">
        <h3
          style={{
            fontFamily: "var(--font-geist)",
            fontSize: "var(--text-heading-md)",
            fontWeight: 600,
            color: "var(--text-primary)",
          }}
        >
          Top Moving Items
        </h3>
        <p style={{ fontSize: "var(--text-body-sm)", color: "var(--text-muted)" }}>
          Highest-volume products for the selected period
        </p>
      </div>

      {/* Thin divider */}
      <div style={{ height: 1, background: "var(--border-subtle)", margin: "0 -20px" }} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <HalfChart
          items={stockIn}
          color={CHART_COLORS.stockIn}
          label="Top Stock In"
          icon={<ArrowDownToLine />}
          accentBg="var(--badge-success-bg)"
          accentBorder="var(--badge-success-border)"
          accentText="var(--badge-success-text)"
        />

        {/* Vertical separator on md+ */}
        <div className="hidden md:block absolute left-1/2 top-[88px] bottom-5 w-px" style={{ background: "var(--border-subtle)" }} />

        <HalfChart
          items={stockOut}
          color={CHART_COLORS.stockOut}
          label="Top Stock Out"
          icon={<ArrowUpFromLine />}
          accentBg="var(--badge-danger-bg)"
          accentBorder="var(--badge-danger-border)"
          accentText="var(--badge-danger-text)"
        />
      </div>
    </div>
  );
}

"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { CategoryBreakdown } from "@/types/dashboard.types";
import { PieChart as PieIcon } from "lucide-react";

const CATEGORY_COLORS = [
  "#E31C3D",
  "#4C8DFF",
  "#2FBF71",
  "#F5A623",
  "#9B6BFF",
  "#00C4B4",
  "#FF6B9D",
  "#737C8A",
];

interface CategoryChartProps {
  data: CategoryBreakdown[];
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number; payload: CategoryBreakdown }[];
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
        minWidth: 160,
      }}
    >
      <p className="font-semibold mb-2.5" style={{ fontSize: 12, color: "var(--text-primary)" }}>{d.category}</p>
      <div className="flex flex-col gap-1" style={{ fontSize: 11, color: "var(--text-secondary)" }}>
        <div className="flex justify-between gap-6">
          <span>Stock In</span>
          <strong style={{ color: "var(--badge-success-text)" }}>{d.stockIn.toLocaleString()}</strong>
        </div>
        <div className="flex justify-between gap-6">
          <span>Stock Out</span>
          <strong style={{ color: "var(--badge-danger-text)" }}>{d.stockOut.toLocaleString()}</strong>
        </div>
        <div className="flex justify-between gap-6">
          <span>Balance</span>
          <strong style={{ color: "var(--badge-info-text)" }}>{d.balance.toLocaleString()}</strong>
        </div>
        <div className="flex justify-between gap-6">
          <span>Items</span>
          <strong style={{ color: "var(--text-primary)" }}>{d.itemCount}</strong>
        </div>
      </div>
    </div>
  );
}

export function CategoryChart({ data }: CategoryChartProps) {
  const sorted = [...data].sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance)).slice(0, 8);

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

      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <div
            className="h-6 w-6 rounded-md flex items-center justify-center"
            style={{ background: "var(--badge-danger-bg)", border: "1px solid var(--badge-danger-border)" }}
          >
            <PieIcon className="h-3.5 w-3.5" style={{ color: "var(--color-crimson-400)" }} />
          </div>
          <h3
            style={{
              fontFamily: "var(--font-geist)",
              fontSize: "var(--text-heading-md)",
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
            Stock by Category
          </h3>
        </div>
        <p style={{ fontSize: "var(--text-body-sm)", color: "var(--text-muted)" }}>
          Balance distribution across categories
        </p>
      </div>

      <ResponsiveContainer width="100%" height={248}>
        <PieChart>
          <Pie
            data={sorted}
            cx="50%"
            cy="46%"
            innerRadius={62}
            outerRadius={96}
            paddingAngle={2}
            dataKey="balance"
            nameKey="category"
            stroke="none"
          >
            {sorted.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                opacity={0.88}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "Inter, sans-serif" }}
            iconType="circle"
            iconSize={7}
            formatter={(value: string) => value.length > 14 ? `${value.slice(0, 14)}…` : value}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

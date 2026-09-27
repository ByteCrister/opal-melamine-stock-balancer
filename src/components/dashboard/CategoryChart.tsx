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
import { CHART_TOOLTIP_STYLE } from "@/const/dashboard.const";

const CATEGORY_COLORS = [
  "#E31C3D",
  "#4C8DFF",
  "#2FBF71",
  "#F5A623",
  "#9B6BFF",
  "#565D68",
  "#FF6B9D",
  "#00C4B4",
];

interface CategoryChartProps {
  data: CategoryBreakdown[];
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { name: string; value: number; payload: CategoryBreakdown }[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={CHART_TOOLTIP_STYLE.contentStyle}>
      <p className="font-medium mb-2" style={{ color: "#E9EBEF", fontSize: 12 }}>{d.category}</p>
      <div className="flex flex-col gap-1 text-[11px]" style={{ color: "#9BA1AB" }}>
        <span>Stock In: <strong style={{ color: "#2FBF71" }}>{d.stockIn.toLocaleString()}</strong></span>
        <span>Stock Out: <strong style={{ color: "#E31C3D" }}>{d.stockOut.toLocaleString()}</strong></span>
        <span>Balance: <strong style={{ color: "#4C8DFF" }}>{d.balance.toLocaleString()}</strong></span>
        <span>Items: <strong style={{ color: "#E9EBEF" }}>{d.itemCount}</strong></span>
      </div>
    </div>
  );
}

/** Donut pie chart showing stock balance by category */
export function CategoryChart({ data }: CategoryChartProps) {
  const sorted = [...data].sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance)).slice(0, 8);

  return (
    <div className="glass-panel p-5 flex flex-col gap-4 h-full">
      <div>
        <h3
          className="font-medium"
          style={{ fontFamily: "var(--font-geist)", fontSize: "var(--text-heading-md)", color: "var(--text-primary)" }}
        >
          Stock by Category
        </h3>
        <p style={{ fontSize: "var(--text-body-sm)", color: "var(--text-muted)" }} className="mt-0.5">
          Balance distribution across categories
        </p>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={sorted}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={2}
            dataKey="balance"
            nameKey="category"
            stroke="none"
          >
            {sorted.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                opacity={0.9}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 10, color: "#9BA1AB", fontFamily: "Inter, sans-serif" }}
            iconType="circle"
            iconSize={7}
            formatter={(value: string) =>
              value.length > 14 ? `${value.slice(0, 14)}…` : value
            }
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

"use client";

import { RecentActivityEntry } from "@/types/dashboard.types";
import { format, parseISO } from "date-fns";
import { ArrowDownToLine, ArrowUpFromLine, Activity } from "lucide-react";

interface RecentActivityTableProps {
  data: RecentActivityEntry[];
}

function TypeBadge({ type }: { type: "IN" | "OUT" }) {
  const isIn = type === "IN";
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold uppercase"
      style={{
        fontSize: "var(--text-micro)",
        letterSpacing: "var(--tracking-wider)",
        background: isIn ? "var(--badge-success-bg)" : "var(--badge-danger-bg)",
        color: isIn ? "var(--badge-success-text)" : "var(--badge-danger-text)",
        border: `1px solid ${isIn ? "var(--badge-success-border)" : "var(--badge-danger-border)"}`,
      }}
    >
      {isIn ? <ArrowDownToLine className="h-2.5 w-2.5" /> : <ArrowUpFromLine className="h-2.5 w-2.5" />}
      {type}
    </span>
  );
}

export function RecentActivityTable({ data }: RecentActivityTableProps) {
  if (!data.length) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-2"
        style={{
          background: "var(--card-bg)",
          backgroundImage: "var(--card-bg-overlay)",
          border: "1px solid var(--card-border)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--card-shadow)",
          padding: "40px 20px",
          minHeight: 160,
        }}
      >
        <p style={{ color: "var(--text-muted)", fontSize: "var(--text-body-sm)" }}>
          No recent activity in this period.
        </p>
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden flex flex-col gap-4"
      style={{
        background: "var(--card-bg)",
        backgroundImage: "var(--card-bg-overlay)",
        border: "1px solid var(--card-border)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--card-shadow)",
        padding: "20px 20px 4px",
      }}
    >
      {/* Top gloss */}
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent 0%, var(--border-strong) 50%, transparent 100%)" }}
      />

      {/* Header */}
      <div className="flex items-center gap-2">
        <div
          className="h-6 w-6 rounded-md flex items-center justify-center"
          style={{ background: "var(--surface-glass)", border: "1px solid var(--border-subtle)" }}
        >
          <Activity className="h-3.5 w-3.5" style={{ color: "var(--text-secondary)" }} />
        </div>
        <h3
          style={{
            fontFamily: "var(--font-geist)",
            fontSize: "var(--text-heading-md)",
            fontWeight: 600,
            color: "var(--text-primary)",
          }}
        >
          Recent Activity
        </h3>
        <span
          className="ml-auto px-2.5 py-0.5 rounded-full font-semibold"
          style={{
            fontSize: "var(--text-micro)",
            letterSpacing: "var(--tracking-wide)",
            background: "var(--badge-neutral-bg)",
            color: "var(--badge-neutral-text)",
            border: "1px solid var(--badge-neutral-border)",
          }}
        >
          {data.length} entries
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-0">
        <table className="w-full min-w-[540px]" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--table-header-border)", background: "var(--table-header-bg)" }}>
              {["Date", "Item Code", "Item Name", "Qty", "Type"].map((h) => (
                <th
                  key={h}
                  className="py-2.5 px-4 first:pl-2 last:pr-2 text-left font-bold uppercase"
                  style={{
                    fontSize: "var(--text-micro)",
                    letterSpacing: "var(--tracking-wider)",
                    color: "var(--text-muted)",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((entry) => (
              <tr
                key={entry._id}
                className="group transition-colors duration-100"
                style={{ borderBottom: "1px solid var(--table-row-border)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--table-row-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td
                  className="py-3 px-4 first:pl-2"
                  style={{
                    fontSize: "var(--text-body-sm)",
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-geist-mono)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {format(parseISO(entry.date), "MMM d, yy")}
                </td>
                <td
                  className="py-3 px-4"
                  style={{
                    fontSize: "var(--text-body-sm)",
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-geist-mono)",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  {entry.itemCode}
                </td>
                <td className="py-3 px-4 max-w-[180px]">
                  <p
                    className="truncate"
                    style={{ fontSize: "var(--text-body-sm)", color: "var(--text-secondary)" }}
                    title={entry.itemName}
                  >
                    {entry.itemName}
                  </p>
                </td>
                <td
                  className="py-3 px-4 tabular-nums whitespace-nowrap"
                  style={{ fontSize: "var(--text-body-sm)", color: "var(--text-primary)", fontWeight: 600 }}
                >
                  {entry.quantity.toLocaleString()}{" "}
                  <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>{entry.unit}</span>
                </td>
                <td className="py-3 px-4 last:pr-2">
                  <TypeBadge type={entry.type} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute inset-x-0 bottom-0 h-8 pointer-events-none"
        style={{ background: "linear-gradient(to top, var(--card-bg), transparent)" }}
      />
    </div>
  );
}

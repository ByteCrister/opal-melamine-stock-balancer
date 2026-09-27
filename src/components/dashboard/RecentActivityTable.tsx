"use client";

import { RecentActivityEntry } from "@/types/dashboard.types";
import { format, parseISO } from "date-fns";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecentActivityTableProps {
  data: RecentActivityEntry[];
}

function TypeBadge({ type }: { type: "IN" | "OUT" }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide"
      style={{
        background: type === "IN"
          ? "rgba(47,191,113,0.12)"
          : "rgba(227,28,61,0.12)",
        color: type === "IN"
          ? "var(--color-status-success)"
          : "var(--color-status-danger)",
      }}
    >
      {type === "IN"
        ? <ArrowDownToLine className="h-2.5 w-2.5" />
        : <ArrowUpFromLine className="h-2.5 w-2.5" />}
      {type === "IN" ? "IN" : "OUT"}
    </span>
  );
}

/** Recent stock movements table */
export function RecentActivityTable({ data }: RecentActivityTableProps) {
  if (!data.length) {
    return (
      <div className="glass-panel p-5 flex flex-col items-center justify-center gap-2 min-h-[160px]">
        <p style={{ color: "var(--text-muted)", fontSize: "var(--text-body-sm)" }}>
          No recent activity in this period.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-5 flex flex-col gap-3">
      <h3
        className="font-medium"
        style={{ fontFamily: "var(--font-geist)", fontSize: "var(--text-heading-md)", color: "var(--text-primary)" }}
      >
        Recent Activity
      </h3>

      <div className="overflow-x-auto -mx-1">
        <table className="w-full min-w-[520px] text-left">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-default)" }}>
              {["Date", "Item Code", "Item Name", "Qty", "Type"].map((h) => (
                <th
                  key={h}
                  className="pb-2 pr-4 font-medium last:pr-0"
                  style={{
                    fontSize: "var(--text-label)",
                    color: "var(--text-secondary)",
                    letterSpacing: "var(--tracking-wide)",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((entry, i) => (
              <tr
                key={entry._id}
                className={cn(
                  "transition-colors",
                  i < data.length - 1 ? "border-b" : ""
                )}
                style={{ borderColor: "var(--border-default)" }}
              >
                <td
                  className="py-2.5 pr-4"
                  style={{ fontSize: "var(--text-body-sm)", color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}
                >
                  {format(parseISO(entry.date), "MMM d")}
                </td>
                <td
                  className="py-2.5 pr-4"
                  style={{ fontSize: "var(--text-body-sm)", color: "var(--text-primary)", fontFamily: "var(--font-geist-mono)", fontWeight: 500 }}
                >
                  {entry.itemCode}
                </td>
                <td className="py-2.5 pr-4 max-w-[160px]">
                  <p
                    className="truncate"
                    style={{ fontSize: "var(--text-body-sm)", color: "var(--text-secondary)" }}
                    title={entry.itemName}
                  >
                    {entry.itemName}
                  </p>
                </td>
                <td
                  className="py-2.5 pr-4 tabular-nums"
                  style={{ fontSize: "var(--text-body-sm)", color: "var(--text-primary)", fontWeight: 600 }}
                >
                  {entry.quantity.toLocaleString()} <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>{entry.unit}</span>
                </td>
                <td className="py-2.5">
                  <TypeBadge type={entry.type} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

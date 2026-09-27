"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useStockBalancer } from "@/hooks/queries/useStockBalancer";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Search,
  Scale,
  ArrowDownToLine,
  ArrowUpFromLine,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  PackageOpen,
} from "lucide-react";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/shared/motion";

export function StockBalancerList() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);

  const { data, isLoading, error } = useStockBalancer({
    page,
    limit,
    search: debouncedSearch,
  });

  const handlePageChange = (newPage: number) => setPage(newPage);

  /* ── Derived stats ─────────────────────────────────────────────── */
  const totalIn   = data?.items.reduce((s, i) => s + i.totalIn,  0) ?? 0;
  const totalOut  = data?.items.reduce((s, i) => s + i.totalOut, 0) ?? 0;
  const lowStock  = data?.items.filter(i => i.balance <= (i.reorderLevel ?? 0) && i.balance >= 0).length ?? 0;
  const overdrawn = data?.items.filter(i => i.balance < 0).length ?? 0;

  /* ── Balance colour helper ─────────────────────────────────────── */
  const balanceStyle = (balance: number, reorderLevel: number) => {
    if (balance < 0) {
      return {
        bg:     "var(--badge-danger-bg)",
        text:   "var(--badge-danger-text)",
        border: "var(--badge-danger-border)",
      };
    }
    if (balance <= reorderLevel) {
      return {
        bg:     "var(--badge-warning-bg)",
        text:   "var(--badge-warning-text)",
        border: "var(--badge-warning-border)",
      };
    }
    return {
      bg:     "var(--badge-success-bg)",
      text:   "var(--badge-success-text)",
      border: "var(--badge-success-border)",
    };
  };

  /* ── Error state ───────────────────────────────────────────────── */
  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-4 p-16 rounded-[var(--radius-xl)] text-center"
        style={{
          background:   "var(--card-bg)",
          backgroundImage: "var(--card-bg-overlay)",
          border:       "1px solid var(--badge-danger-border)",
          boxShadow:    "var(--glow-card-crimson)",
        }}
      >
        <div className="h-12 w-12 rounded-xl flex items-center justify-center" style={{ background: "var(--badge-danger-bg)" }}>
          <AlertTriangle className="h-6 w-6" style={{ color: "var(--badge-danger-text)" }} />
        </div>
        <p className="font-semibold" style={{ color: "var(--text-primary)" }}>Failed to load stock balance</p>
        <p className="text-sm"     style={{ color: "var(--text-muted)" }}>Please refresh the page and try again.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">

      {/* ── KPI Cards ──────────────────────────────────────────────── */}
      <StaggerContainer delay={0.05} className="grid grid-cols-2 sm:grid-cols-4 gap-4">

        {/* Total In */}
        <StaggerItem>
          <div
            className="relative overflow-hidden rounded-[var(--radius-lg)] p-4 flex items-center gap-3"
            style={{
              background:      "var(--card-bg)",
              backgroundImage: "var(--card-bg-overlay)",
              border:          "1px solid var(--badge-success-border)",
              boxShadow:       "var(--glow-success)",
            }}
          >
            <div aria-hidden className="pointer-events-none absolute -top-5 -right-5 h-20 w-20 rounded-full blur-2xl" style={{ background: "rgba(47,191,113,0.12)" }} />
            <div className="h-10 w-10 rounded-[9px] flex items-center justify-center shrink-0"
              style={{ background: "var(--badge-success-bg)", border: "1px solid var(--badge-success-border)" }}>
              <ArrowDownToLine className="h-4.5 w-4.5" style={{ color: "var(--badge-success-text)" }} strokeWidth={2} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Total In</span>
              <span className="text-xl font-bold leading-tight" style={{ color: "var(--text-primary)", fontFamily: "var(--font-geist)" }}>
                {isLoading ? "—" : totalIn.toLocaleString()}
              </span>
            </div>
          </div>
        </StaggerItem>

        {/* Total Out */}
        <StaggerItem>
          <div
            className="relative overflow-hidden rounded-[var(--radius-lg)] p-4 flex items-center gap-3"
            style={{
              background:      "var(--card-bg)",
              backgroundImage: "var(--card-bg-overlay)",
              border:          "1px solid var(--badge-danger-border)",
              boxShadow:       "var(--glow-card-crimson)",
            }}
          >
            <div aria-hidden className="pointer-events-none absolute -top-5 -right-5 h-20 w-20 rounded-full blur-2xl" style={{ background: "rgba(227,28,61,0.10)" }} />
            <div className="h-10 w-10 rounded-[9px] flex items-center justify-center shrink-0"
              style={{ background: "var(--badge-danger-bg)", border: "1px solid var(--badge-danger-border)" }}>
              <ArrowUpFromLine className="h-4.5 w-4.5" style={{ color: "var(--badge-danger-text)" }} strokeWidth={2} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Total Out</span>
              <span className="text-xl font-bold leading-tight" style={{ color: "var(--text-primary)", fontFamily: "var(--font-geist)" }}>
                {isLoading ? "—" : totalOut.toLocaleString()}
              </span>
            </div>
          </div>
        </StaggerItem>

        {/* Low Stock */}
        <StaggerItem>
          <div
            className="relative overflow-hidden rounded-[var(--radius-lg)] p-4 flex items-center gap-3"
            style={{
              background:      "var(--card-bg)",
              backgroundImage: "var(--card-bg-overlay)",
              border:          lowStock > 0 ? "1px solid var(--badge-warning-border)" : "1px solid var(--card-border)",
              boxShadow:       lowStock > 0 ? "0 0 24px rgba(245,166,35,0.15)" : "var(--card-shadow)",
            }}
          >
            <div aria-hidden className="pointer-events-none absolute -top-5 -right-5 h-20 w-20 rounded-full blur-2xl" style={{ background: "rgba(245,166,35,0.10)" }} />
            <div className="h-10 w-10 rounded-[9px] flex items-center justify-center shrink-0"
              style={{ background: "var(--badge-warning-bg)", border: "1px solid var(--badge-warning-border)" }}>
              <PackageOpen className="h-4.5 w-4.5" style={{ color: "var(--badge-warning-text)" }} strokeWidth={2} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Low Stock</span>
              <span className="text-xl font-bold leading-tight"
                style={{ color: lowStock > 0 ? "var(--badge-warning-text)" : "var(--text-primary)", fontFamily: "var(--font-geist)" }}>
                {isLoading ? "—" : lowStock}
              </span>
            </div>
          </div>
        </StaggerItem>

        {/* Overdrawn */}
        <StaggerItem>
          <div
            className="relative overflow-hidden rounded-[var(--radius-lg)] p-4 flex items-center gap-3"
            style={{
              background:      "var(--card-bg)",
              backgroundImage: "var(--card-bg-overlay)",
              border:          overdrawn > 0 ? "1px solid var(--badge-danger-border)" : "1px solid var(--card-border)",
              boxShadow:       overdrawn > 0 ? "var(--glow-card-crimson)" : "var(--card-shadow)",
            }}
          >
            <div aria-hidden className="pointer-events-none absolute -top-5 -right-5 h-20 w-20 rounded-full blur-2xl" style={{ background: "rgba(227,28,61,0.08)" }} />
            <div className="h-10 w-10 rounded-[9px] flex items-center justify-center shrink-0"
              style={{ background: overdrawn > 0 ? "var(--badge-danger-bg)" : "var(--badge-neutral-bg)", border: overdrawn > 0 ? "1px solid var(--badge-danger-border)" : "1px solid var(--badge-neutral-border)" }}>
              <AlertTriangle className="h-4.5 w-4.5" style={{ color: overdrawn > 0 ? "var(--badge-danger-text)" : "var(--text-muted)" }} strokeWidth={2} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Overdrawn</span>
              <span className="text-xl font-bold leading-tight"
                style={{ color: overdrawn > 0 ? "var(--badge-danger-text)" : "var(--text-primary)", fontFamily: "var(--font-geist)" }}>
                {isLoading ? "—" : overdrawn}
              </span>
            </div>
          </div>
        </StaggerItem>
      </StaggerContainer>

      {/* ── Toolbar ────────────────────────────────────────────────── */}
      <FadeInUp delay={0.2} duration={0.5}>
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-[var(--radius-lg)]"
          style={{
            background:      "var(--card-bg)",
            backgroundImage: "var(--card-bg-overlay)",
            border:          "1px solid var(--card-border)",
            boxShadow:       "var(--card-shadow)",
          }}
        >
          <div className="relative w-full sm:w-80">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none"
              style={{ color: "var(--text-muted)" }}
            />
            <Input
              placeholder="Search item code or name…"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setPage(1);
              }}
              className="pl-9 h-9 text-[13px]"
              style={{
                background:   "var(--input-bg)",
                border:       "1px solid var(--input-border)",
                color:        "var(--input-text)",
                borderRadius: "var(--input-radius)",
              }}
            />
          </div>

          {/* Record count badge */}
          {!isLoading && data && (
            <span
              className="text-[12px] font-medium px-3 py-1 rounded-full shrink-0"
              style={{
                background: "var(--badge-info-bg)",
                color:      "var(--badge-info-text)",
                border:     "1px solid var(--badge-info-border)",
              }}
            >
              {data.meta.total.toLocaleString()} items
            </span>
          )}
        </div>
      </FadeInUp>

      {/* ── Table ──────────────────────────────────────────────────── */}
      <FadeInUp delay={0.3} duration={0.5}>
        <div
          className="rounded-[var(--radius-lg)] overflow-x-auto"
          style={{
            background:      "var(--card-bg)",
            backgroundImage: "var(--card-bg-overlay)",
            border:          "1px solid var(--card-border)",
            boxShadow:       "var(--card-shadow)",
          }}
        >
          <Table>
            <TableHeader>
              <TableRow style={{ background: "var(--table-header-bg)", borderBottom: "1px solid var(--table-header-border)" }}>
                {["Item Code", "Item Name", "Category", "Class"].map((h) => (
                  <TableHead
                    key={h}
                    className="text-[11px] font-semibold uppercase tracking-widest py-3"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {h}
                  </TableHead>
                ))}
                {["Total In", "Total Out", "Balance"].map((h) => (
                  <TableHead
                    key={h}
                    className="text-right text-[11px] font-semibold uppercase tracking-widest py-3"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                /* ── Skeleton rows ── */
                Array.from({ length: 8 }).map((_, i) => (
                  <TableRow key={i} style={{ borderBottom: "1px solid var(--table-row-border)" }}>
                    {[80, 140, 90, 70, 60, 60, 72].map((w, j) => (
                      <TableCell key={j} className={j >= 4 ? "text-right" : ""}>
                        <div
                          className={`h-4 rounded animate-pulse ${j >= 4 ? "ml-auto" : ""}`}
                          style={{ background: "var(--card-border)", width: `${w}px`, opacity: 1 - i * 0.06 }}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : data?.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <div className="flex flex-col items-center gap-3 py-14" style={{ color: "var(--text-muted)" }}>
                      <Scale className="h-10 w-10 opacity-25" />
                      <p className="text-[13px]">No stock balance records found. Try adjusting your search.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                data?.items.map((item) => {
                  const bs = balanceStyle(item.balance, item.reorderLevel ?? 0);
                  return (
                    <TableRow
                      key={item._id}
                      className="group transition-colors duration-100"
                      style={{ borderBottom: "1px solid var(--table-row-border)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--table-row-hover)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                    >
                      {/* Item Code */}
                      <TableCell className="py-3">
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider"
                          style={{
                            background: "var(--badge-neutral-bg)",
                            color:      "var(--badge-neutral-text)",
                            border:     "1px solid var(--badge-neutral-border)",
                          }}
                        >
                          {item.itemCode}
                        </span>
                      </TableCell>

                      {/* Item Name */}
                      <TableCell className="py-3 text-[13.5px] font-medium" style={{ color: "var(--text-primary)" }}>
                        {item.itemName}
                      </TableCell>

                      {/* Category */}
                      <TableCell className="py-3">
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold"
                          style={{
                            background: "var(--badge-info-bg)",
                            color:      "var(--badge-info-text)",
                            border:     "1px solid var(--badge-info-border)",
                          }}
                        >
                          {item.category || "—"}
                        </span>
                      </TableCell>

                      {/* Class */}
                      <TableCell className="py-3 text-[13px]" style={{ color: "var(--text-secondary)" }}>
                        {item.className || "—"}
                      </TableCell>

                      {/* Total In */}
                      <TableCell className="py-3 text-right">
                        <span
                          className="inline-flex items-center gap-1 text-[12.5px] font-semibold"
                          style={{ color: "var(--badge-success-text)" }}
                        >
                          +{item.totalIn.toLocaleString()}
                        </span>
                      </TableCell>

                      {/* Total Out */}
                      <TableCell className="py-3 text-right">
                        <span
                          className="inline-flex items-center gap-1 text-[12.5px] font-semibold"
                          style={{ color: "var(--badge-danger-text)" }}
                        >
                          -{item.totalOut.toLocaleString()}
                        </span>
                      </TableCell>

                      {/* Balance */}
                      <TableCell className="py-3 text-right">
                        <span
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-bold"
                          style={{
                            background: bs.bg,
                            color:      bs.text,
                            border:     `1px solid ${bs.border}`,
                          }}
                        >
                          {item.balance.toLocaleString()}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </FadeInUp>

      {/* ── Pagination ─────────────────────────────────────────────── */}
      {data && data.meta.totalPages > 1 && (
        <FadeInUp delay={0.4} duration={0.4}>
          <div
            className="flex items-center justify-between px-4 py-3 rounded-[var(--radius-lg)]"
            style={{
              background:      "var(--card-bg)",
              backgroundImage: "var(--card-bg-overlay)",
              border:          "1px solid var(--card-border)",
              boxShadow:       "var(--card-shadow)",
            }}
          >
            <p className="text-[12.5px]" style={{ color: "var(--text-muted)" }}>
              Showing{" "}
              <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
                {(data.meta.page - 1) * data.meta.limit + 1}–{Math.min(data.meta.page * data.meta.limit, data.meta.total)}
              </span>{" "}
              of{" "}
              <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>{data.meta.total}</span> items
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1 || isLoading}
                onClick={() => handlePageChange(page - 1)}
                className="h-8 w-8 rounded-[7px] flex items-center justify-center transition-all duration-100 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  background: "var(--btn-secondary-bg)",
                  border:     "1px solid var(--btn-secondary-border)",
                  color:      "var(--text-secondary)",
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-[12.5px] px-2 font-medium" style={{ color: "var(--text-secondary)" }}>
                {data.meta.page} / {data.meta.totalPages}
              </span>
              <button
                disabled={page === data.meta.totalPages || isLoading}
                onClick={() => handlePageChange(page + 1)}
                className="h-8 w-8 rounded-[7px] flex items-center justify-center transition-all duration-100 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  background: "var(--btn-secondary-bg)",
                  border:     "1px solid var(--btn-secondary-border)",
                  color:      "var(--text-secondary)",
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </FadeInUp>
      )}
    </div>
  );
}

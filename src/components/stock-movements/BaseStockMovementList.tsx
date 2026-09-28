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
import { useStockMovements } from "@/hooks/queries/useStockMovements";
import { useDeleteStockMovement } from "@/hooks/mutations/useStockMovementsMutations";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ArrowDownToLine,
  ArrowUpFromLine,
  CalendarDays,
  Package,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { StockMovementFilters, StockMovement } from "@/types/stock-movements.types";
import { StockMovementType } from "@/const/stock.const";
import { StockMovementDialog } from "./StockMovementDialog";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/shared/motion";

interface BaseStockMovementListProps {
  type: StockMovementType;
}

export function BaseStockMovementList({ type }: BaseStockMovementListProps) {
  const isIn = type === "IN";
  const title = isIn ? "Stock In" : "Stock Out";
  const accentColor = isIn ? "var(--color-status-success)" : "var(--color-crimson-400)";
  const accentBg = isIn ? "var(--badge-success-bg)" : "var(--badge-danger-bg)";
  const accentBorder = isIn ? "var(--badge-success-border)" : "var(--badge-danger-border)";
  const accentGlow = isIn
    ? "0 0 0 1px rgba(47,191,113,0.20), 0 8px 32px rgba(47,191,113,0.12)"
    : "var(--glow-card-crimson)";
  const accentGlowOrb = isIn ? "rgba(47,191,113,0.12)" : "rgba(227,28,61,0.12)";

  const [filters, setFilters] = useState<StockMovementFilters>({
    page: 1,
    limit: 10,
    sort: "desc",
    sortBy: "date",
  });
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);
  const activeFilters = { ...filters, search: debouncedSearch };

  const { data, isLoading, error } = useStockMovements(type, activeFilters);
  const deleteMutation = useDeleteStockMovement(type);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMovement, setEditingMovement] = useState<StockMovement | null>(null);

  const handlePageChange = (newPage: number) => setFilters({ ...filters, page: newPage });

  const handleDelete = (id: string) => {
    if (confirm(`Are you sure you want to delete this ${title.toLowerCase()} record?`)) {
      deleteMutation.mutate(id, {
        onSuccess: () => toast.success(`${title} deleted successfully`),
        onError: (err: Error) => toast.error(err.message),
      });
    }
  };

  const handleEdit = (movement: StockMovement) => {
    setEditingMovement(movement);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingMovement(null);
    setDialogOpen(true);
  };

  /* ── Error state ─────────────────────────────────────────────── */
  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-4 p-16 rounded-[var(--radius-xl)] text-center"
        style={{
          background: "var(--card-bg)",
          backgroundImage: "var(--card-bg-overlay)",
          border: "1px solid var(--badge-danger-border)",
          boxShadow: "var(--glow-card-crimson)",
        }}
      >
        <div
          className="h-12 w-12 rounded-xl flex items-center justify-center"
          style={{ background: "var(--badge-danger-bg)" }}
        >
          <AlertTriangle className="h-6 w-6" style={{ color: "var(--badge-danger-text)" }} />
        </div>
        <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
          Failed to load {title.toLowerCase()} records
        </p>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Please refresh the page and try again.
        </p>
      </div>
    );
  }

  const totalRecords = data?.meta.total ?? 0;
  const Icon = isIn ? ArrowDownToLine : ArrowUpFromLine;

  return (
    <div className="flex flex-col gap-6">

      {/* ── KPI Cards ──────────────────────────────────────────────── */}
      <StaggerContainer delay={0.05} className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Total Records */}
        <StaggerItem>
          <div
            className="relative overflow-hidden rounded-[var(--radius-lg)] p-5 flex items-center gap-4"
            style={{
              background: "var(--card-bg)",
              backgroundImage: "var(--card-bg-overlay)",
              border: `1px solid ${accentBorder}`,
              boxShadow: accentGlow,
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full blur-2xl"
              style={{ background: accentGlowOrb }}
            />
            <div
              className="h-11 w-11 rounded-[10px] flex items-center justify-center shrink-0"
              style={{ background: accentBg, border: `1px solid ${accentBorder}` }}
            >
              <Icon className="h-5 w-5" style={{ color: accentColor }} strokeWidth={2} />
            </div>
            <div className="flex flex-col min-w-0">
              <span
                className="text-[11px] font-semibold uppercase tracking-widest"
                style={{ color: "var(--text-muted)" }}
              >
                Total Records
              </span>
              <span
                className="text-2xl font-bold leading-tight"
                style={{ color: "var(--text-primary)", fontFamily: "var(--font-geist)" }}
              >
                {isLoading ? "—" : totalRecords}
              </span>
            </div>
          </div>
        </StaggerItem>

        {/* This Page */}
        <StaggerItem>
          <div
            className="relative overflow-hidden rounded-[var(--radius-lg)] p-5 flex items-center gap-4"
            style={{
              background: "var(--card-bg)",
              backgroundImage: "var(--card-bg-overlay)",
              border: "1px solid var(--card-border)",
              boxShadow: "var(--card-shadow)",
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full blur-2xl"
              style={{ background: "rgba(76,141,255,0.10)" }}
            />
            <div
              className="h-11 w-11 rounded-[10px] flex items-center justify-center shrink-0"
              style={{ background: "var(--badge-info-bg)", border: "1px solid var(--badge-info-border)" }}
            >
              <Package className="h-5 w-5" style={{ color: "var(--badge-info-text)" }} strokeWidth={2} />
            </div>
            <div className="flex flex-col min-w-0">
              <span
                className="text-[11px] font-semibold uppercase tracking-widest"
                style={{ color: "var(--text-muted)" }}
              >
                Showing Page
              </span>
              <span
                className="text-2xl font-bold leading-tight"
                style={{ color: "var(--text-primary)", fontFamily: "var(--font-geist)" }}
              >
                {isLoading ? "—" : `${data?.meta.page ?? 1} / ${data?.meta.totalPages ?? 1}`}
              </span>
            </div>
          </div>
        </StaggerItem>

        {/* Latest Date */}
        <StaggerItem>
          <div
            className="relative overflow-hidden rounded-[var(--radius-lg)] p-5 flex items-center gap-4"
            style={{
              background: "var(--card-bg)",
              backgroundImage: "var(--card-bg-overlay)",
              border: "1px solid var(--card-border)",
              boxShadow: "var(--card-shadow)",
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full blur-2xl"
              style={{ background: "rgba(245,166,35,0.10)" }}
            />
            <div
              className="h-11 w-11 rounded-[10px] flex items-center justify-center shrink-0"
              style={{ background: "var(--badge-warning-bg)", border: "1px solid var(--badge-warning-border)" }}
            >
              <CalendarDays className="h-5 w-5" style={{ color: "var(--badge-warning-text)" }} strokeWidth={2} />
            </div>
            <div className="flex flex-col min-w-0">
              <span
                className="text-[11px] font-semibold uppercase tracking-widest"
                style={{ color: "var(--text-muted)" }}
              >
                Latest Entry
              </span>
              <span
                className="text-lg font-bold leading-tight"
                style={{ color: "var(--text-primary)", fontFamily: "var(--font-geist)" }}
              >
                {isLoading
                  ? "—"
                  : data?.items[0]?.date
                  ? new Date(data.items[0].date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "—"}
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
            background: "var(--card-bg)",
            backgroundImage: "var(--card-bg-overlay)",
            border: "1px solid var(--card-border)",
            boxShadow: "var(--card-shadow)",
          }}
        >
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none"
              style={{ color: "var(--text-muted)" }}
            />
            <Input
              placeholder={`Search item code or name…`}
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setFilters({ ...filters, page: 1 });
              }}
              className="pl-9 h-9 text-[13px]"
              style={{
                background: "var(--input-bg)",
                border: "1px solid var(--input-border)",
                color: "var(--input-text)",
                borderRadius: "var(--input-radius)",
              }}
            />
          </div>

          {/* Add button */}
          <button
            onClick={handleAdd}
            className="shrink-0 flex items-center gap-2 px-4 h-9 rounded-[9px] text-[13px] font-semibold text-white transition-all duration-150 hover:brightness-110 focus-visible:ring-2 focus-visible:ring-[var(--color-crimson-400)]"
            style={{
              backgroundImage: isIn
                ? "linear-gradient(180deg, #2FBF71 0%, #1E8F52 100%)"
                : "var(--gradient-primary-button)",
              boxShadow: isIn
                ? "0 0 0 1px rgba(47,191,113,0.45), 0 4px 20px rgba(47,191,113,0.30)"
                : "var(--glow-primary-cta)",
            }}
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            Add {title}
          </button>
        </div>
      </FadeInUp>

      {/* ── Table ──────────────────────────────────────────────────── */}
      <FadeInUp delay={0.3} duration={0.5}>
        <div
          className="rounded-[var(--radius-lg)] overflow-hidden"
          style={{
            background: "var(--card-bg)",
            backgroundImage: "var(--card-bg-overlay)",
            border: "1px solid var(--card-border)",
            boxShadow: "var(--card-shadow)",
          }}
        >
          <Table>
            <TableHeader>
              <TableRow
                style={{
                  background: "var(--table-header-bg)",
                  borderBottom: "1px solid var(--table-header-border)",
                }}
              >
                {["Date", "Item Code", "Item Name", "Quantity", "Unit", "Remarks"].map((h) => (
                  <TableHead
                    key={h}
                    className="text-[11px] font-semibold uppercase tracking-widest py-3"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {h}
                  </TableHead>
                ))}
                <TableHead
                  className="text-right text-[11px] font-semibold uppercase tracking-widest py-3"
                  style={{ color: "var(--text-muted)" }}
                >
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i} style={{ borderBottom: "1px solid var(--table-row-border)" }}>
                    {Array.from({ length: 7 }).map((__, j) => (
                      <TableCell key={j}>
                        <div
                          className="h-4 rounded animate-pulse"
                          style={{
                            background: "var(--card-border)",
                            width: j === 6 ? "60px" : j === 2 ? "140px" : "80px",
                          }}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : data?.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <div
                      className="flex flex-col items-center gap-3 py-14"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <Icon className="h-10 w-10 opacity-25" />
                      <p className="text-[13px]">No {title.toLowerCase()} records found. Try adjusting your search.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                data?.items.map((movement) => (
                  <TableRow
                    key={movement._id}
                    className="group transition-colors duration-100"
                    style={{ borderBottom: "1px solid var(--table-row-border)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--table-row-hover)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                  >
                    {/* Date */}
                    <TableCell className="py-3">
                      <span
                        className="inline-flex items-center gap-1.5 text-[12.5px] font-medium"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <CalendarDays className="h-3.5 w-3.5 opacity-50" />
                        {new Date(movement.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </TableCell>

                    {/* Item Code */}
                    <TableCell className="py-3">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider"
                        style={{
                          background: "var(--badge-neutral-bg)",
                          color: "var(--badge-neutral-text)",
                          border: "1px solid var(--badge-neutral-border)",
                        }}
                      >
                        {movement.itemCode}
                      </span>
                    </TableCell>

                    {/* Item Name */}
                    <TableCell
                      className="py-3 text-[13.5px] font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {movement.itemName}
                    </TableCell>

                    {/* Quantity */}
                    <TableCell className="py-3">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-bold"
                        style={{
                          background: accentBg,
                          color: accentColor,
                          border: `1px solid ${accentBorder}`,
                        }}
                      >
                        {movement.quantity}
                      </span>
                    </TableCell>

                    {/* Unit */}
                    <TableCell className="py-3 text-[13px]" style={{ color: "var(--text-secondary)" }}>
                      {movement.unit}
                    </TableCell>

                    {/* Remarks */}
                    <TableCell
                      className="py-3 text-[12.5px] truncate max-w-[180px]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {movement.remarks || (
                        <span style={{ color: "var(--text-muted)", opacity: 0.4 }}>—</span>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="py-3 text-right">
                      <div className="flex justify-end gap-1.5 opacity-100 md:opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150">
                        <button
                          onClick={() => handleEdit(movement)}
                          className="h-8 w-8 rounded-[7px] flex items-center justify-center transition-colors duration-100"
                          style={{
                            background: "var(--btn-ghost-hover-bg)",
                            color: "var(--text-muted)",
                          }}
                          title="Edit record"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(movement._id)}
                          className="h-8 w-8 rounded-[7px] flex items-center justify-center transition-colors duration-100"
                          style={{
                            background: "var(--badge-danger-bg)",
                            color: "var(--badge-danger-text)",
                          }}
                          title="Delete record"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
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
              background: "var(--card-bg)",
              backgroundImage: "var(--card-bg-overlay)",
              border: "1px solid var(--card-border)",
              boxShadow: "var(--card-shadow)",
            }}
          >
            <p className="text-[12.5px]" style={{ color: "var(--text-muted)" }}>
              Showing{" "}
              <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
                {(data.meta.page - 1) * data.meta.limit + 1}–
                {Math.min(data.meta.page * data.meta.limit, data.meta.total)}
              </span>{" "}
              of{" "}
              <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>{data.meta.total}</span>{" "}
              records
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={data.meta.page === 1}
                onClick={() => handlePageChange(data.meta.page - 1)}
                className="h-8 w-8 rounded-[7px] flex items-center justify-center transition-all duration-100 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  background: "var(--btn-secondary-bg)",
                  border: "1px solid var(--btn-secondary-border)",
                  color: "var(--text-secondary)",
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-[12.5px] px-2 font-medium" style={{ color: "var(--text-secondary)" }}>
                {data.meta.page} / {data.meta.totalPages}
              </span>
              <button
                disabled={data.meta.page === data.meta.totalPages}
                onClick={() => handlePageChange(data.meta.page + 1)}
                className="h-8 w-8 rounded-[7px] flex items-center justify-center transition-all duration-100 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  background: "var(--btn-secondary-bg)",
                  border: "1px solid var(--btn-secondary-border)",
                  color: "var(--text-secondary)",
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </FadeInUp>
      )}

      {/* ── Dialog ─────────────────────────────────────────────────── */}
      <StockMovementDialog
        type={type}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editingMovement}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useItems } from "@/hooks/queries/useItems";
import { useDeleteItem } from "@/hooks/mutations/useItemsMutations";
import { useDebounce } from "@/hooks/useDebounce";
import { Search, Plus, Edit, Trash2, Package, PackageOpen, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { ItemFilters } from "@/types/item.types";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/shared/motion";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function ItemsList() {
  const router = useRouter();
  const [filters, setFilters] = useState<ItemFilters>({ page: 1, limit: 10, sort: "desc", sortBy: "createdAt" });
  const [searchInput, setSearchInput] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const debouncedSearch = useDebounce(searchInput, 500);
  const activeFilters = { ...filters, search: debouncedSearch };

  const { data, isLoading, error } = useItems(activeFilters);
  const deleteMutation = useDeleteItem();

  const handlePageChange = (newPage: number) => setFilters({ ...filters, page: newPage });

  const confirmDelete = () => {
    if (!deleteTargetId) return;
    deleteMutation.mutate(deleteTargetId, {
      onSuccess: () => {
        toast.success("Item deleted successfully");
        setDeleteTargetId(null);
      },
      onError: (err: Error) => {
        toast.error(err.message);
        setDeleteTargetId(null);
      },
    });
  };

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
        <div className="h-12 w-12 rounded-xl flex items-center justify-center" style={{ background: "var(--badge-danger-bg)" }}>
          <AlertTriangle className="h-6 w-6" style={{ color: "var(--badge-danger-text)" }} />
        </div>
        <p className="font-semibold" style={{ color: "var(--text-primary)" }}>Failed to load items</p>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Please refresh the page and try again.</p>
      </div>
    );
  }

  const totalItems = data?.meta.total || 0;
  const reorderAlerts = data?.items.filter(item => item.doQty !== undefined && item.doQty <= item.reorderLevel).length || 0;

  return (
    <div className="flex flex-col gap-6">

      {/* ── Page Header ─────────────────────────────────────────────── */}
      <FadeInUp delay={0.05} duration={0.5}>
        <div className="flex flex-col gap-1">
          <h1
            style={{
              fontFamily: "var(--font-geist)",
              fontSize: "var(--text-display-md)",
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "var(--tracking-tight)",
              lineHeight: "var(--leading-display-md)",
            }}
          >
            Items
          </h1>
          <p style={{ fontSize: "var(--text-body-md)", color: "var(--text-secondary)" }}>
            Manage and track your full product inventory
          </p>
        </div>
      </FadeInUp>

      {/* ── KPI Cards ───────────────────────────────────────────────── */}
      <StaggerContainer delay={0.1} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Items */}
        <StaggerItem className="h-full">
          <div
            className="relative overflow-hidden rounded-[var(--radius-lg)] p-5 flex items-center gap-4 h-full"
            style={{
              background: "var(--card-bg)",
              backgroundImage: "var(--card-bg-overlay)",
              border: "1px solid var(--card-border)",
              boxShadow: "var(--card-shadow)",
            }}
          >
            <div aria-hidden className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full blur-2xl" style={{ background: "rgba(227,28,61,0.10)" }} />
            <div
              className="h-11 w-11 rounded-[10px] flex items-center justify-center shrink-0"
              style={{ backgroundImage: "var(--gradient-primary-button)", boxShadow: "0 2px 10px rgba(227,28,61,0.35)" }}
            >
              <Package className="h-5 w-5 text-white" strokeWidth={2} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Total Items</span>
              <span className="text-2xl font-bold leading-tight" style={{ color: "var(--text-primary)", fontFamily: "var(--font-geist)" }}>
                {isLoading ? "—" : totalItems}
              </span>
            </div>
          </div>
        </StaggerItem>

        {/* Low Stock Alerts */}
        <StaggerItem className="h-full">
          <div
            className="relative overflow-hidden rounded-[var(--radius-lg)] p-5 flex items-center gap-4 h-full"
            style={{
              background: "var(--card-bg)",
              backgroundImage: "var(--card-bg-overlay)",
              border: reorderAlerts > 0 ? "1px solid var(--badge-warning-border)" : "1px solid var(--card-border)",
              boxShadow: reorderAlerts > 0 ? "0 0 20px rgba(245,166,35,0.15)" : "var(--card-shadow)",
            }}
          >
            <div aria-hidden className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full blur-2xl" style={{ background: "rgba(245,166,35,0.10)" }} />
            <div
              className="h-11 w-11 rounded-[10px] flex items-center justify-center shrink-0"
              style={{ background: "var(--badge-warning-bg)", border: "1px solid var(--badge-warning-border)" }}
            >
              <PackageOpen className="h-5 w-5" style={{ color: "var(--badge-warning-text)" }} strokeWidth={2} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Low Stock Alerts</span>
              <span className="text-2xl font-bold leading-tight" style={{ color: reorderAlerts > 0 ? "var(--badge-warning-text)" : "var(--text-primary)", fontFamily: "var(--font-geist)" }}>
                {isLoading ? "—" : reorderAlerts}
              </span>
            </div>
          </div>
        </StaggerItem>

        {/* Current Page */}
        <StaggerItem className="h-full">
          <div
            className="relative overflow-hidden rounded-[var(--radius-lg)] p-5 flex items-center gap-4 h-full"
            style={{
              background: "var(--card-bg)",
              backgroundImage: "var(--card-bg-overlay)",
              border: "1px solid var(--card-border)",
              boxShadow: "var(--card-shadow)",
            }}
          >
            <div aria-hidden className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full blur-2xl" style={{ background: "rgba(76,141,255,0.10)" }} />
            <div
              className="h-11 w-11 rounded-[10px] flex items-center justify-center shrink-0"
              style={{ background: "var(--badge-info-bg)", border: "1px solid var(--badge-info-border)" }}
            >
              <AlertTriangle className="h-5 w-5" style={{ color: "var(--badge-info-text)" }} strokeWidth={2} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Showing Page</span>
              <span className="text-2xl font-bold leading-tight" style={{ color: "var(--text-primary)", fontFamily: "var(--font-geist)" }}>
                {isLoading ? "—" : `${data?.meta.page ?? 1} / ${data?.meta.totalPages ?? 1}`}
              </span>
            </div>
          </div>
        </StaggerItem>
      </StaggerContainer>

      {/* ── Toolbar ──────────────────────────────────────────────────── */}
      <FadeInUp delay={0.25} duration={0.5}>
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
              placeholder="Search by code, name, class…"
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
          <Link href="/items/new" className="shrink-0">
            <button
              className="flex items-center gap-2 px-4 h-9 rounded-[9px] text-[13px] font-semibold text-white transition-all duration-150 hover:brightness-110 focus-visible:ring-2 focus-visible:ring-[var(--color-crimson-400)]"
              style={{
                backgroundImage: "var(--gradient-primary-button)",
                boxShadow: "var(--glow-primary-cta)",
              }}
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Add Item
            </button>
          </Link>
        </div>
      </FadeInUp>

      {/* ── Table ────────────────────────────────────────────────────── */}
      <FadeInUp delay={0.35} duration={0.5}>
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
              <TableRow style={{ background: "var(--table-header-bg)", borderBottom: "1px solid var(--table-header-border)" }}>
                {["Code", "Name", "Class", "Category", "Unit"].map((h) => (
                  <TableHead
                    key={h}
                    className="text-[11px] font-semibold uppercase tracking-widest py-3"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {h}
                  </TableHead>
                ))}
                <TableHead className="text-right text-[11px] font-semibold uppercase tracking-widest py-3" style={{ color: "var(--text-muted)" }}>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} style={{ borderBottom: "1px solid var(--table-row-border)" }}>
                    {Array.from({ length: 6 }).map((__, j) => (
                      <TableCell key={j}>
                        <div className="h-4 rounded animate-pulse" style={{ background: "var(--card-border)", width: j === 5 ? "60px" : "80%" }} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : data?.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <div className="flex flex-col items-center gap-3 py-14" style={{ color: "var(--text-muted)" }}>
                      <Package className="h-10 w-10 opacity-30" />
                      <p className="text-[13px]">No items found. Try adjusting your search.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                data?.items.map((item) => (
                  <TableRow
                    key={item._id}
                    className="group transition-colors duration-100"
                    style={{ borderBottom: "1px solid var(--table-row-border)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--table-row-hover)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                  >
                    <TableCell className="py-3">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider"
                        style={{ background: "var(--badge-neutral-bg)", color: "var(--badge-neutral-text)", border: "1px solid var(--badge-neutral-border)" }}
                      >
                        {item.itemCode}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 text-[13.5px] font-medium" style={{ color: "var(--text-primary)" }}>
                      {item.itemName}
                    </TableCell>
                    <TableCell className="py-3 text-[13px]" style={{ color: "var(--text-secondary)" }}>
                      {item.className || "—"}
                    </TableCell>
                    <TableCell className="py-3">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold"
                        style={{ background: "var(--badge-info-bg)", color: "var(--badge-info-text)", border: "1px solid var(--badge-info-border)" }}
                      >
                        {item.category}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 text-[13px]" style={{ color: "var(--text-secondary)" }}>
                      {item.unit}
                    </TableCell>
                    <TableCell className="py-3 text-right">
                      <div className="flex justify-end gap-1.5 opacity-100 md:opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150">
                        <button
                          onClick={() => router.push(`/items/${item._id}`)}
                          className="h-8 w-8 rounded-[7px] flex items-center justify-center transition-colors duration-100"
                          style={{ background: "var(--btn-ghost-hover-bg)", color: "var(--text-muted)" }}
                          title="Edit item"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(item._id)}
                          className="h-8 w-8 rounded-[7px] flex items-center justify-center transition-colors duration-100"
                          style={{ background: "var(--badge-danger-bg)", color: "var(--badge-danger-text)" }}
                          title="Delete item"
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

      {/* ── Pagination ───────────────────────────────────────────────── */}
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
                {(data.meta.page - 1) * data.meta.limit + 1}–{Math.min(data.meta.page * data.meta.limit, data.meta.total)}
              </span>{" "}
              of{" "}
              <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>{data.meta.total}</span> items
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={data.meta.page === 1}
                onClick={() => handlePageChange(data.meta.page - 1)}
                className="h-8 w-8 rounded-[7px] flex items-center justify-center transition-all duration-100 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ background: "var(--btn-secondary-bg)", border: "1px solid var(--btn-secondary-border)", color: "var(--text-secondary)" }}
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
                style={{ background: "var(--btn-secondary-bg)", border: "1px solid var(--btn-secondary-border)", color: "var(--text-secondary)" }}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </FadeInUp>
      )}

      {/* ── Delete Confirmation Dialog ─────────────────────────────── */}
      <AlertDialog open={!!deleteTargetId} onOpenChange={(open) => { if (!open) setDeleteTargetId(null); }}>
        <AlertDialogTrigger className="hidden" />
        <AlertDialogContent
          className="max-w-sm overflow-hidden p-0 rounded-[var(--radius-xl)]"
          style={{
            background: "var(--card-bg)",
            backgroundImage: "var(--card-bg-overlay)",
            border: "1px solid var(--badge-danger-border)",
            boxShadow: "0 0 0 1px rgba(227,28,61,0.2), var(--card-shadow), 0 0 40px rgba(227,28,61,0.12)",
          }}
        >
          {/* Danger accent bar */}
          <div
            className="h-[3px] w-full"
            style={{ backgroundImage: "linear-gradient(90deg, #E31C3D 0%, #FF3B57 100%)" }}
          />

          <div className="p-6">
            <AlertDialogHeader className="items-start text-left gap-4">
              {/* Icon */}
              <div
                className="h-11 w-11 rounded-[10px] flex items-center justify-center shrink-0"
                style={{ background: "var(--badge-danger-bg)", border: "1px solid var(--badge-danger-border)" }}
              >
                <Trash2 className="h-5 w-5" style={{ color: "var(--badge-danger-text)" }} strokeWidth={2} />
              </div>

              <div className="flex flex-col gap-1">
                <AlertDialogTitle
                  className="text-[15px] font-semibold"
                  style={{ color: "var(--text-primary)", fontFamily: "var(--font-geist)" }}
                >
                  Delete Item?
                </AlertDialogTitle>
                <AlertDialogDescription
                  className="text-[13px] leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  This action is <span style={{ color: "var(--badge-danger-text)", fontWeight: 600 }}>permanent</span> and cannot be undone. The item and all its associated data will be removed.
                </AlertDialogDescription>
              </div>
            </AlertDialogHeader>

            <AlertDialogFooter className="mt-6 flex flex-row justify-end gap-2 border-0 bg-transparent p-0 -mx-0 -mb-0 rounded-none">
              <AlertDialogCancel
                className="px-4 h-9 rounded-[9px] text-[13px] font-medium border-0 transition-all duration-150"
                style={{
                  background: "var(--btn-secondary-bg)",
                  border: "1px solid var(--btn-secondary-border)",
                  color: "var(--text-secondary)",
                }}
              >
                Cancel
              </AlertDialogCancel>
              <button
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
                className="flex items-center gap-2 px-4 h-9 rounded-[9px] text-[13px] font-semibold text-white transition-all duration-150 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundImage: "linear-gradient(180deg, #FF3B57 0%, #C41230 100%)",
                  boxShadow: "0 2px 10px rgba(227,28,61,0.4)",
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
                {deleteMutation.isPending ? "Deleting…" : "Delete Item"}
              </button>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

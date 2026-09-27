"use client";

import { useDropdownStore } from "@/store/useDropdownStore";
import { DropdownTypeSelector } from "./DropdownTypeSelector";
import { DropdownListTable } from "./DropdownListTable";
import { useDropdowns } from "@/hooks/queries/useDropdowns";
import { AlertCircle, LayoutList } from "lucide-react";
import { AddDropdownDialog } from "./AddDropdownDialog";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/shared/motion";
import { SharedBreadcrumb } from "@/components/shared/SharedBreadcrumb";

/* ── Stat counts for KPI bar ────────────────────────────────── */
const TAB_LABELS: Record<string, string> = {
  classes:    "Classes",
  units:      "Units",
  categories: "Categories",
  materials:  "Materials",
  shapes:     "Shapes",
  stockUnits: "Stock Units",
};

export function DropdownsPage() {
  const { activeTab } = useDropdownStore();
  const { data, isLoading, isError, error } = useDropdowns();

  const activeLabel = TAB_LABELS[activeTab] ?? activeTab;
  const activeItems = data ? (data[activeTab] ?? []).filter((i) => !i.deletedAt) : [];
  const totalActive = activeItems.length;

  return (
    <div className="flex-1 flex flex-col gap-6 p-4 md:p-8 pt-6">

      {/* Breadcrumb */}
      <SharedBreadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Dropdowns" },
        ]}
      />

      {/* ── Page Header ──────────────────────────────────────────── */}
      <FadeInUp delay={0.0} duration={0.45}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="h-12 w-12 rounded-[12px] flex items-center justify-center shrink-0"
              style={{
                backgroundImage: "var(--gradient-primary-button)",
                boxShadow:       "var(--glow-primary-cta)",
              }}
            >
              <LayoutList className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1
                style={{
                  fontFamily:    "var(--font-geist)",
                  fontSize:      "var(--text-display-md)",
                  fontWeight:    700,
                  color:         "var(--text-primary)",
                  letterSpacing: "var(--tracking-tight)",
                  lineHeight:    "var(--leading-display-md)",
                }}
              >
                Dropdowns
              </h1>
              <p style={{ fontSize: "var(--text-body-md)", color: "var(--text-secondary)" }}>
                Manage system categories, units, classes and more
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex-1 sm:w-56">
              <DropdownTypeSelector />
            </div>
            <AddDropdownDialog />
          </div>
        </div>
      </FadeInUp>

      {/* ── KPI quick-count bar ───────────────────────────────────── */}
      <StaggerContainer delay={0.08} className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {Object.entries(TAB_LABELS).map(([key, label]) => {
          const count = data ? (data[key as keyof typeof data] as { deletedAt: string | null }[] | undefined ?? []).filter(i => !i.deletedAt).length : 0;
          const isActive = key === activeTab;
          return (
            <StaggerItem key={key}>
              <button
                onClick={() => useDropdownStore.getState().setActiveTab(key as import("@/types/dropdown.types").DropdownType)}
                className="relative overflow-hidden w-full rounded-[var(--radius-lg)] p-3 flex flex-col gap-1 text-left transition-all duration-150"
                style={{
                  background:      isActive ? "var(--tab-active-bg)"  : "var(--card-bg)",
                  backgroundImage: isActive ? undefined               : "var(--card-bg-overlay)",
                  border:          isActive ? "1px solid var(--tab-active-border)" : "1px solid var(--card-border)",
                  boxShadow:       isActive ? "var(--glow-card-crimson)" : "var(--card-shadow)",
                }}
              >
                {isActive && (
                  <div aria-hidden className="pointer-events-none absolute -top-4 -right-4 h-16 w-16 rounded-full blur-2xl" style={{ background: "rgba(227,28,61,0.15)" }} />
                )}
                <span
                  className="text-[10px] font-semibold uppercase tracking-widest truncate"
                  style={{ color: isActive ? "var(--color-crimson-400)" : "var(--text-muted)" }}
                >
                  {label}
                </span>
                <span
                  className="text-xl font-bold leading-tight"
                  style={{ color: "var(--text-primary)", fontFamily: "var(--font-geist)" }}
                >
                  {isLoading ? "—" : count}
                </span>
              </button>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      {/* ── Content card ─────────────────────────────────────────── */}
      <FadeInUp delay={0.25} duration={0.5}>
        <div
          className="rounded-[var(--radius-xl)] overflow-hidden"
          style={{
            background:      "var(--card-bg)",
            backgroundImage: "var(--card-bg-overlay)",
            border:          "1px solid var(--card-border)",
            boxShadow:       "var(--card-shadow)",
          }}
        >
          {/* Card header */}
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: "1px solid var(--table-header-border)" }}
          >
            <div>
              <h2
                className="text-[15px] font-bold capitalize"
                style={{ color: "var(--text-primary)", fontFamily: "var(--font-geist)" }}
              >
                {activeLabel}
              </h2>
              <p className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                {isLoading ? "Loading…" : `${totalActive} active record${totalActive !== 1 ? "s" : ""}`}
              </p>
            </div>
          </div>

          {/* Card body */}
          <div className="p-6">
            {isLoading ? (
              <div className="flex flex-col gap-3">
                {[100, 80, 90, 75, 85].map((w, i) => (
                  <div key={i} className="h-10 rounded-[var(--radius-md)] animate-pulse" style={{ background: "var(--card-border)", width: `${w}%`, opacity: 1 - i * 0.1 }} />
                ))}
              </div>
            ) : isError ? (
              <div
                className="flex items-center gap-3 p-4 rounded-[var(--radius-md)]"
                style={{ background: "var(--badge-danger-bg)", border: "1px solid var(--badge-danger-border)" }}
              >
                <AlertCircle className="h-5 w-5 shrink-0" style={{ color: "var(--badge-danger-text)" }} />
                <p className="text-[13px] font-medium" style={{ color: "var(--badge-danger-text)" }}>
                  Failed to load dropdowns: {error?.message}
                </p>
              </div>
            ) : (
              <DropdownListTable data={data} />
            )}
          </div>
        </div>
      </FadeInUp>
    </div>
  );
}

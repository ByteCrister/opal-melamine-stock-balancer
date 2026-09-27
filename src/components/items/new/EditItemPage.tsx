"use client";

import { useItem } from "@/hooks/queries/useItems";
import { ItemForm } from "@/components/items/ItemForm";
import { useParams } from "next/navigation";
import { SharedBreadcrumb } from "@/components/shared/SharedBreadcrumb";
import { AlertTriangle } from "lucide-react";
import { FadeInUp } from "@/components/shared/motion";

/* ─── Skeleton primitives ─────────────────────────────────────────────── */
function Pulse({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`animate-pulse rounded-[6px] ${className}`}
      style={{ background: "rgba(255,255,255,0.06)", ...style }}
    />
  );
}

function SkeletonField({ labelW = "w-20", tall = false }: { labelW?: string; tall?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <Pulse className={`h-[10px] ${labelW}`} />
      <Pulse className={`w-full rounded-[8px] ${tall ? "h-10" : "h-9"}`} />
    </div>
  );
}

function SectionLabel({ width = "w-32" }: { width?: string }) {
  return <Pulse className={`h-[9px] ${width} opacity-60`} />;
}

function ItemFormSkeleton() {
  return (
    <div
      className="max-w-4xl rounded-[var(--radius-xl)] overflow-hidden"
      style={{
        background: "var(--card-bg)",
        backgroundImage: "var(--card-bg-overlay)",
        border: "1px solid var(--card-border)",
        boxShadow: "var(--card-shadow)",
      }}
    >
      {/* Crimson accent bar */}
      <div className="h-[3px] w-full" style={{ backgroundImage: "var(--gradient-primary-button)" }} />

      {/* Header */}
      <div
        className="flex items-center gap-4 px-6 py-5"
        style={{ borderBottom: "1px solid var(--card-border)" }}
      >
        {/* Back-button ghost */}
        <Pulse className="h-8 w-8 shrink-0 rounded-[7px]" />

        <div className="flex items-center gap-3">
          {/* Icon ghost */}
          <Pulse
            className="h-9 w-9 shrink-0 rounded-[9px]"
            style={{ backgroundImage: "var(--gradient-primary-button)", opacity: 0.4 }}
          />
          <div className="flex flex-col gap-2">
            <Pulse className="h-[14px] w-40" />
            <Pulse className="h-[10px] w-56 opacity-50" />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col gap-8">

        {/* Product Identity */}
        <div className="flex flex-col gap-4">
          <SectionLabel width="w-36" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <SkeletonField labelW="w-20" />
            <SkeletonField labelW="w-24" />
            <SkeletonField labelW="w-22" />
            <SkeletonField labelW="w-20" />
          </div>
        </div>

        <div className="h-px" style={{ background: "var(--card-border)" }} />

        {/* Physical Attributes */}
        <div className="flex flex-col gap-4">
          <SectionLabel width="w-44" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <SkeletonField labelW="w-20" />
            <SkeletonField labelW="w-16" />
            <SkeletonField labelW="w-12" />
            <SkeletonField labelW="w-16" />
            <SkeletonField labelW="w-16" />
            <SkeletonField labelW="w-12" />
          </div>
        </div>

        <div className="h-px" style={{ background: "var(--card-border)" }} />

        {/* Pricing & Stock */}
        <div className="flex flex-col gap-4">
          <SectionLabel width="w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <SkeletonField labelW="w-28" />
            <SkeletonField labelW="w-32" />
            <SkeletonField labelW="w-28" />
            <SkeletonField labelW="w-12" />
            <SkeletonField labelW="w-20" />
            <SkeletonField labelW="w-16" />
          </div>
        </div>

        {/* Footer actions */}
        <div
          className="flex justify-end gap-3 pt-5"
          style={{ borderTop: "1px solid var(--card-border)" }}
        >
          <Pulse className="h-9 w-24 rounded-[9px]" />
          <Pulse className="h-9 w-32 rounded-[9px]" style={{ opacity: 0.75 }} />
        </div>
      </div>
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────────── */
export default function EditItemPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: item, isLoading, error } = useItem(id);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <SharedBreadcrumb
          items={[
            { label: "Items", href: "/items" },
            { label: "Edit Item" },
          ]}
        />
        <ItemFormSkeleton />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="flex flex-col gap-6">
        <SharedBreadcrumb
          items={[
            { label: "Items", href: "/items" },
            { label: "Error" },
          ]}
        />
        <FadeInUp>
          <div
            className="flex flex-col items-center justify-center gap-4 p-16 rounded-[var(--radius-xl)] text-center"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--badge-danger-border)",
              boxShadow: "var(--glow-card-crimson)",
            }}
          >
            <div className="h-12 w-12 rounded-xl flex items-center justify-center" style={{ background: "var(--badge-danger-bg)" }}>
              <AlertTriangle className="h-6 w-6" style={{ color: "var(--badge-danger-text)" }} />
            </div>
            <p className="font-semibold" style={{ color: "var(--text-primary)" }}>Failed to load item</p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>The item may have been deleted or the ID is invalid.</p>
          </div>
        </FadeInUp>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <SharedBreadcrumb
        items={[
          { label: "Items", href: "/items" },
          { label: `Edit: ${item.itemCode}` },
        ]}
      />
      <ItemForm initialData={item} />
    </div>
  );
}

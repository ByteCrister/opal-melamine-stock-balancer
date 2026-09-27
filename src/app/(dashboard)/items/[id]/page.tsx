"use client";

import { useItem } from "@/hooks/queries/useItems";
import { ItemForm } from "@/components/items/ItemForm";
import { useParams } from "next/navigation";
import { SharedBreadcrumb } from "@/components/shared/SharedBreadcrumb";
import { AlertTriangle } from "lucide-react";
import { FadeInUp } from "@/components/shared/motion";

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
        {/* Skeleton */}
        <div
          className="max-w-4xl rounded-[var(--radius-xl)] overflow-hidden animate-pulse"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--card-border)",
            boxShadow: "var(--card-shadow)",
          }}
        >
          <div className="h-[3px] w-full" style={{ backgroundImage: "var(--gradient-primary-button)" }} />
          <div className="p-6 flex flex-col gap-6">
            <div className="h-8 w-48 rounded-lg" style={{ background: "var(--card-border)" }} />
            <div className="grid grid-cols-2 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="h-3 w-20 rounded" style={{ background: "var(--card-border)" }} />
                  <div className="h-9 w-full rounded-[var(--radius-md)]" style={{ background: "var(--card-border)" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
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

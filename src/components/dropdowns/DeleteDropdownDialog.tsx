"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDropdownStore } from "@/store/useDropdownStore";
import { useDeleteDropdownItem } from "@/hooks/mutations/useDropdownMutations";
import { ClassOption, DropdownItem } from "@/types/dropdown.types";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";

interface DeleteDropdownDialogProps {
  item:         ClassOption | DropdownItem | null;
  open:         boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteDropdownDialog({ item, open, onOpenChange }: DeleteDropdownDialogProps) {
  const { activeTab }  = useDropdownStore();
  const { mutateAsync: deleteItem, isPending } = useDeleteDropdownItem();

  const isClasses = activeTab === "classes";
  const typeName  = activeTab.replace(/([A-Z])/g, " $1").trim();
  const singular  = typeName.endsWith("s") ? typeName.slice(0, -1) : typeName;

  const itemName = item
    ? isClasses
      ? `${(item as ClassOption).code} — ${(item as ClassOption).className}`
      : (item as DropdownItem).value
    : "";

  const handleDelete = async () => {
    if (!item) return;
    try {
      await deleteItem({ type: activeTab, itemId: item._id });
      onOpenChange(false);
    } catch {
      // handled by mutation hook
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className="p-0 overflow-hidden"
        style={{
          background:      "var(--dialog-bg)",
          border:          "1px solid var(--badge-danger-border)",
          boxShadow:       "var(--glow-card-crimson), var(--elevation-4)",
          borderRadius:    "var(--dialog-radius)",
          maxWidth:        "440px",
        }}
      >
        {/* gloss overlay */}
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundImage: "var(--dialog-bg-overlay)" }} />
        <div aria-hidden className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full blur-3xl" style={{ background: "rgba(227,28,61,0.12)" }} />

        {/* Header */}
        <AlertDialogHeader
          className="relative px-6 pt-6 pb-4 text-left"
          style={{ borderBottom: "1px solid var(--border-subtle)" }}
        >
          <div className="flex items-start gap-3">
            <div
              className="h-9 w-9 rounded-[9px] flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: "var(--badge-danger-bg)", border: "1px solid var(--badge-danger-border)" }}
            >
              <AlertTriangle className="h-4 w-4" style={{ color: "var(--badge-danger-text)" }} strokeWidth={2.5} />
            </div>
            <div>
              <AlertDialogTitle
                className="text-[16px] font-bold"
                style={{ color: "var(--text-primary)", fontFamily: "var(--font-geist)" }}
              >
                Delete {singular}
              </AlertDialogTitle>
              <p className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                This action cannot be undone.
              </p>
            </div>
          </div>
        </AlertDialogHeader>

        {/* Body */}
        <div className="relative px-6 py-5">
          <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
            You are about to permanently delete the {singular.toLowerCase()}:{" "}
            <span
              className="font-bold px-1.5 py-0.5 rounded"
              style={{ color: "var(--badge-danger-text)", background: "var(--badge-danger-bg)" }}
            >
              {itemName}
            </span>
            {". "}
            Records using this value may be affected.
          </p>

          <div className="flex justify-end gap-2 mt-6">
            <AlertDialogCancel
              disabled={isPending}
              className="h-9 px-4 rounded-[9px] text-[13px] font-medium"
              style={{
                background: "var(--btn-secondary-bg)",
                border:     "1px solid var(--btn-secondary-border)",
                color:      "var(--text-secondary)",
              }}
            >
              Cancel
            </AlertDialogCancel>
            <button
              onClick={(e) => { e.preventDefault(); handleDelete(); }}
              disabled={isPending}
              className="h-9 px-5 rounded-[9px] text-[13px] font-semibold flex items-center gap-2 transition-all duration-150 hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                backgroundImage: "linear-gradient(180deg, var(--color-crimson-400) 0%, var(--color-crimson-600) 100%)",
                boxShadow:       "var(--glow-primary-cta)",
                color:           "#fff",
              }}
            >
              {isPending
                ? <><Loader2 className="h-3.5 w-3.5 animate-spin" />Deleting…</>
                : <><Trash2 className="h-3.5 w-3.5" />Delete</>}
            </button>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

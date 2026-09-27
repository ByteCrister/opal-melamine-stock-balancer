"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Loader2, LayoutList } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDropdownStore } from "@/store/useDropdownStore";
import { useAddDropdownItem } from "@/hooks/mutations/useDropdownMutations";

interface DropdownFormData {
  code?:      string;
  className?: string;
  value?:     string;
}

/* ── shared field label ─────────────────────────────────────── */
const FieldLabel = ({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) => (
  <Label
    htmlFor={htmlFor}
    className="text-[12px] font-semibold uppercase tracking-wider"
    style={{ color: "var(--text-muted)" }}
  >
    {children}
  </Label>
);

/* ── shared field error ─────────────────────────────────────── */
const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <p className="text-[11px] mt-0.5" style={{ color: "var(--badge-danger-text)" }}>{message}</p>
  ) : null;

/* ── shared input style ─────────────────────────────────────── */
const inputStyle: React.CSSProperties = {
  background:   "var(--input-bg)",
  border:       "1px solid var(--input-border)",
  color:        "var(--input-text)",
  borderRadius: "var(--input-radius)",
};

export function AddDropdownDialog() {
  const [open, setOpen] = useState(false);
  const { activeTab }   = useDropdownStore();
  const { mutateAsync: addItem, isPending } = useAddDropdownItem();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<DropdownFormData>({
    shouldUnregister: true
  });

  const isClasses = activeTab === "classes";
  const typeName  = activeTab.replace(/([A-Z])/g, " $1").trim();
  const singular  = typeName.endsWith("s") ? typeName.slice(0, -1) : typeName;

  const onSubmit = async (data: DropdownFormData) => {
    try {
      if (isClasses) {
        await addItem({ type: activeTab, code: data.code, className: data.className });
      } else {
        await addItem({ type: activeTab, value: data.value });
      }
      setOpen(false);
      reset();
    } catch {
      // handled by mutation hook
    }
  };

  const handleOpenChange = (v: boolean) => {
    setOpen(v);
    if (!v) reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <button
            className="shrink-0 flex items-center gap-2 px-4 h-9 rounded-[9px] text-[13px] font-semibold text-white transition-all duration-150 hover:brightness-110 focus-visible:ring-2 focus-visible:ring-[var(--color-crimson-400)]"
            style={{
              backgroundImage: "var(--gradient-primary-button)",
              boxShadow:       "var(--glow-primary-cta)",
            }}
          />
        }
      >
        <Plus className="h-4 w-4" strokeWidth={2.5} />
        Add {singular}
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-[440px] p-0 overflow-hidden"
        style={{
          background:      "var(--dialog-bg)",
          backgroundImage: "var(--dialog-bg-overlay)",
          border:          "1px solid var(--dialog-border)",
          boxShadow:       "var(--glow-primary-cta), var(--elevation-4)",
          borderRadius:    "var(--dialog-radius)",
        }}
      >
        {/* gloss overlay */}
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundImage: "var(--dialog-bg-overlay)" }} />

        {/* Header */}
        <DialogHeader
          className="relative px-6 pt-6 pb-4"
          style={{ borderBottom: "1px solid var(--border-subtle)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-[9px] flex items-center justify-center shrink-0"
              style={{ backgroundImage: "var(--gradient-primary-button)", boxShadow: "var(--glow-primary-cta)" }}
            >
              <LayoutList className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <DialogTitle
                className="text-[16px] font-bold"
                style={{ color: "var(--text-primary)", fontFamily: "var(--font-geist)" }}
              >
                Add {singular}
              </DialogTitle>
              <p className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                Fill in the details and save.
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="relative px-6 pt-5 pb-6 space-y-4">
          {isClasses ? (
            <>
              <div className="grid gap-1.5">
                <FieldLabel htmlFor="code">Class Code *</FieldLabel>
                <Input id="code" placeholder="e.g. A" className="h-9 text-[13px]" style={inputStyle} {...register("code", { required: "Code is required" })} />
                <FieldError message={errors.code?.message as string} />
              </div>
              <div className="grid gap-1.5">
                <FieldLabel htmlFor="className">Class Name *</FieldLabel>
                <Input id="className" placeholder="e.g. Premium" className="h-9 text-[13px]" style={inputStyle} {...register("className", { required: "Class name is required" })} />
                <FieldError message={errors.className?.message as string} />
              </div>
            </>
          ) : (
            <div className="grid gap-1.5">
              <FieldLabel htmlFor="value">Value *</FieldLabel>
              <Input id="value" placeholder={`Enter ${singular.toLowerCase()} name…`} className="h-9 text-[13px]" style={inputStyle} {...register("value", { required: "Value is required" })} />
              <FieldError message={errors.value?.message as string} />
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={isPending}
              className="h-9 px-4 rounded-[9px] text-[13px] font-medium transition-colors duration-150 disabled:opacity-50"
              style={{
                background: "var(--btn-secondary-bg)",
                border:     "1px solid var(--btn-secondary-border)",
                color:      "var(--text-secondary)",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="h-9 px-5 rounded-[9px] text-[13px] font-semibold text-white flex items-center gap-2 transition-all duration-150 hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                backgroundImage: "var(--gradient-primary-button)",
                boxShadow:       "var(--glow-primary-cta)",
              }}
            >
              {isPending ? <><Loader2 className="h-3.5 w-3.5 animate-spin" />Saving…</> : "Save"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

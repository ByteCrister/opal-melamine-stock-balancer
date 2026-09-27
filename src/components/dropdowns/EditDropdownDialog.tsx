"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDropdownStore } from "@/store/useDropdownStore";
import { useUpdateDropdownItem } from "@/hooks/mutations/useDropdownMutations";
import { ClassOption, DropdownItem } from "@/types/dropdown.types";
import { Pencil, Loader2 } from "lucide-react";

interface EditDropdownDialogProps {
  item:         ClassOption | DropdownItem | null;
  open:         boolean;
  onOpenChange: (open: boolean) => void;
}

interface DropdownFormData {
  code?:      string;
  className?: string;
  value?:     string;
}

/* ── Module-level helpers ───────────────────────────────────── */
const FieldLabel = ({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) => (
  <Label
    htmlFor={htmlFor}
    className="text-[12px] font-semibold uppercase tracking-wider"
    style={{ color: "var(--text-muted)" }}
  >
    {children}
  </Label>
);

const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <p className="text-[11px] mt-0.5" style={{ color: "var(--badge-danger-text)" }}>{message}</p>
  ) : null;

const inputStyle: React.CSSProperties = {
  background:   "var(--input-bg)",
  border:       "1px solid var(--input-border)",
  color:        "var(--input-text)",
  borderRadius: "var(--input-radius)",
};

export function EditDropdownDialog({ item, open, onOpenChange }: EditDropdownDialogProps) {
  const { activeTab }  = useDropdownStore();
  const { mutateAsync: updateItem, isPending } = useUpdateDropdownItem();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<DropdownFormData>({
    shouldUnregister: true
  });

  const isClasses = activeTab === "classes";
  const typeName  = activeTab.replace(/([A-Z])/g, " $1").trim();
  const singular  = typeName.endsWith("s") ? typeName.slice(0, -1) : typeName;

  useEffect(() => {
    if (item && open) {
      if (isClasses) {
        reset({ code: (item as ClassOption).code, className: (item as ClassOption).className });
      } else {
        reset({ value: (item as DropdownItem).value });
      }
    }
  }, [item, open, isClasses, reset]);

  const onSubmit = async (data: DropdownFormData) => {
    if (!item) return;
    try {
      if (isClasses) {
        await updateItem({ type: activeTab, itemId: item._id, code: data.code, className: data.className });
      } else {
        await updateItem({ type: activeTab, itemId: item._id, value: data.value });
      }
      onOpenChange(false);
    } catch {
      // handled by mutation hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[440px] p-0 overflow-hidden"
        style={{
          background:      "var(--dialog-bg)",
          backgroundImage: "var(--dialog-bg-overlay)",
          border:          "1px solid var(--dialog-border)",
          boxShadow:       "var(--glow-info), var(--elevation-4)",
          borderRadius:    "var(--dialog-radius)",
        }}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundImage: "var(--dialog-bg-overlay)" }} />

        <DialogHeader
          className="relative px-6 pt-6 pb-4"
          style={{ borderBottom: "1px solid var(--border-subtle)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-[9px] flex items-center justify-center shrink-0"
              style={{ background: "var(--badge-info-bg)", border: "1px solid var(--badge-info-border)" }}
            >
              <Pencil className="h-4 w-4" style={{ color: "var(--badge-info-text)" }} strokeWidth={2.5} />
            </div>
            <div>
              <DialogTitle
                className="text-[16px] font-bold"
                style={{ color: "var(--text-primary)", fontFamily: "var(--font-geist)" }}
              >
                Edit {singular}
              </DialogTitle>
              <p className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                Update the details below and save.
              </p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="relative px-6 pt-5 pb-6 space-y-4">
          {isClasses ? (
            <>
              <div className="grid gap-1.5">
                <FieldLabel htmlFor="edit-code">Class Code *</FieldLabel>
                <Input id="edit-code" className="h-9 text-[13px]" style={inputStyle} {...register("code", { required: "Code is required" })} />
                <FieldError message={errors.code?.message as string} />
              </div>
              <div className="grid gap-1.5">
                <FieldLabel htmlFor="edit-className">Class Name *</FieldLabel>
                <Input id="edit-className" className="h-9 text-[13px]" style={inputStyle} {...register("className", { required: "Class name is required" })} />
                <FieldError message={errors.className?.message as string} />
              </div>
            </>
          ) : (
            <div className="grid gap-1.5">
              <FieldLabel htmlFor="edit-value">Value *</FieldLabel>
              <Input id="edit-value" className="h-9 text-[13px]" style={inputStyle} {...register("value", { required: "Value is required" })} />
              <FieldError message={errors.value?.message as string} />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
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
                background: "var(--badge-info-bg)",
                border:     "1px solid var(--badge-info-border)",
                color:      "var(--badge-info-text)",
              }}
            >
              {isPending ? <><Loader2 className="h-3.5 w-3.5 animate-spin" />Saving…</> : <><Pencil className="h-3.5 w-3.5" />Save Changes</>}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

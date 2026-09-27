"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createStockMovementSchema,
  CreateStockMovementFormValues,
  CreateStockMovementFormInput,
  UpdateStockMovementFormValues,
} from "@/utils/zod/stock-movement.schema";
import {
  useCreateStockMovement,
  useUpdateStockMovement,
} from "@/hooks/mutations/useStockMovementsMutations";
import { useActiveItemsOptions } from "@/hooks/queries/useItems";
import { StockMovement } from "@/types/stock-movements.types";
import { StockMovementType } from "@/const/stock.const";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, ArrowDownToLine, ArrowUpFromLine, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface StockMovementDialogProps {
  type: StockMovementType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: StockMovement | null;
}

/* ── Shared input style ─────────────────────────────────────── */
const inputStyle: React.CSSProperties = {
  background: "var(--input-bg)",
  border: "1px solid var(--input-border)",
  color: "var(--input-text)",
  borderRadius: "var(--input-radius)",
};

/* ── Label helper ─────────────────────────────────────────────── */
const FieldLabel = ({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) => (
  <Label
    htmlFor={htmlFor}
    className="text-[12px] font-semibold uppercase tracking-wider"
    style={{ color: "var(--text-muted)" }}
  >
    {children}
  </Label>
);

/* ── Error text helper ─────────────────────────────────────────── */
const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <p className="text-[11px] mt-0.5" style={{ color: "var(--badge-danger-text)" }}>
      {message}
    </p>
  ) : null;

export function StockMovementDialog({
  type,
  open,
  onOpenChange,
  initialData,
}: StockMovementDialogProps) {
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const isIn = type === "IN";
  const title = isIn ? "Stock In" : "Stock Out";
  const accentColor = isIn ? "var(--color-status-success)" : "var(--color-crimson-400)";
  const accentBg = isIn ? "var(--badge-success-bg)" : "var(--badge-danger-bg)";
  const accentBorder = isIn ? "var(--badge-success-border)" : "var(--badge-danger-border)";
  const Icon = isIn ? ArrowDownToLine : ArrowUpFromLine;

  const createMutation = useCreateStockMovement(type);
  const updateMutation = useUpdateStockMovement(type);
  const { data: activeItems = [], isLoading: isLoadingItems } = useActiveItemsOptions();

  const form = useForm<CreateStockMovementFormInput, unknown, CreateStockMovementFormValues>({
    resolver: zodResolver(createStockMovementSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      itemId: "",
      itemCode: "",
      itemName: "",
      quantity: 0,
      unit: "",
      remarks: "",
    },
  });

  /* Reset when dialog opens / data changes */
  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          date: new Date(initialData.date).toISOString().split("T")[0],
          itemId: initialData.itemId,
          itemCode: initialData.itemCode,
          itemName: initialData.itemName,
          quantity: initialData.quantity,
          unit: initialData.unit,
          remarks: initialData.remarks || "",
        });
      } else {
        form.reset({
          date: new Date().toISOString().split("T")[0],
          itemId: "",
          itemCode: "",
          itemName: "",
          quantity: 0,
          unit: "",
          remarks: "",
        });
      }
    }
  }, [open, initialData, form]);

  const onSubmit = (data: CreateStockMovementFormValues) => {
    if (initialData) {
      updateMutation.mutate(
        { id: initialData._id, payload: data as UpdateStockMovementFormValues },
        {
          onSuccess: () => {
            toast.success(`${title} updated successfully`);
            onOpenChange(false);
          },
          onError: (err: Error) => toast.error(err.message),
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          toast.success(`${title} recorded successfully`);
          onOpenChange(false);
        },
        onError: (err: Error) => toast.error(err.message),
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[520px] p-0 overflow-hidden"
        style={{
          background: "var(--dialog-bg)",
          border: `1px solid ${accentBorder}`,
          boxShadow: isIn
            ? "var(--glow-success), var(--elevation-4)"
            : "var(--glow-card-crimson), var(--elevation-4)",
          borderRadius: "var(--dialog-radius)",
        }}
      >
        {/* ── Gloss overlay ──────────────────────────────────────── */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: "var(--dialog-bg-overlay)" }}
        />

        {/* ── Header ─────────────────────────────────────────────── */}
        <DialogHeader
          className="relative px-6 pt-6 pb-4"
          style={{ borderBottom: "1px solid var(--border-subtle)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-[9px] flex items-center justify-center shrink-0"
              style={{ background: accentBg, border: `1px solid ${accentBorder}` }}
            >
              <Icon className="h-4 w-4" style={{ color: accentColor }} strokeWidth={2.5} />
            </div>
            <div>
              <DialogTitle
                className="text-[16px] font-bold"
                style={{ color: "var(--text-primary)", fontFamily: "var(--font-geist)" }}
              >
                {initialData ? `Edit ${title}` : `Add ${title}`}
              </DialogTitle>
              <p className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                {initialData ? "Update the record details below" : "Fill in the details to record this movement"}
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* ── Form ───────────────────────────────────────────────── */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="relative px-6 pt-5 pb-6 space-y-5">

          {/* Date */}
          <div className="grid gap-1.5">
            <FieldLabel htmlFor="date">Date *</FieldLabel>
            <Input
              id="date"
              type="date"
              className="h-9 text-[13px]"
              style={inputStyle}
              {...form.register("date")}
            />
            <FieldError message={form.formState.errors.date?.message} />
          </div>

          {/* Item Combobox */}
          <div className="grid gap-1.5">
            <FieldLabel>Item *</FieldLabel>
            <Controller
              control={form.control}
              name="itemId"
              render={({ field }) => (
                <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                  <PopoverTrigger
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "w-full justify-between font-normal h-9 text-[13px]",
                      !field.value && "text-muted-foreground"
                    )}
                    style={{
                      background: "var(--input-bg)",
                      border: "1px solid var(--input-border)",
                      color: field.value ? "var(--input-text)" : "var(--input-placeholder)",
                      borderRadius: "var(--input-radius)",
                    }}
                  >
                    {field.value
                      ? (() => {
                          const found = activeItems.find((i) => i._id === field.value);
                          return found ? `${found.itemCode} — ${found.itemName}` : "Select item…";
                        })()
                      : isLoadingItems
                      ? "Loading items…"
                      : "Select item…"}
                    <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[470px] p-0"
                    style={{
                      background: "var(--dialog-bg)",
                      border: "1px solid var(--card-border)",
                      boxShadow: "var(--elevation-3)",
                      borderRadius: "var(--radius-md)",
                    }}
                  >
                    <Command>
                      <CommandInput
                        placeholder="Search item code or name…"
                        className="text-[13px]"
                        style={{ color: "var(--input-text)" }}
                      />
                      <CommandList>
                        <CommandEmpty
                          className="text-[13px] py-4 text-center"
                          style={{ color: "var(--text-muted)" }}
                        >
                          No item found.
                        </CommandEmpty>
                        <CommandGroup>
                          {activeItems.map((item) => (
                            <CommandItem
                              key={item._id}
                              value={`${item.itemCode} ${item.itemName}`}
                              className="text-[13px] cursor-pointer"
                              onSelect={() => {
                                form.setValue("itemId", item._id);
                                form.setValue("itemCode", item.itemCode);
                                form.setValue("itemName", item.itemName);
                                form.setValue("unit", item.unit);
                                setComboboxOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-3.5 w-3.5",
                                  field.value === item._id ? "opacity-100" : "opacity-0"
                                )}
                                style={{ color: accentColor }}
                              />
                              <span
                                className="font-semibold mr-1.5 text-[11px] px-1.5 py-0.5 rounded"
                                style={{
                                  background: "var(--badge-neutral-bg)",
                                  color: "var(--badge-neutral-text)",
                                }}
                              >
                                {item.itemCode}
                              </span>
                              <span style={{ color: "var(--text-secondary)" }}>{item.itemName}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
            />
            <FieldError message={form.formState.errors.itemId?.message} />
          </div>

          {/* Quantity + Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <FieldLabel htmlFor="quantity">Quantity *</FieldLabel>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                className="h-9 text-[13px]"
                style={inputStyle}
                {...form.register("quantity")}
              />
              <FieldError message={form.formState.errors.quantity?.message} />
            </div>
            <div className="grid gap-1.5">
              <FieldLabel htmlFor="unit">Unit</FieldLabel>
              <Input
                id="unit"
                readOnly
                placeholder="Auto-filled from item"
                className="h-9 text-[13px] cursor-default"
                style={{ ...inputStyle, opacity: 0.7 }}
                {...form.register("unit")}
              />
              <FieldError message={form.formState.errors.unit?.message} />
            </div>
          </div>

          {/* Remarks */}
          <div className="grid gap-1.5">
            <FieldLabel htmlFor="remarks">Remarks</FieldLabel>
            <Input
              id="remarks"
              placeholder="Optional notes…"
              className="h-9 text-[13px]"
              style={inputStyle}
              {...form.register("remarks")}
            />
          </div>

          {/* ── Footer ───────────────────────────────────────────── */}
          <DialogFooter className="pt-2 gap-2 flex-row justify-end">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="h-9 px-4 rounded-[9px] text-[13px] font-medium transition-colors duration-150 disabled:opacity-50"
              style={{
                background: "var(--btn-secondary-bg)",
                border: "1px solid var(--btn-secondary-border)",
                color: "var(--text-secondary)",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="h-9 px-5 rounded-[9px] text-[13px] font-semibold text-white flex items-center gap-2 transition-all duration-150 hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                backgroundImage: isIn
                  ? "linear-gradient(180deg, #2FBF71 0%, #1E8F52 100%)"
                  : "var(--gradient-primary-button)",
                boxShadow: isIn
                  ? "0 0 0 1px rgba(47,191,113,0.45), 0 4px 20px rgba(47,191,113,0.30)"
                  : "var(--glow-primary-cta)",
              }}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
                  {initialData ? "Update" : "Save Record"}
                </>
              )}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

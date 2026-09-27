"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Resolver, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createItemSchema, CreateItemFormValues } from "@/utils/zod/item.schema";
import { useCreateItem, useUpdateItem } from "@/hooks/mutations/useItemsMutations";
import { useDropdowns } from "@/hooks/queries/useDropdowns";
import { Item } from "@/types/item.types";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft, Save, Package } from "lucide-react";
import Link from "next/link";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/shared/motion";

interface ItemFormProps {
  initialData?: Item;
}

/* Shared select style applied via inline style */
const selectStyle: React.CSSProperties = {
  background: "var(--input-bg)",
  border: "1px solid var(--input-border)",
  color: "var(--input-text)",
  borderRadius: "var(--input-radius)",
};

/* Labelled field wrapper */
function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-[11.5px] font-semibold uppercase tracking-wider"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
        {required && <span className="ml-0.5" style={{ color: "var(--color-crimson-400)" }}>*</span>}
      </label>
      {children}
      {error && (
        <span className="text-[11px]" style={{ color: "var(--badge-danger-text)" }}>
          {error}
        </span>
      )}
    </div>
  );
}

export function ItemForm({ initialData }: ItemFormProps) {
  const router = useRouter();
  const createMutation = useCreateItem();
  const updateMutation = useUpdateItem();
  const { data: dropdowns, isLoading: isLoadingDropdowns } = useDropdowns();

  const form = useForm<CreateItemFormValues>({
    resolver: zodResolver(createItemSchema) as unknown as Resolver<CreateItemFormValues>,
    mode: "onChange",
    defaultValues: initialData || {
      itemCode: "", itemName: "", classCode: "", className: "",
      category: "", material: "", shape: "", size: "", color: "",
      design: "", unit: "", reorderLevel: 0, dp: 0, tp: 0, mrp: 0,
      doUnit: "", doQty: 0,
    },
  });

  const classCode = useWatch({
    control: form.control,
    name: "classCode",
  });
  useEffect(() => {
    if (classCode && dropdowns) {
      const selectedClass = dropdowns.classes?.find(c => c.code === classCode);
      form.setValue("className", selectedClass ? selectedClass.className : "");
    }
  }, [classCode, dropdowns, form]);

  const onSubmit = async (data: CreateItemFormValues) => {
    try {
      if (initialData) {
        await updateMutation.mutateAsync({ id: initialData._id, payload: data });
        toast.success("Item updated successfully");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Item created successfully");
      }
      router.push("/items");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An unknown error occurred");
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;
  const isEdit = !!initialData;

  /* Shared select className */
  const selectCls =
    "flex h-9 w-full rounded-[var(--input-radius)] px-3 py-2 text-[13px] outline-none transition-all duration-150 focus:ring-2 focus:ring-[rgba(227,28,61,0.25)] focus:border-[rgba(227,28,61,0.6)]";

  return (
    <FadeInUp delay={0.1} duration={0.5}>
      <div
        className="max-w-4xl rounded-[var(--radius-xl)] overflow-hidden"
        style={{
          background: "var(--card-bg)",
          backgroundImage: "var(--card-bg-overlay)",
          border: "1px solid var(--card-border)",
          boxShadow: "var(--card-shadow)",
        }}
      >
        {/* Top accent bar */}
        <div className="h-[3px] w-full" style={{ backgroundImage: "var(--gradient-primary-button)" }} />

        {/* Header */}
        <div
          className="flex items-center gap-4 px-6 py-5"
          style={{ borderBottom: "1px solid var(--card-border)" }}
        >
          <Link href="/items">
            <button
              className="h-8 w-8 rounded-[7px] flex items-center justify-center transition-colors duration-100"
              style={{ background: "var(--btn-secondary-bg)", border: "1px solid var(--btn-secondary-border)", color: "var(--text-secondary)" }}
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          </Link>

          {/* Icon + title */}
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-[9px] flex items-center justify-center shrink-0"
              style={{ backgroundImage: "var(--gradient-primary-button)", boxShadow: "0 2px 10px rgba(227,28,61,0.35)" }}
            >
              <Package className="h-4 w-4 text-white" strokeWidth={2} />
            </div>
            <div>
              <h2
                className="text-[15px] font-semibold leading-snug"
                style={{ color: "var(--text-primary)", fontFamily: "var(--font-geist)" }}
              >
                {isEdit ? "Edit Item" : "Create New Item"}
              </h2>
              <p className="text-[12px] leading-snug" style={{ color: "var(--text-muted)" }}>
                {isEdit ? `Editing: ${initialData.itemCode}` : "Fill in the details below to add a new product"}
              </p>
            </div>
          </div>
        </div>

        {/* Form body */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6">

          {/* Section: Identity */}
          <p className="text-[10.5px] font-bold uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
            Product Identity
          </p>
          <StaggerContainer delay={0.05} className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            <StaggerItem>
              <Field label="Item Code" required error={form.formState.errors.itemCode?.message}>
                <Input
                  {...form.register("itemCode")}
                  placeholder="E.g., OPL-101"
                  className="h-9 text-[13px] uppercase"
                  style={{ background: "var(--input-bg)", border: "1px solid var(--input-border)", color: "var(--input-text)" }}
                />
              </Field>
            </StaggerItem>
            <StaggerItem>
              <Field label="Item Name" required error={form.formState.errors.itemName?.message}>
                <Input
                  {...form.register("itemName")}
                  placeholder="E.g., Dinner Plate"
                  className="h-9 text-[13px]"
                  style={{ background: "var(--input-bg)", border: "1px solid var(--input-border)", color: "var(--input-text)" }}
                />
              </Field>
            </StaggerItem>
            <StaggerItem>
              <Field label="Class Code">
                <select {...form.register("classCode")} className={selectCls} style={selectStyle}>
                  <option value="">Select a class</option>
                  {dropdowns?.classes?.map(c => (
                    <option key={c.code} value={c.code}>{c.code} — {c.className}</option>
                  ))}
                </select>
                <input type="hidden" {...form.register("className")} />
              </Field>
            </StaggerItem>
            <StaggerItem>
              <Field label="Category" required error={form.formState.errors.category?.message}>
                <select {...form.register("category")} className={selectCls} style={selectStyle}>
                  <option value="">Select Category</option>
                  {dropdowns?.categories?.map(c => (
                    <option key={c.value} value={c.value}>{c.value}</option>
                  ))}
                </select>
              </Field>
            </StaggerItem>
          </StaggerContainer>

          {/* Section: Physical Attributes */}
          <p className="text-[10.5px] font-bold uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
            Physical Attributes
          </p>
          <StaggerContainer delay={0.1} className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            <StaggerItem>
              <Field label="Material">
                <select {...form.register("material")} className={selectCls} style={selectStyle}>
                  <option value="">Select Material</option>
                  {dropdowns?.materials?.map(c => (
                    <option key={c.value} value={c.value}>{c.value}</option>
                  ))}
                </select>
              </Field>
            </StaggerItem>
            <StaggerItem>
              <Field label="Shape">
                <select {...form.register("shape")} className={selectCls} style={selectStyle}>
                  <option value="">Select Shape</option>
                  {dropdowns?.shapes?.map(c => (
                    <option key={c.value} value={c.value}>{c.value}</option>
                  ))}
                </select>
              </Field>
            </StaggerItem>
            <StaggerItem>
              <Field label="Size">
                <Input
                  {...form.register("size")}
                  placeholder="E.g., 10 inch"
                  className="h-9 text-[13px]"
                  style={{ background: "var(--input-bg)", border: "1px solid var(--input-border)", color: "var(--input-text)" }}
                />
              </Field>
            </StaggerItem>
            <StaggerItem>
              <Field label="Color">
                <Input
                  {...form.register("color")}
                  placeholder="E.g., White"
                  className="h-9 text-[13px]"
                  style={{ background: "var(--input-bg)", border: "1px solid var(--input-border)", color: "var(--input-text)" }}
                />
              </Field>
            </StaggerItem>
            <StaggerItem>
              <Field label="Design">
                <Input
                  {...form.register("design")}
                  placeholder="E.g., Floral"
                  className="h-9 text-[13px]"
                  style={{ background: "var(--input-bg)", border: "1px solid var(--input-border)", color: "var(--input-text)" }}
                />
              </Field>
            </StaggerItem>
            <StaggerItem>
              <Field label="Unit" required error={form.formState.errors.unit?.message}>
                <select {...form.register("unit")} className={selectCls} style={selectStyle}>
                  <option value="">Select Unit</option>
                  {dropdowns?.units?.map(c => (
                    <option key={c.value} value={c.value}>{c.value}</option>
                  ))}
                </select>
              </Field>
            </StaggerItem>
          </StaggerContainer>

          {/* Section: Pricing & Stock */}
          <p className="text-[10.5px] font-bold uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
            Pricing & Stock Levels
          </p>
          <StaggerContainer delay={0.15} className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            <StaggerItem>
              <Field label="Reorder Level" error={form.formState.errors.reorderLevel?.message}>
                <Input type="number" {...form.register("reorderLevel")} placeholder="0" className="h-9 text-[13px]"
                  style={{ background: "var(--input-bg)", border: "1px solid var(--input-border)", color: "var(--input-text)" }} />
              </Field>
            </StaggerItem>
            <StaggerItem>
              <Field label="Dealer Price (DP)">
                <Input type="number" step="0.01" {...form.register("dp")} placeholder="0.00" className="h-9 text-[13px]"
                  style={{ background: "var(--input-bg)", border: "1px solid var(--input-border)", color: "var(--input-text)" }} />
              </Field>
            </StaggerItem>
            <StaggerItem>
              <Field label="Trade Price (TP)">
                <Input type="number" step="0.01" {...form.register("tp")} placeholder="0.00" className="h-9 text-[13px]"
                  style={{ background: "var(--input-bg)", border: "1px solid var(--input-border)", color: "var(--input-text)" }} />
              </Field>
            </StaggerItem>
            <StaggerItem>
              <Field label="MRP">
                <Input type="number" step="0.01" {...form.register("mrp")} placeholder="0.00" className="h-9 text-[13px]"
                  style={{ background: "var(--input-bg)", border: "1px solid var(--input-border)", color: "var(--input-text)" }} />
              </Field>
            </StaggerItem>
            <StaggerItem>
              <Field label="DO Unit">
                <select {...form.register("doUnit")} className={selectCls} style={selectStyle}>
                  <option value="">Select DO Unit</option>
                  {dropdowns?.stockUnits?.map(c => (
                    <option key={c.value} value={c.value}>{c.value}</option>
                  ))}
                </select>
              </Field>
            </StaggerItem>
            <StaggerItem>
              <Field label="DO Qty">
                <Input type="number" {...form.register("doQty")} placeholder="0" className="h-9 text-[13px]"
                  style={{ background: "var(--input-bg)", border: "1px solid var(--input-border)", color: "var(--input-text)" }} />
              </Field>
            </StaggerItem>
          </StaggerContainer>

          {/* Footer actions */}
          <div
            className="flex justify-end gap-3 pt-5"
            style={{ borderTop: "1px solid var(--card-border)" }}
          >
            <Link href="/items">
              <button
                type="button"
                disabled={isPending}
                className="px-5 h-9 rounded-[9px] text-[13px] font-medium transition-all duration-150 disabled:opacity-50"
                style={{ background: "var(--btn-secondary-bg)", border: "1px solid var(--btn-secondary-border)", color: "var(--text-secondary)" }}
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              disabled={isPending || isLoadingDropdowns}
              className="flex items-center gap-2 px-5 h-9 rounded-[9px] text-[13px] font-semibold text-white transition-all duration-150 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[var(--color-crimson-400)]"
              style={{ backgroundImage: "var(--gradient-primary-button)", boxShadow: "var(--glow-primary-cta)" }}
            >
              <Save className="h-3.5 w-3.5" />
              {isPending ? "Saving…" : isEdit ? "Update Item" : "Create Item"}
            </button>
          </div>
        </form>
      </div>
    </FadeInUp>
  );
}

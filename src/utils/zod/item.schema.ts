import { z } from "zod";

export const createItemSchema = z.object({
  itemCode: z.string().min(1, "Item Code is required").trim().toUpperCase(),
  itemName: z.string().min(1, "Item Name is required").trim(),
  classId: z.string().trim().optional(),
  categoryId: z.string().min(1, "Category is required").trim(),
  materialId: z.string().trim().optional(),
  shapeId: z.string().trim().optional(),
  size: z.string().trim().optional(),
  color: z.string().trim().optional(),
  design: z.string().trim().optional(),
  unitId: z.string().min(1, "Unit is required").trim(),
  reorderLevel: z.preprocess((v) => (v === "" ? undefined : v), z.coerce.number({ error: "Must be a valid number" }).min(0, "Cannot be negative")).default(0),
  dp: z.preprocess((v) => (v === "" ? undefined : v), z.coerce.number({ error: "Must be a valid number" }).min(0, "Cannot be negative").optional()),
  tp: z.preprocess((v) => (v === "" ? undefined : v), z.coerce.number({ error: "Must be a valid number" }).min(0, "Cannot be negative").optional()),
  mrp: z.preprocess((v) => (v === "" ? undefined : v), z.coerce.number({ error: "Must be a valid number" }).min(0, "Cannot be negative").optional()),
  doUnitId: z.string().trim().optional(),
  doQty: z.preprocess((v) => (v === "" ? undefined : v), z.coerce.number({ error: "Must be a valid number" }).min(0, "Cannot be negative").optional()),
});

export const updateItemSchema = createItemSchema.partial().extend({
  itemCode: z.string().trim().toUpperCase().optional(),
});

export type CreateItemFormValues = z.infer<typeof createItemSchema>;
export type UpdateItemFormValues = z.infer<typeof updateItemSchema>;

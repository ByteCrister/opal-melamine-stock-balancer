import { z } from "zod";

export const createItemSchema = z.object({
  itemCode: z.string().min(1, "Item Code is required").trim().toUpperCase(),
  itemName: z.string().min(1, "Item Name is required").trim(),
  classCode: z.string().trim().optional(),
  className: z.string().trim().optional(),
  category: z.string().min(1, "Category is required").trim(),
  material: z.string().trim().optional(),
  shape: z.string().trim().optional(),
  size: z.string().trim().optional(),
  color: z.string().trim().optional(),
  design: z.string().trim().optional(),
  unit: z.string().min(1, "Unit is required").trim(),
  reorderLevel: z.coerce.number().min(0).default(0),
  dp: z.coerce.number().min(0).optional(),
  tp: z.coerce.number().min(0).optional(),
  mrp: z.coerce.number().min(0).optional(),
  doUnit: z.string().trim().optional(),
  doQty: z.coerce.number().min(0).optional(),
});

export const updateItemSchema = createItemSchema.partial().extend({
  itemCode: z.string().trim().toUpperCase().optional(),
});

export type CreateItemFormValues = z.infer<typeof createItemSchema>;
export type UpdateItemFormValues = z.infer<typeof updateItemSchema>;

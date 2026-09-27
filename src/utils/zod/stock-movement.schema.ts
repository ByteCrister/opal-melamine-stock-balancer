import { z } from "zod";
import { STOCK_MOVEMENT_TYPE } from "@/const/stock.const";

export const createStockMovementSchema = z.object({
  date: z.string().or(z.date()).transform((val) => new Date(val).toISOString()),
  itemId: z.string().min(1, "Item is required"),
  itemCode: z.string().min(1, "Item Code is required"),
  itemName: z.string().min(1, "Item Name is required"),
  quantity: z.coerce.number().min(0.001, "Quantity must be greater than 0"),
  unit: z.string().min(1, "Unit is required"),
  remarks: z.string().trim().optional(),
});

export const updateStockMovementSchema = createStockMovementSchema.partial();

export type CreateStockMovementFormInput = z.input<typeof createStockMovementSchema>;
export type CreateStockMovementFormValues = z.infer<typeof createStockMovementSchema>;
export type UpdateStockMovementFormValues = z.infer<typeof updateStockMovementSchema>;

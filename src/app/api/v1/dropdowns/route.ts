import { NextRequest } from "next/server";
import ConnectDB from "@/config/db";
import DropdownListModel, { IClassOption } from "@/models/dropdown-list.model";
import ItemModel from "@/models/items.model";
import { withErrorHandler } from "@/lib/helpers/withErrorHandler";
import { withTransaction } from "@/lib/helpers/withTransaction";
import { getUserId } from "@/lib/auth/getUserId";
import { Types, ClientSession } from "mongoose";
import { DropdownType } from "@/types/dropdown.types";

// Helper to get or create the singleton DropdownList document
async function getSingleton(userId: Types.ObjectId | string, session?: ClientSession) {
  let doc = await DropdownListModel.findOne().session(session || null);
  if (!doc) {
    const newDoc = new DropdownListModel({
      classes: [],
      units: [],
      categories: [],
      materials: [],
      shapes: [],
      stockUnits: [],
      createdBy: userId,
    });
    doc = await newDoc.save({ session });
  }
  return doc;
}

export const GET = withErrorHandler(async () => {
  const userId = await getUserId();
  await ConnectDB();
  const doc = await getSingleton(userId);
  
  // Return active items only
  const data = doc.toObject();
  const filterActive = <T extends { deletedAt?: Date | string | null }>(arr: T[]) => 
    arr.filter((i) => !i.deletedAt);

  return {
    data: {
      _id: data._id,
      classes: filterActive(data.classes),
      units: filterActive(data.units),
      categories: filterActive(data.categories),
      materials: filterActive(data.materials),
      shapes: filterActive(data.shapes),
      stockUnits: filterActive(data.stockUnits),
    }
  };
});

export const POST = withErrorHandler(async (request: NextRequest) => {
  const userId = await getUserId();
  await ConnectDB();
  const payload = await request.json();
  const { type, value, code, className } = payload as { 
    type: DropdownType; 
    value?: string; 
    code?: string; 
    className?: string; 
  };

  if (!type) throw new Error("Type is required");

  return withTransaction(async (session) => {
    const doc = await getSingleton(userId, session);
    
    if (type === "classes") {
      if (!code || !className) throw new Error("Class code and name are required");
      const isDuplicate = doc.classes.some(
        (c: Types.Subdocument & IClassOption) => c.code.toLowerCase() === code.toLowerCase() && c.deletedAt === null
      );
      if (isDuplicate) throw new Error(`Class code "${code}" already exists.`);
      doc.classes.push({ code, className, deletedAt: null }); 
    } else {
      if (!value) throw new Error("Value is required");
      const list = doc[type] as Types.DocumentArray<{ value: string; deletedAt: Date | null }>;
      const isDuplicate = list.some(
        (item) => item.value.toLowerCase() === value.toLowerCase() && item.deletedAt === null
      );
      if (isDuplicate) throw new Error(`Value "${value}" already exists in ${type}.`);
      list.push({ value, deletedAt: null });
    }
    
    await doc.save({ session });
    return { data: { success: true, message: "Added successfully" } };
  });
});

export const PUT = withErrorHandler(async (request: NextRequest) => {
  const userId = await getUserId();
  await ConnectDB();
  const payload = await request.json();
  const { type, itemId, value, code, className } = payload as { 
    type: DropdownType; 
    itemId: string; 
    value?: string; 
    code?: string; 
    className?: string; 
  };

  if (!type || !itemId) throw new Error("Type and ItemId are required");

  return withTransaction(async (session) => {
    const doc = await getSingleton(userId, session);
    
    const arr = doc[type] as Types.DocumentArray<
      Types.Subdocument & { value?: string; code?: string; className?: string; deletedAt?: Date | null }
    >;
    const target = arr.id(itemId);
    
    if (!target) throw new Error("Item not found");
    
    if (type === "classes") {
      if (!code || !className) throw new Error("Class code and name are required");
      
      const isDuplicate = doc.classes.some(
        (c: Types.Subdocument & IClassOption) => 
          c._id?.toString() !== itemId && 
          c.code.toLowerCase() === code.toLowerCase() && 
          c.deletedAt === null
      );
      if (isDuplicate) throw new Error(`Class code "${code}" already exists.`);
      
      const oldCode = target.code;
      target.code = code;
      target.className = className;
      
      // Cascade update
      if (oldCode !== code) {
        await ItemModel.updateMany(
          { classCode: oldCode },
          { classCode: code, className: className },
          { session }
        );
      } else {
        await ItemModel.updateMany(
          { classCode: oldCode },
          { className: className },
          { session }
        );
      }
    } else {
      if (!value) throw new Error("Value is required");
      
      const list = doc[type] as Types.DocumentArray<{ _id?: Types.ObjectId; value: string; deletedAt: Date | null }>;
      const isDuplicate = list.some(
        (item) => 
          item._id?.toString() !== itemId && 
          item.value.toLowerCase() === value.toLowerCase() && 
          item.deletedAt === null
      );
      if (isDuplicate) throw new Error(`Value "${value}" already exists in ${type}.`);
      
      const oldValue = target.value;
      target.value = value;
      
      // Cascade update
      const fieldMap: Record<DropdownType, string | null> = {
        classes: null,
        units: "unit",
        categories: "category",
        materials: "material",
        shapes: "shape",
        stockUnits: "doUnit",
      };
      const itemField = fieldMap[type];
      
      if (oldValue !== value && itemField) {
        await ItemModel.updateMany(
          { [itemField]: oldValue },
          { [itemField]: value },
          { session }
        );
      }
    }
    
    await doc.save({ session });
    return { data: { success: true, message: "Updated successfully" } };
  });
});

export const DELETE = withErrorHandler(async (request: NextRequest) => {
  const userId = await getUserId();
  await ConnectDB();
  
  // NextRequest body reading might fail if empty, let's use searchParams if preferred,
  // but since we specified request.json(), we should try to read it safely.
  const payload = await request.json().catch(() => ({}));
  let { type, itemId } = payload as { type?: DropdownType; itemId?: string };
  
  // Fallback to URL parameters if body is missing
  if (!type || !itemId) {
    const { searchParams } = new URL(request.url);
    type = searchParams.get("type") as DropdownType;
    itemId = searchParams.get("itemId") as string;
  }

  if (!type || !itemId) throw new Error("Type and ItemId are required");

  return withTransaction(async (session) => {
    const doc = await getSingleton(userId, session);
    
    const arr = doc[type] as Types.DocumentArray<
      Types.Subdocument & { value?: string; code?: string; className?: string; deletedAt?: Date | null }
    >;
    const target = arr.id(itemId);
    if (!target) throw new Error("Item not found");
    
    // Check if in use
    let isUsed = false;
    if (type === "classes") {
      const exists = await ItemModel.exists({ classCode: target.code, deletedAt: null }).session(session);
      isUsed = !!exists;
    } else {
      const fieldMap: Record<DropdownType, string | null> = {
        classes: null,
        units: "unit",
        categories: "category",
        materials: "material",
        shapes: "shape",
        stockUnits: "doUnit",
      };
      const itemField = fieldMap[type];
      if (itemField) {
        const exists = await ItemModel.exists({ [itemField]: target.value, deletedAt: null }).session(session);
        isUsed = !!exists;
      }
    }
    
    if (isUsed) {
      throw new Error(`Cannot delete this ${type.slice(0, -1)} because it is currently used by active items.`);
    }
    
    target.deletedAt = new Date();
    await doc.save({ session });
    
    return { data: { success: true, message: "Deleted successfully" } };
  });
});

export const PATCH = withErrorHandler(async (request: NextRequest) => {
  const userId = await getUserId();
  await ConnectDB();
  const payload = await request.json();
  const { type, orderedIds } = payload as { type: DropdownType; orderedIds: string[] };

  if (!type || !orderedIds || !Array.isArray(orderedIds)) {
    throw new Error("Type and orderedIds array are required");
  }

  return withTransaction(async (session) => {
    const doc = await getSingleton(userId, session);
    const arr = doc[type] as Types.DocumentArray<
      Types.Subdocument & { value?: string; code?: string; className?: string; deletedAt?: Date | null }
    >;

    // Create a map for quick index lookup
    const orderMap = new Map(orderedIds.map((id, index) => [id, index]));
    
    arr.sort((a, b) => {
      const idA = (a._id as Types.ObjectId).toString();
      const idB = (b._id as Types.ObjectId).toString();
      const indexA = orderMap.has(idA) ? orderMap.get(idA)! : Infinity;
      const indexB = orderMap.has(idB) ? orderMap.get(idB)! : Infinity;
      
      if (indexA === Infinity && indexB === Infinity) return 0;
      return indexA - indexB;
    });

    await doc.save({ session });
    return { data: { success: true, message: "Reordered successfully" } };
  });
});

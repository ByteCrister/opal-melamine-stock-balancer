export type DropdownType = "classes" | "units" | "categories" | "materials" | "shapes" | "stockUnits";

export interface ClassOption {
  _id: string;
  code: string;
  className: string;
  deletedAt: string | null;
}

export interface DropdownItem {
  _id: string;
  value: string;
  deletedAt: string | null;
}

export interface DropdownList {
  _id: string;
  classes: ClassOption[];
  units: DropdownItem[];
  categories: DropdownItem[];
  materials: DropdownItem[];
  shapes: DropdownItem[];
  stockUnits: DropdownItem[];
}

export interface AddDropdownPayload {
  type: DropdownType;
  value?: string;
  code?: string;
  className?: string;
}

export interface UpdateDropdownPayload {
  type: DropdownType;
  itemId: string;
  value?: string;
  code?: string;
  className?: string;
}

export interface DeleteDropdownPayload {
  type: DropdownType;
  itemId: string;
}

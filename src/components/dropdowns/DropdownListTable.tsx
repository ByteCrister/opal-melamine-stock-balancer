"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { DropdownList, ClassOption, DropdownItem, DropdownType } from "@/types/dropdown.types";
import { useDropdownStore } from "@/store/useDropdownStore";
import { Pencil, Trash2, Search, GripVertical, LayoutList } from "lucide-react";
import { EditDropdownDialog } from "./EditDropdownDialog";
import { DeleteDropdownDialog } from "./DeleteDropdownDialog";
import { useDebounce } from "@/hooks/useDebounce";
import { useReorderDropdowns } from "@/hooks/mutations/useDropdownMutations";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/* ── Shared input style ─────────────────────────────────────── */
const inputStyle: React.CSSProperties = {
  background:   "var(--input-bg)",
  border:       "1px solid var(--input-border)",
  color:        "var(--input-text)",
  borderRadius: "var(--input-radius)",
};

/* ── Sortable row ───────────────────────────────────────────── */
interface SortableTableRowProps {
  item: ClassOption | DropdownItem;
  isClasses: boolean;
  onEdit: () => void;
  onDelete: () => void;
  isDragDisabled: boolean;
}

function SortableTableRow({ item, isClasses, onEdit, onDelete, isDragDisabled }: SortableTableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item._id, disabled: isDragDisabled });

  const style = {
    transform:  CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={{
        ...style,
        borderBottom: "1px solid var(--table-row-border)",
        ...(isDragging
          ? {
              background: "var(--surface-overlay)",
              boxShadow:  "var(--elevation-3)",
              opacity:    0.95,
              zIndex:     50,
              position:   "relative",
            }
          : {}),
      }}
      className="group transition-colors duration-100"
      onMouseEnter={(e) => { if (!isDragging) e.currentTarget.style.background = "var(--table-row-hover)"; }}
      onMouseLeave={(e) => { if (!isDragging) e.currentTarget.style.background = ""; }}
    >
      {/* Drag handle */}
      {!isDragDisabled && (
        <TableCell className="w-[36px] px-2 text-center">
          <button
            className="h-7 w-7 rounded-[6px] flex items-center justify-center cursor-grab active:cursor-grabbing transition-colors duration-100"
            style={{ color: "var(--text-muted)", background: "transparent" }}
            {...attributes}
            {...listeners}
            title="Drag to reorder"
          >
            <GripVertical className="h-3.5 w-3.5" />
          </button>
        </TableCell>
      )}

      {/* Data cells */}
      {isClasses ? (
        <>
          <TableCell className={cn("py-3", isDragDisabled && "pl-4")}>
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider"
              style={{
                background: "var(--badge-neutral-bg)",
                color:      "var(--badge-neutral-text)",
                border:     "1px solid var(--badge-neutral-border)",
              }}
            >
              {(item as ClassOption).code}
            </span>
          </TableCell>
          <TableCell className="py-3 text-[13.5px] font-medium" style={{ color: "var(--text-primary)" }}>
            {(item as ClassOption).className}
          </TableCell>
        </>
      ) : (
        <TableCell className={cn("py-3 text-[13.5px] font-medium", isDragDisabled && "pl-4")} style={{ color: "var(--text-primary)" }}>
          {(item as DropdownItem).value}
        </TableCell>
      )}

      {/* Actions */}
      <TableCell className="py-3 text-right">
        <div className="flex items-center justify-end gap-1.5 opacity-100 md:opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150">
          <button
            onClick={onEdit}
            className="h-8 w-8 rounded-[7px] flex items-center justify-center transition-colors duration-100"
            style={{ background: "var(--btn-ghost-hover-bg)", color: "var(--text-muted)" }}
            title="Edit"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="h-8 w-8 rounded-[7px] flex items-center justify-center transition-colors duration-100"
            style={{ background: "var(--badge-danger-bg)", color: "var(--badge-danger-text)" }}
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
}

/* ── Filter helper ──────────────────────────────────────────── */
function getFilteredItems(
  data: DropdownList | undefined,
  activeTab: DropdownType,
  searchQuery: string
): (ClassOption | DropdownItem)[] {
  if (!data) return [];
  const items = (data[activeTab] as (ClassOption | DropdownItem)[]) || [];
  return items.filter((item) => {
    if (item.deletedAt) return false;
    if (!searchQuery)   return true;
    const q = searchQuery.toLowerCase();
    if (activeTab === "classes" && "code" in item) {
      return item.code.toLowerCase().includes(q) || item.className.toLowerCase().includes(q);
    }
    if ("value" in item) return item.value.toLowerCase().includes(q);
    return false;
  });
}

/* ── Main component ─────────────────────────────────────────── */
interface DropdownListTableProps {
  data?: DropdownList;
}

export function DropdownListTable({ data }: DropdownListTableProps) {
  const { activeTab } = useDropdownStore();
  const [editItem,   setEditItem]   = useState<ClassOption | DropdownItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<ClassOption | DropdownItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);

  const { mutate: reorderDropdowns, isPending: isReordering } = useReorderDropdowns();

  const [prevDeps, setPrevDeps] = useState({ data, activeTab, searchQuery: debouncedSearch });
  const [itemsList, setItemsList] = useState<(ClassOption | DropdownItem)[]>(
    () => getFilteredItems(data, activeTab, debouncedSearch)
  );

  if (
    data       !== prevDeps.data       ||
    activeTab  !== prevDeps.activeTab  ||
    debouncedSearch !== prevDeps.searchQuery
  ) {
    setPrevDeps({ data, activeTab, searchQuery: debouncedSearch });
    setItemsList(getFilteredItems(data, activeTab, debouncedSearch));
    setHasPendingChanges(false);
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItemsList((items) => {
        const oldIdx = items.findIndex((i) => i._id === active.id);
        const newIdx = items.findIndex((i) => i._id === over.id);
        const next   = arrayMove(items, oldIdx, newIdx);
        setHasPendingChanges(true);
        return next;
      });
    }
  }

  if (!data) return null;

  const isClasses     = activeTab === "classes";
  const isDragDisabled = !!debouncedSearch;

  return (
    <div className="flex flex-col gap-4">

      {/* Search bar & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full md:max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none"
            style={{ color: "var(--text-muted)" }}
          />
          <Input
            type="search"
            placeholder="Search items…"
            className="pl-9 h-9 text-[13px]"
            style={inputStyle}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {hasPendingChanges && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setItemsList(getFilteredItems(data, activeTab, debouncedSearch));
                setHasPendingChanges(false);
              }}
              className="px-4 py-1.5 rounded-[var(--radius-md)] text-[13px] font-medium transition-colors"
              style={{ background: "var(--surface-sunken)", color: "var(--text-secondary)", border: "1px solid var(--border-subtle)" }}
              disabled={isReordering}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                reorderDropdowns(
                  { type: activeTab, orderedIds: itemsList.map((i) => i._id) },
                  {
                    onSuccess: () => {
                      setHasPendingChanges(false);
                      toast.success("Order saved successfully");
                    }
                  }
                );
              }}
              className="btn-primary px-4 py-1.5 text-[13px]"
              disabled={isReordering}
            >
              {isReordering ? "Saving..." : "Save Order"}
            </button>
          </div>
        )}
      </div>

      {/* Drag hint */}
      {!isDragDisabled && itemsList.length > 1 && (
        <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
          Drag rows to reorder. Reorder is disabled while searching.
        </p>
      )}

      {/* Table */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div
          className="rounded-[var(--radius-lg)] overflow-hidden"
          style={{
            background:      "var(--surface-sunken)",
            border:          "1px solid var(--card-border)",
          }}
        >
          <Table>
          <TableHeader>
            <TableRow style={{ background: "var(--table-header-bg)", borderBottom: "1px solid var(--table-header-border)" }}>
              {!isDragDisabled && <TableHead className="w-[36px] px-2" />}
              {isClasses ? (
                <>
                  <TableHead
                    className={cn("text-[11px] font-semibold uppercase tracking-widest py-3 w-[140px]", isDragDisabled && "pl-4")}
                    style={{ color: "var(--text-muted)" }}
                  >
                    Code
                  </TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-widest py-3" style={{ color: "var(--text-muted)" }}>
                    Class Name
                  </TableHead>
                </>
              ) : (
                <TableHead
                  className={cn("text-[11px] font-semibold uppercase tracking-widest py-3", isDragDisabled && "pl-4")}
                  style={{ color: "var(--text-muted)" }}
                >
                  Value
                </TableHead>
              )}
              <TableHead className="text-right text-[11px] font-semibold uppercase tracking-widest py-3 w-[120px]" style={{ color: "var(--text-muted)" }}>
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {itemsList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isClasses ? (isDragDisabled ? 3 : 4) : (isDragDisabled ? 2 : 3)}>
                  <div className="flex flex-col items-center gap-3 py-12" style={{ color: "var(--text-muted)" }}>
                    <LayoutList className="h-9 w-9 opacity-25" />
                    <p className="text-[13px]">No items found. Try adjusting your search.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <SortableContext
                items={itemsList.map((i) => i._id)}
                strategy={verticalListSortingStrategy}
              >
                {itemsList.map((item) => (
                  <SortableTableRow
                    key={item._id}
                    item={item}
                    isClasses={isClasses}
                    onEdit={()   => setEditItem(item)}
                    onDelete={() => setDeleteItem(item)}
                    isDragDisabled={isDragDisabled}
                  />
                ))}
              </SortableContext>
            )}
          </TableBody>
        </Table>
      </div>
    </DndContext>

      {/* Dialogs */}
      <EditDropdownDialog
        item={editItem}
        open={!!editItem}
        onOpenChange={(open) => !open && setEditItem(null)}
      />
      <DeleteDropdownDialog
        item={deleteItem}
        open={!!deleteItem}
        onOpenChange={(open) => !open && setDeleteItem(null)}
      />
    </div>
  );
}

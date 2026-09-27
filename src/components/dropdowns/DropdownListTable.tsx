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
import { DropdownList, ClassOption, DropdownItem, DropdownType } from "@/types/dropdown.types";
import { useDropdownStore } from "@/store/useDropdownStore";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Search, GripVertical } from "lucide-react";
import { EditDropdownDialog } from "./EditDropdownDialog";
import { DeleteDropdownDialog } from "./DeleteDropdownDialog";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useReorderDropdowns } from "@/hooks/mutations/useDropdownMutations";
import { cn } from "@/lib/utils";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow 
      ref={setNodeRef} 
      style={style} 
      className={cn(
        "hover:bg-muted/30 transition-colors group", 
        isDragging && "opacity-90 relative z-50 bg-background shadow-md border"
      )}
    >
      {!isDragDisabled && (
        <TableCell className="w-[40px] px-2 text-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground/50 hover:text-foreground cursor-grab active:cursor-grabbing" 
            {...attributes} 
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </Button>
        </TableCell>
      )}
      {isClasses ? (
        <>
          <TableCell className={cn("font-medium text-foreground", isDragDisabled && "pl-4")}>{(item as ClassOption).code}</TableCell>
          <TableCell className="text-muted-foreground">{(item as ClassOption).className}</TableCell>
        </>
      ) : (
        <TableCell className={cn("font-medium text-foreground", isDragDisabled && "pl-4")}>{(item as DropdownItem).value}</TableCell>
      )}
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
            onClick={onEdit}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

interface DropdownListTableProps {
  data?: DropdownList;
}

function getFilteredItems(
  data: DropdownList | undefined,
  activeTab: DropdownType,
  searchQuery: string
) {
  if (!data) return [];
  const items = data[activeTab] || [];
  
  return items.filter((item: ClassOption | DropdownItem) => {
    if (item.deletedAt) return false;
    
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    if (activeTab === "classes" && "code" in item) {
      return (
        item.code.toLowerCase().includes(query) ||
        item.className.toLowerCase().includes(query)
      );
    }
    if ("value" in item) {
      return item.value.toLowerCase().includes(query);
    }
    return false;
  });
}

export function DropdownListTable({ data }: DropdownListTableProps) {
  const { activeTab } = useDropdownStore();
  
  const [editItem, setEditItem] = useState<ClassOption | DropdownItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<ClassOption | DropdownItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { mutate: reorderDropdowns } = useReorderDropdowns();

  const [prevDeps, setPrevDeps] = useState({
    data,
    activeTab,
    searchQuery: debouncedSearchQuery,
  });

  const [itemsList, setItemsList] = useState<(ClassOption | DropdownItem)[]>(() => 
    getFilteredItems(data, activeTab, debouncedSearchQuery)
  );

  if (
    data !== prevDeps.data ||
    activeTab !== prevDeps.activeTab ||
    debouncedSearchQuery !== prevDeps.searchQuery
  ) {
    setPrevDeps({ data, activeTab, searchQuery: debouncedSearchQuery });
    setItemsList(getFilteredItems(data, activeTab, debouncedSearchQuery));
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setItemsList((items) => {
        const oldIndex = items.findIndex(item => item._id === active.id);
        const newIndex = items.findIndex(item => item._id === over.id);
        
        const newArray = arrayMove(items, oldIndex, newIndex);
        
        reorderDropdowns({
          type: activeTab,
          orderedIds: newArray.map(item => item._id)
        });

        return newArray;
      });
    }
  }

  if (!data) return null;

  const isClasses = activeTab === "classes";
  const isDragDisabled = !!debouncedSearchQuery; // Disable drag and drop when searching

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search items..."
            className="pl-8 bg-background border-border/60 focus-visible:ring-primary/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-xl border border-border/50 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="hover:bg-transparent">
              {!isDragDisabled && <TableHead className="w-[40px] px-2"></TableHead>}
              {isClasses ? (
                <>
                  <TableHead className={cn("w-[150px] font-semibold", isDragDisabled && "pl-4")}>Code</TableHead>
                  <TableHead className="font-semibold">Class Name</TableHead>
                </>
              ) : (
                <TableHead className={cn("font-semibold", isDragDisabled && "pl-4")}>Value</TableHead>
              )}
              <TableHead className="text-right w-[150px] font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {itemsList.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={isClasses ? (isDragDisabled ? 3 : 4) : (isDragDisabled ? 2 : 3)}
                  className="h-32 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-1">
                    <Search className="h-6 w-6 text-muted-foreground/50 mb-1" />
                    <p>No items found.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext 
                  items={itemsList.map(i => i._id)}
                  strategy={verticalListSortingStrategy}
                >
                  {itemsList.map((item) => (
                    <SortableTableRow 
                       key={item._id}
                       item={item}
                       isClasses={isClasses}
                       onEdit={() => setEditItem(item)}
                       onDelete={() => setDeleteItem(item)}
                       isDragDisabled={isDragDisabled}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </TableBody>
        </Table>
      </div>

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

"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDropdownStore } from "@/store/useDropdownStore";
import { useDeleteDropdownItem } from "@/hooks/mutations/useDropdownMutations";
import { ClassOption, DropdownItem } from "@/types/dropdown.types";

interface DeleteDropdownDialogProps {
  item: ClassOption | DropdownItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteDropdownDialog({ item, open, onOpenChange }: DeleteDropdownDialogProps) {
  const { activeTab } = useDropdownStore();
  const { mutateAsync: deleteItem, isPending } = useDeleteDropdownItem();
  
  const isClasses = activeTab === "classes";

  const handleDelete = async () => {
    if (!item) return;
    
    try {
      await deleteItem({
        type: activeTab,
        itemId: item._id,
      });
      onOpenChange(false);
    } catch (error) {
      // Error handled by mutation hook
    }
  };

  const typeName = activeTab.replace(/([A-Z])/g, ' $1').trim();
  const typeNameSingular = typeName.endsWith('s') ? typeName.slice(0, -1) : typeName;
  
  const itemName = item 
    ? isClasses 
      ? `${(item as ClassOption).code} - ${(item as ClassOption).className}`
      : (item as DropdownItem).value 
    : "";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the {typeNameSingular.toLowerCase()} <span className="font-semibold text-foreground">&quot;{itemName}&quot;</span>. 
            This action cannot be undone and may affect records using this value.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

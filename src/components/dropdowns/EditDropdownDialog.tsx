"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDropdownStore } from "@/store/useDropdownStore";
import { useUpdateDropdownItem } from "@/hooks/mutations/useDropdownMutations";
import { ClassOption, DropdownItem } from "@/types/dropdown.types";

interface EditDropdownDialogProps {
  item: ClassOption | DropdownItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface DropdownFormData {
  code?: string;
  className?: string;
  value?: string;
}

export function EditDropdownDialog({ item, open, onOpenChange }: EditDropdownDialogProps) {
  const { activeTab } = useDropdownStore();
  const { mutateAsync: updateItem, isPending } = useUpdateDropdownItem();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<DropdownFormData>();
  
  const isClasses = activeTab === "classes";

  useEffect(() => {
    if (item && open) {
      if (isClasses) {
        reset({
          code: (item as ClassOption).code,
          className: (item as ClassOption).className,
        });
      } else {
        reset({
          value: (item as DropdownItem).value,
        });
      }
    }
  }, [item, open, isClasses, reset]);

  const onSubmit = async (data: DropdownFormData) => {
    if (!item) return;
    
    try {
      if (isClasses) {
        await updateItem({
          type: activeTab,
          itemId: item._id,
          code: data.code,
          className: data.className,
        });
      } else {
        await updateItem({
          type: activeTab,
          itemId: item._id,
          value: data.value,
        });
      }
      onOpenChange(false);
    } catch (error) {
      // Error handled by mutation hook
    }
  };

  const typeName = activeTab.replace(/([A-Z])/g, ' $1').trim();
  const typeNameSingular = typeName.endsWith('s') ? typeName.slice(0, -1) : typeName;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit {typeNameSingular}</DialogTitle>
          <DialogDescription>
            Update the {typeNameSingular.toLowerCase()} details. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          {isClasses ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="edit-code">Class Code</Label>
                <Input 
                  id="edit-code" 
                  {...register("code", { required: "Code is required" })} 
                />
                {errors.code && <p className="text-xs text-destructive">{errors.code.message as string}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-className">Class Name</Label>
                <Input 
                  id="edit-className" 
                  {...register("className", { required: "Class name is required" })} 
                />
                {errors.className && <p className="text-xs text-destructive">{errors.className.message as string}</p>}
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="edit-value">Value</Label>
              <Input 
                id="edit-value" 
                {...register("value", { required: "Value is required" })} 
              />
              {errors.value && <p className="text-xs text-destructive">{errors.value.message as string}</p>}
            </div>
          )}
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

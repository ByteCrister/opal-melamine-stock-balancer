"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDropdownStore } from "@/store/useDropdownStore";
import { useAddDropdownItem } from "@/hooks/mutations/useDropdownMutations";

interface DropdownFormData {
  code?: string;
  className?: string;
  value?: string;
}

export function AddDropdownDialog() {
  const [open, setOpen] = useState(false);
  const { activeTab } = useDropdownStore();
  const { mutateAsync: addItem, isPending } = useAddDropdownItem();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<DropdownFormData>();
  
  const isClasses = activeTab === "classes";
  
  const onSubmit = async (data: DropdownFormData) => {
    try {
      if (isClasses) {
        await addItem({
          type: activeTab,
          code: data.code,
          className: data.className,
        });
      } else {
        await addItem({
          type: activeTab,
          value: data.value,
        });
      }
      setOpen(false);
      reset();
    } catch (error) {
      // Error handled by mutation hook
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) reset();
  };
  
  const typeName = activeTab.replace(/([A-Z])/g, ' $1').trim();
  const typeNameSingular = typeName.endsWith('s') ? typeName.slice(0, -1) : typeName;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button className="w-full md:w-auto shadow-sm gap-2" />}>
        <Plus className="h-4 w-4" />
        Add {typeNameSingular}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New {typeNameSingular}</DialogTitle>
          <DialogDescription>
            Add a new item to the {typeName.toLowerCase()} list. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          {isClasses ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="code">Class Code</Label>
                <Input 
                  id="code" 
                  placeholder="e.g. A" 
                  {...register("code", { required: "Code is required" })} 
                />
                {errors.code && <p className="text-xs text-destructive">{errors.code.message as string}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="className">Class Name</Label>
                <Input 
                  id="className" 
                  placeholder="e.g. Premium" 
                  {...register("className", { required: "Class name is required" })} 
                />
                {errors.className && <p className="text-xs text-destructive">{errors.className.message as string}</p>}
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="value">Value</Label>
              <Input 
                id="value" 
                placeholder={`Enter ${typeNameSingular.toLowerCase()} name...`} 
                {...register("value", { required: "Value is required" })} 
              />
              {errors.value && <p className="text-xs text-destructive">{errors.value.message as string}</p>}
            </div>
          )}
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

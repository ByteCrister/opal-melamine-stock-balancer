"use client";

import * as React from "react";
import { Check, ChevronsUpDown, LayoutList } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDropdownStore } from "@/store/useDropdownStore";
import { DropdownType } from "@/types/dropdown.types";

const dropdownTypes: { value: DropdownType; label: string }[] = [
  { value: "classes", label: "Classes" },
  { value: "units", label: "Units" },
  { value: "categories", label: "Categories" },
  { value: "materials", label: "Materials" },
  { value: "shapes", label: "Shapes" },
  { value: "stockUnits", label: "Stock Units" },
];

export function DropdownTypeSelector() {
  const [open, setOpen] = React.useState(false);
  const { activeTab, setActiveTab } = useDropdownStore();

  const selectedType = dropdownTypes.find((type) => type.value === activeTab);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger 
        render={
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between border-border/60 hover:bg-muted/50"
          />
        }
      >
        <div className="flex items-center gap-2">
          <LayoutList className="h-4 w-4 text-primary" />
          <span className="font-medium text-foreground">
            {selectedType ? selectedType.label : "Select category..."}
          </span>
        </div>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search category..." className="h-9" />
          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {dropdownTypes.map((type) => (
                <CommandItem
                  key={type.value}
                  value={type.label}
                  onSelect={() => {
                    setActiveTab(type.value);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 text-primary",
                      activeTab === type.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {type.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

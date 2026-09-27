"use client";

import * as React from "react";
import { Check, ChevronsUpDown, LayoutList, Search } from "lucide-react";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
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
  { value: "classes",    label: "Classes"    },
  { value: "units",      label: "Units"      },
  { value: "categories", label: "Categories" },
  { value: "materials",  label: "Materials"  },
  { value: "shapes",     label: "Shapes"     },
  { value: "stockUnits", label: "Stock Units"},
];

export function DropdownTypeSelector() {
  const [open, setOpen] = React.useState(false);
  const { activeTab, setActiveTab } = useDropdownStore();

  const selectedType = dropdownTypes.find((t) => t.value === activeTab);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          buttonVariants({ variant: "outline" }),
          "w-full justify-between font-normal h-9 text-[13px]"
        )}
        style={{
          background:   "var(--input-bg)",
          border:       "1px solid var(--input-border)",
          color:        "var(--input-text)",
          borderRadius: "var(--input-radius)",
        }}
      >
        <span className="flex items-center gap-2">
          <LayoutList className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--color-crimson-400)" }} />
          <span>{selectedType ? selectedType.label : "Select type…"}</span>
        </span>
        <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
      </PopoverTrigger>

      <PopoverContent
        className="w-56 p-0"
        align="start"
        style={{
          background:   "var(--dialog-bg)",
          backgroundImage: "var(--dialog-bg-overlay)",
          border:       "1px solid var(--card-border)",
          boxShadow:    "var(--elevation-3)",
          borderRadius: "var(--radius-md)",
        }}
      >
        <Command className="bg-transparent p-0">
          <div
            className="flex items-center gap-2 px-3 h-10 border-b"
            style={{ borderBottomColor: "var(--border-subtle)" }}
          >
            <Search className="h-4 w-4 shrink-0 opacity-50" style={{ color: "var(--text-muted)" }} />
            <CommandPrimitive.Input
              placeholder="Search type…"
              className="flex h-10 w-full bg-transparent text-[13px] outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              style={{ color: "var(--text-primary)" }}
            />
          </div>
          <CommandList>
            <CommandEmpty className="text-[12px] py-4 text-center text-muted-foreground">
              No type found.
            </CommandEmpty>
            <CommandGroup className="p-1">
              {dropdownTypes.map((type) => (
                <CommandItem
                  key={type.value}
                  value={type.label}
                  className="cursor-pointer transition-colors duration-100 data-[selected=true]:bg-[var(--surface-sunken)] data-[selected=true]:text-[var(--text-primary)]"
                  style={{ color: "var(--text-secondary)" }}
                  onSelect={() => {
                    setActiveTab(type.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "h-3.5 w-3.5 shrink-0 transition-opacity",
                      activeTab === type.value ? "opacity-100" : "opacity-0"
                    )}
                    style={{ color: "var(--color-crimson-400)" }}
                  />
                  <span className={activeTab === type.value ? "font-medium" : ""}>{type.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
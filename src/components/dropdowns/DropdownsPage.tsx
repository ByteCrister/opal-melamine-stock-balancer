"use client";

import { useDropdownStore } from "@/store/useDropdownStore";
import { DropdownTypeSelector } from "./DropdownTypeSelector";
import { DropdownListTable } from "./DropdownListTable";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useDropdowns } from "@/hooks/queries/useDropdowns";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { AddDropdownDialog } from "./AddDropdownDialog";

export function DropdownsPage() {
  const { activeTab } = useDropdownStore();
  const { data, isLoading, isError, error } = useDropdowns();

  return (
    <div className="flex flex-col gap-6 md:px-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dropdowns</h1>
          <p className="text-muted-foreground mt-1">
            Manage system categories, units, classes and more.
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-full md:w-64">
            <DropdownTypeSelector />
          </div>
          <AddDropdownDialog />
        </div>
      </div>

      <Card className="shadow-sm border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="capitalize text-xl">
            {activeTab.replace(/([A-Z])/g, ' $1').trim()}
          </CardTitle>
          <CardDescription>
            Manage your {activeTab.replace(/([A-Z])/g, ' $1').trim().toLowerCase()} records.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full rounded-md" />
              <Skeleton className="h-16 w-full rounded-md" />
              <Skeleton className="h-16 w-full rounded-md" />
              <Skeleton className="h-16 w-full rounded-md" />
            </div>
          ) : isError ? (
            <div className="flex items-center gap-3 text-destructive p-4 bg-destructive/10 rounded-md">
              <AlertCircle className="h-5 w-5" />
              <p className="font-medium text-sm">Failed to load dropdowns: {error?.message}</p>
            </div>
          ) : (
            <DropdownListTable data={data} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

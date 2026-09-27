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
import { Button } from "@/components/ui/button";
import { useStockBalancer } from "@/hooks/queries/useStockBalancer";
import { useDebounce } from "@/hooks/useDebounce";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function StockBalancerList() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);

  const { data, isLoading, error } = useStockBalancer({
    page,
    limit,
    search: debouncedSearch,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (error) {
    return <div className="p-8 text-destructive">Failed to load stock balancer records.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search code or name..."
            className="pl-8"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <div className="rounded-md border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item Code</TableHead>
              <TableHead>Item Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Class</TableHead>
              <TableHead className="text-right">Total In</TableHead>
              <TableHead className="text-right">Total Out</TableHead>
              <TableHead className="text-right">Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i} className="hover:bg-transparent">
                  <TableCell><Skeleton className="h-5 w-[80%] rounded-md" style={{ opacity: 1 - i * 0.05 }} /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[65%] rounded-md" style={{ opacity: 1 - i * 0.05 }} /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[75%] rounded-md" style={{ opacity: 1 - i * 0.05 }} /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[50%] rounded-md" style={{ opacity: 1 - i * 0.05 }} /></TableCell>
                  <TableCell><Skeleton className="h-5 w-14 ml-auto rounded-md" style={{ opacity: 1 - i * 0.05 }} /></TableCell>
                  <TableCell><Skeleton className="h-5 w-14 ml-auto rounded-md" style={{ opacity: 1 - i * 0.05 }} /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20 ml-auto rounded-md" style={{ opacity: 1 - i * 0.05 }} /></TableCell>
                </TableRow>
              ))
            ) : data?.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No stock balance records found.
                </TableCell>
              </TableRow>
            ) : (
              data?.items.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="font-medium">{item.itemCode}</TableCell>
                  <TableCell>{item.itemName}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.className}</TableCell>
                  <TableCell className="text-right text-green-600">{item.totalIn}</TableCell>
                  <TableCell className="text-right text-red-600">{item.totalOut}</TableCell>
                  <TableCell className={cn("text-right font-bold", item.balance < 0 ? "text-red-600" : (item.balance < (item.reorderLevel || 0) ? "text-orange-500" : "text-primary"))}>
                    {item.balance}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {data && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1 || isLoading}
          >
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {page} of {data.meta.totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === data.meta.totalPages || isLoading}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

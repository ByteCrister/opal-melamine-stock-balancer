import { SharedBreadcrumb } from "@/components/shared/SharedBreadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Loading() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <SharedBreadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Stock Balancer" },
        ]}
      />
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Stock Balancer</h2>
      </div>

      <div className="space-y-4 animate-in fade-in-50 duration-500">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Skeleton className="h-10 w-full max-w-sm rounded-md" />
        </div>

        <div className="rounded-md border bg-card/50 overflow-hidden backdrop-blur-sm shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
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
              {Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i} className="hover:bg-transparent">
                  <TableCell><Skeleton className="h-5 w-[80%] rounded-md" style={{ opacity: 1 - i * 0.05 }} /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[65%] rounded-md" style={{ opacity: 1 - i * 0.05 }} /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[75%] rounded-md" style={{ opacity: 1 - i * 0.05 }} /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[50%] rounded-md" style={{ opacity: 1 - i * 0.05 }} /></TableCell>
                  <TableCell><Skeleton className="h-5 w-14 ml-auto rounded-md" style={{ opacity: 1 - i * 0.05 }} /></TableCell>
                  <TableCell><Skeleton className="h-5 w-14 ml-auto rounded-md" style={{ opacity: 1 - i * 0.05 }} /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20 ml-auto rounded-md" style={{ opacity: 1 - i * 0.05 }} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end space-x-2 py-4">
          <Skeleton className="h-9 w-[80px] rounded-md" />
          <Skeleton className="h-5 w-[100px] rounded-md" />
          <Skeleton className="h-9 w-[80px] rounded-md" />
        </div>
      </div>
    </div>
  );
}

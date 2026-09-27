"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

export function AuditLogsSection() {
  const { audits, auditMeta, isLoadingAudits, fetchAudits } = useUserStore();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<"asc" | "desc">("desc");

  // Fetch audits when dependencies change
  useEffect(() => {
    fetchAudits({ page, limit: 5, search: debouncedSearch, sort, sortBy: "createdAt" });
  }, [page, debouncedSearch, sort, fetchAudits]);

  // Handle page changes
  const handleNextPage = () => {
    if (auditMeta && page < auditMeta.totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const toggleSort = () => {
    setSort(sort === "desc" ? "asc" : "desc");
    setPage(1); // reset to page 1 on sort change
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // reset to page 1 on search change
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(dateString));
  };

  return (
    <div className="glass-panel p-6 sm:p-8 max-w-5xl relative overflow-hidden mt-8">
      {/* Decorative gradient glow */}
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 relative z-10 gap-4">
        <div>
          <h2 className="text-heading-md font-geist font-semibold text-primary">Activity Log</h2>
          <p className="text-muted text-body-sm mt-1">Track your recent actions and security events.</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <Input
              placeholder="Search actions..."
              value={search}
              onChange={handleSearchChange}
              className="pl-9 font-body bg-surface text-foreground border-border focus-visible:ring-primary shadow-sm w-full"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSort}
            className="shrink-0 bg-surface border-border hover:bg-surface-hover text-foreground"
            title={`Sort by Date ${sort === "asc" ? "Ascending" : "Descending"}`}
          >
            <ArrowUpDown className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="relative z-10 overflow-x-auto w-full rounded-md border border-border/50">
        {isLoadingAudits ? (
          <AuditLogsSkeleton />
        ) : audits.length === 0 ? (
          <div className="text-center py-12 px-4 bg-surface/20">
            <p className="text-muted text-body-md">No activity logs found.</p>
          </div>
        ) : (
          <div className="min-w-[700px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface/50 border-b border-border/50 text-label text-muted">
                  <th className="py-3 px-4 font-medium">Action</th>
                  <th className="py-3 px-4 font-medium">Entity</th>
                  <th className="py-3 px-4 font-medium">Date & Time</th>
                  <th className="py-3 px-4 font-medium text-right">IP Address</th>
                </tr>
              </thead>
              <tbody className="bg-surface/10 divide-y divide-border/50">
                {audits.map((log) => (
                  <tr
                    key={log._id}
                    className="hover:bg-surface/30 transition-colors group"
                  >
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground text-body-md capitalize">
                          {log.action.replace(/_/g, ' ')}
                        </span>
                        {log.details && Object.keys(log.details).length > 0 && (
                          <span className="text-xs text-muted truncate max-w-[200px]" title={JSON.stringify(log.details)}>
                            {JSON.stringify(log.details)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="text-body-sm text-foreground/90 capitalize">{log.entity}</span>
                        {log.entityId && (
                          <span className="text-xs text-muted font-mono truncate max-w-[150px]" title={log.entityId}>
                            ID: {log.entityId}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-body-sm text-muted whitespace-nowrap">
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-body-sm text-muted text-right font-mono text-xs">
                      {log.ipAddress || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isLoadingAudits && auditMeta && auditMeta.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 relative z-10 gap-4">
          <p className="text-body-sm text-muted text-center sm:text-left">
            Showing <span className="font-medium text-foreground">{(auditMeta.page - 1) * auditMeta.limit + 1}</span> to{" "}
            <span className="font-medium text-foreground">
              {Math.min(auditMeta.page * auditMeta.limit, auditMeta.total)}
            </span>{" "}
            of <span className="font-medium text-foreground">{auditMeta.total}</span> entries
          </p>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={page === 1}
              className="bg-surface border-border hover:bg-surface-hover text-foreground disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={page === auditMeta.totalPages}
              className="bg-surface border-border hover:bg-surface-hover text-foreground disabled:opacity-50"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function AuditLogsSkeleton() {
  return (
    <div className="w-full min-w-[700px] animate-pulse">
      <div className="flex bg-surface/50 border-b border-border/50 py-3 px-4">
        <div className="h-4 bg-surface-overlay rounded w-1/4"></div>
        <div className="h-4 bg-surface-overlay rounded w-1/4 ml-4"></div>
        <div className="h-4 bg-surface-overlay rounded w-1/4 ml-4"></div>
        <div className="h-4 bg-surface-overlay rounded w-1/4 ml-4"></div>
      </div>
      <div className="bg-surface/10 divide-y divide-border/50">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex py-4 px-4 items-center">
            <div className="flex flex-col w-1/4 gap-2 pr-4">
               <div className="h-4 bg-surface-overlay rounded w-3/4"></div>
               <div className="h-3 bg-surface-overlay rounded w-1/2"></div>
            </div>
            <div className="flex flex-col w-1/4 px-4 gap-2 border-l border-transparent">
               <div className="h-4 bg-surface-overlay rounded w-1/2"></div>
               <div className="h-3 bg-surface-overlay rounded w-1/3"></div>
            </div>
            <div className="flex items-center w-1/4 px-4 border-l border-transparent">
               <div className="h-4 bg-surface-overlay rounded w-2/3"></div>
            </div>
            <div className="flex justify-end w-1/4 pl-4 border-l border-transparent">
               <div className="h-4 bg-surface-overlay rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

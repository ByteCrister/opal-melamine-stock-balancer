"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowUpDown, ChevronLeft, ChevronRight, Activity, Clock } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

export function AuditLogsSection() {
  const { audits, auditMeta, isLoadingAudits, fetchAudits } = useUserStore();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetchAudits({ page, limit: 5, search: debouncedSearch, sort, sortBy: "createdAt" });
  }, [page, debouncedSearch, sort, fetchAudits]);

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
    setPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(dateString));
  };
  
  const getActionBadgeColor = (action: string) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes("delete") || actionLower.includes("remove")) {
      return { bg: "var(--badge-danger-bg)", text: "var(--badge-danger-text)", border: "var(--badge-danger-border)" };
    }
    if (actionLower.includes("create") || actionLower.includes("add")) {
      return { bg: "var(--badge-success-bg)", text: "var(--badge-success-text)", border: "var(--badge-success-border)" };
    }
    if (actionLower.includes("update") || actionLower.includes("edit")) {
      return { bg: "var(--badge-info-bg)", text: "var(--badge-info-text)", border: "var(--badge-info-border)" };
    }
    return { bg: "var(--badge-neutral-bg)", text: "var(--badge-neutral-text)", border: "var(--badge-neutral-border)" };
  };

  return (
    <div 
      className="w-full p-0 relative overflow-hidden transition-all duration-300"
      style={{
        backgroundColor: "var(--card-bg)",
        backgroundImage: "var(--card-bg-overlay)",
        border: "1px solid var(--card-border)",
        boxShadow: "var(--card-shadow)",
        borderRadius: "var(--card-radius)",
      }}
    >
      {/* Decorative gradient glow */}
      <div 
        aria-hidden 
        className="pointer-events-none absolute -bottom-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-30"
        style={{ background: "var(--gradient-hero-glow)" }}
      />

      <div className="px-6 sm:px-8 py-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center relative z-10 gap-5" style={{ borderColor: "var(--table-row-border)" }}>
        <div>
          <h2 className="text-[20px] font-semibold font-geist flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <Activity className="h-5 w-5" style={{ color: "var(--color-crimson-400)" }} />
            Activity Log
          </h2>
          <p className="text-[13px] mt-1" style={{ color: "var(--text-secondary)" }}>Track your recent actions and security events.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" style={{ color: "var(--text-primary)" }} />
            <Input
              placeholder="Search actions..."
              value={search}
              onChange={handleSearchChange}
              className="h-9 pl-9 text-[13px] font-medium transition-all duration-200 outline-none w-full"
              style={{
                backgroundColor: "var(--input-bg)",
                borderColor: "var(--input-border)",
                color: "var(--text-primary)",
                borderRadius: "var(--input-radius)",
              }}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSort}
            className="h-9 w-9 shrink-0 transition-colors"
            style={{
              backgroundColor: "var(--btn-secondary-bg)",
              borderColor: "var(--btn-secondary-border)",
              color: "var(--text-primary)",
            }}
            title={`Sort by Date ${sort === "asc" ? "Ascending" : "Descending"}`}
          >
            <ArrowUpDown className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="relative z-10 overflow-x-auto w-full">
        {isLoadingAudits ? (
          <AuditLogsSkeleton />
        ) : audits.length === 0 ? (
          <div className="text-center py-16 px-4" style={{ backgroundColor: "var(--surface-glass)" }}>
            <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: "var(--btn-secondary-bg)" }}>
              <Clock className="w-6 h-6 opacity-50" style={{ color: "var(--text-primary)" }} />
            </div>
            <p className="text-[14px] font-medium" style={{ color: "var(--text-primary)" }}>No activity logs found.</p>
            <p className="text-[13px] mt-1" style={{ color: "var(--text-secondary)" }}>Your recent actions will appear here.</p>
          </div>
        ) : (
          <div className="min-w-[700px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[12px] font-semibold uppercase tracking-wider border-b" style={{ backgroundColor: "var(--table-header-bg)", borderColor: "var(--table-header-border)", color: "var(--text-muted)" }}>
                  <th className="py-3 px-6 sm:px-8 font-semibold">Action</th>
                  <th className="py-3 px-6 font-semibold">Entity</th>
                  <th className="py-3 px-6 font-semibold">Date & Time</th>
                  <th className="py-3 px-6 sm:px-8 font-semibold text-right">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "var(--table-row-border)" }}>
                {audits.map((log) => {
                  const badgeColors = getActionBadgeColor(log.action);
                  return (
                    <tr
                      key={log._id}
                      className="transition-colors group hover:brightness-110"
                      style={{ backgroundColor: "transparent" }}
                    >
                      <td className="py-4 px-6 sm:px-8">
                        <div className="flex flex-col items-start gap-1.5">
                          <span 
                            className="text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-[6px] border"
                            style={{ 
                              backgroundColor: badgeColors.bg,
                              color: badgeColors.text,
                              borderColor: badgeColors.border,
                            }}
                          >
                            {log.action.replace(/_/g, ' ')}
                          </span>
                          {log.details && Object.keys(log.details).length > 0 && (
                            <span className="text-[12px] truncate max-w-[220px]" style={{ color: "var(--text-secondary)" }} title={JSON.stringify(log.details)}>
                              {JSON.stringify(log.details)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[13.5px] font-medium capitalize" style={{ color: "var(--text-primary)" }}>{log.entity}</span>
                          {log.entityId && (
                            <span className="text-[11px] font-mono truncate max-w-[150px]" style={{ color: "var(--text-muted)" }} title={log.entityId}>
                              {log.entityId}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-[13px] whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>
                        {formatDate(log.createdAt)}
                      </td>
                      <td className="py-4 px-6 sm:px-8 text-[12px] text-right font-mono" style={{ color: "var(--text-muted)" }}>
                        {log.ipAddress || "N/A"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isLoadingAudits && auditMeta && auditMeta.totalPages > 1 && (
        <div className="px-6 sm:px-8 py-4 border-t flex flex-col sm:flex-row items-center justify-between relative z-10 gap-4" style={{ borderColor: "var(--table-row-border)", backgroundColor: "var(--table-header-bg)" }}>
          <p className="text-[12.5px]" style={{ color: "var(--text-secondary)" }}>
            Showing <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{(auditMeta.page - 1) * auditMeta.limit + 1}</span> to{" "}
            <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
              {Math.min(auditMeta.page * auditMeta.limit, auditMeta.total)}
            </span>{" "}
            of <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{auditMeta.total}</span> entries
          </p>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={page === 1}
              className="h-8 px-3 text-[12px] font-medium transition-colors"
              style={{
                backgroundColor: "var(--btn-secondary-bg)",
                borderColor: "var(--btn-secondary-border)",
                color: "var(--text-primary)",
              }}
            >
              <ChevronLeft className="w-3.5 h-3.5 mr-1" />
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={page === auditMeta.totalPages}
              className="h-8 px-3 text-[12px] font-medium transition-colors"
              style={{
                backgroundColor: "var(--btn-secondary-bg)",
                borderColor: "var(--btn-secondary-border)",
                color: "var(--text-primary)",
              }}
            >
              Next
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
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
      <div className="flex py-3 px-6 sm:px-8 border-b" style={{ backgroundColor: "var(--table-header-bg)", borderColor: "var(--table-header-border)" }}>
        <div className="h-4 rounded w-1/4" style={{ backgroundColor: "var(--skeleton-base)" }} />
        <div className="h-4 rounded w-1/4 ml-4" style={{ backgroundColor: "var(--skeleton-base)" }} />
        <div className="h-4 rounded w-1/4 ml-4" style={{ backgroundColor: "var(--skeleton-base)" }} />
        <div className="h-4 rounded w-1/4 ml-4" style={{ backgroundColor: "var(--skeleton-base)" }} />
      </div>
      <div className="divide-y" style={{ borderColor: "var(--table-row-border)" }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex py-4 px-6 sm:px-8 items-center">
            <div className="flex flex-col w-1/4 gap-2 pr-4">
               <div className="h-5 rounded w-20" style={{ backgroundColor: "var(--skeleton-highlight)" }} />
               <div className="h-3 rounded w-32" style={{ backgroundColor: "var(--skeleton-base)" }} />
            </div>
            <div className="flex flex-col w-1/4 px-4 gap-2">
               <div className="h-4 rounded w-24" style={{ backgroundColor: "var(--skeleton-highlight)" }} />
               <div className="h-3 rounded w-16" style={{ backgroundColor: "var(--skeleton-base)" }} />
            </div>
            <div className="flex items-center w-1/4 px-4">
               <div className="h-4 rounded w-24" style={{ backgroundColor: "var(--skeleton-base)" }} />
            </div>
            <div className="flex justify-end w-1/4 pl-4">
               <div className="h-4 rounded w-20" style={{ backgroundColor: "var(--skeleton-base)" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

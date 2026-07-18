import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Pagination } from "./types";

export function ReviewPagination({ pagination, setPagination }: { pagination: Pagination; setPagination: React.Dispatch<React.SetStateAction<Pagination>> }) {
  if (pagination.pages <= 1) return null;
  return (
    <div className="mt-4 flex items-center justify-between">
      <div className="text-sm text-[#5A5E55]">Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}</div>
      <div className="flex items-center gap-2">
        <button onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))} disabled={pagination.page === 1} className="rounded-lg border border-[#d8a928]/30 p-2 hover:bg-[#fcf5e8] disabled:cursor-not-allowed disabled:opacity-50"><ChevronLeft className="h-4 w-4" /></button>
        <span className="px-2 text-sm text-[#0a0a0a]">Page {pagination.page} of {pagination.pages}</span>
        <button onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))} disabled={pagination.page === pagination.pages} className="rounded-lg border border-[#d8a928]/30 p-2 hover:bg-[#fcf5e8] disabled:cursor-not-allowed disabled:opacity-50"><ChevronRight className="h-4 w-4" /></button>
      </div>
    </div>
  );
}

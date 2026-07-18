import { Filter, Search } from "lucide-react";
import type { Pagination } from "./types";

export function ReviewFilters({
  searchQuery, setSearchQuery, statusFilter, setStatusFilter, setPagination, openModal,
}: {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  setPagination: React.Dispatch<React.SetStateAction<Pagination>>;
  openModal: () => void;
}) {
  return (
    <div className="mb-6 rounded-xl border border-[#d8a928]/20 bg-white p-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex w-full flex-1 flex-col gap-3 sm:w-auto sm:flex-row">
          <div className="relative min-w-[200px] flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5A5E55]" /><input type="text" placeholder="Search reviews..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-lg border border-[#d8a928]/30 py-2 pl-9 pr-3 text-sm focus:border-transparent focus:ring-2 focus:ring-[#d8a928]" /></div>
          <div className="flex items-center gap-2"><Filter className="h-4 w-4 text-[#5A5E55]" /><select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPagination((p) => ({ ...p, page: 1 })); }} className="rounded-lg border border-[#d8a928]/30 px-3 py-2 text-sm focus:ring-2 focus:ring-[#d8a928]"><option value="all">All Status</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option></select></div>
        </div>
        <button onClick={openModal} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#d8a928] px-4 py-2 text-sm font-medium text-white hover:bg-[#b8923f] sm:w-auto"><span>+</span> Add Manual Review</button>
      </div>
    </div>
  );
}

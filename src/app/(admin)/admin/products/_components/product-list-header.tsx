import Link from "next/link";
import { FiPlus, FiSearch } from "react-icons/fi";

export function ProductListHeader({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (value: string) => void;
}) {
  return (
    <>
      <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center md:mb-6">
        <h1 className="text-xl font-bold text-[#0a0a0a] md:text-2xl">Products</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-1.5 rounded-lg bg-[#d8a928] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#b8923f] sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
        >
          <FiPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Add Product</span>
          <span className="sm:hidden">Add</span>
        </Link>
      </div>

      <div className="relative mb-3 md:mb-4">
        <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 sm:h-5 sm:w-5" />
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 py-1.5 pl-9 pr-3 text-sm focus:border-transparent focus:ring-2 focus:ring-[#d8a928] sm:py-2 sm:pl-10 sm:pr-4"
        />
      </div>
    </>
  );
}

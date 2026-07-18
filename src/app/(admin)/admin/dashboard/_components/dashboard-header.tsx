import Link from "next/link";

export function DashboardHeader() {
  return (
    <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:mb-8 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-2xl font-bold text-[#0a0a0a] sm:text-3xl">Admin Dashboard</h1>
        <p className="mt-1 text-xs text-[#5A5E55] sm:mt-2 sm:text-sm">Welcome back! Here&apos;s what&apos;s happening with your store.</p>
      </div>
      <Link href="/admin/products/new" className="rounded-full bg-[#f6a45d] px-4 py-2 text-xs font-semibold text-[#fcf5e8] hover:bg-[#d8861f] sm:px-5 sm:py-3 sm:text-sm">Add Product</Link>
    </div>
  );
}

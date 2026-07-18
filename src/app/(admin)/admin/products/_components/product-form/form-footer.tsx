import Link from "next/link";
import { FaInfoCircle } from "react-icons/fa";

export function FormFooter({ mode, saving }: { mode: "create" | "edit"; saving: boolean }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#d8a928]/20 bg-white px-4 py-4 shadow-lg md:px-8 md:py-5">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f6a45d]/10">
            <FaInfoCircle className="h-5 w-5 text-[#f6a45d]" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#0a0a0a]">{mode === "create" ? "Create New Product" : "Update Product"}</p>
            <p className="text-xs text-[#5A5E55]">{mode === "create" ? "All required fields must be filled before saving" : "Your changes will be saved to the existing product"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-[#0a0a0a] transition-all hover:bg-gray-50">
            Cancel
          </Link>
          <button type="submit" disabled={saving} className="flex min-w-[140px] items-center justify-center gap-2 rounded-lg bg-[#f6a45d] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#d8861f] hover:shadow-lg disabled:opacity-50">
            {saving ? "Saving..." : "Save Product"}
          </button>
        </div>
      </div>
    </div>
  );
}

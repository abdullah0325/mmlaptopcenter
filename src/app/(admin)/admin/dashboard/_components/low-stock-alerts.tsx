import Link from "next/link";

export function LowStockAlerts({ products }: { products: Array<{ id: string; title: string; inventory: number }> }) {
  if (products.length === 0) return null;
  return (
    <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 sm:mt-6 sm:rounded-3xl sm:p-6">
      <h2 className="mb-3 text-base font-semibold text-red-800 sm:mb-4 sm:text-lg">Low Stock Alerts</h2>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {products.map((product) => <Link key={product.id} href={`/admin/products/${product.id}/edit`} className="flex items-center gap-2 rounded-full border border-red-300 bg-white px-2.5 py-1 text-xs text-red-700 hover:bg-red-100 sm:px-3 sm:text-sm"><span className="font-medium">{product.title}</span><span className="text-red-500">({product.inventory} left)</span></Link>)}
      </div>
    </div>
  );
}

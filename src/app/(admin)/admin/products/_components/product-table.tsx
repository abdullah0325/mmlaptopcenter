import Link from "next/link";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import type { Product } from "./types";

export function ProductTable({
  products,
  onDelete,
}: {
  products: Product[];
  onDelete: (id: string) => void;
}) {
  return (
    <div className="-mx-4 overflow-hidden rounded-lg bg-white shadow md:mx-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-50">
            <tr>
              {["Image", "Product", "Price", "Status", "Stock", "Actions"].map((label) => (
                <th key={label} className="px-2 py-2 text-left text-xs font-medium uppercase text-gray-500 md:px-4 md:py-3">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <ProductRow key={product.id} product={product} onDelete={onDelete} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductRow({ product, onDelete }: { product: Product; onDelete: (id: string) => void }) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-2 py-2 md:px-4 md:py-3">
        {product.featuredImage ? (
          <img src={product.featuredImage} alt={product.title} className="h-8 w-8 rounded object-cover sm:h-10 sm:w-10 md:h-12 md:w-12" />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-200 sm:h-10 sm:w-10 md:h-12 md:w-12">
            <span className="text-xs text-gray-400">No</span>
          </div>
        )}
      </td>
      <td className="px-2 py-2 md:px-4 md:py-3">
        <p className="max-w-[120px] truncate text-sm font-medium text-[#0a0a0a] sm:max-w-[200px]">{product.title}</p>
        <p className="hidden text-xs text-gray-500 sm:block">{product.handle}</p>
      </td>
      <td className="px-2 py-2 text-xs sm:text-sm md:px-4 md:py-3">Rs. {product.price.toLocaleString()}</td>
      <td className="px-2 py-2 md:px-4 md:py-3">
        <span className={`inline-flex rounded-full px-1.5 py-0.5 text-xs font-medium ${statusClass(product.status)}`}>
          {product.status}
        </span>
      </td>
      <td className="px-2 py-2 text-xs sm:text-sm md:px-4 md:py-3">{product.inventory}</td>
      <td className="px-2 py-2 text-right md:px-4 md:py-3">
        <div className="flex items-center justify-end gap-1">
          <Link href={`/admin/products/${product.id}/edit`} className="p-1 text-gray-400 hover:text-[#d8a928]">
            <FiEdit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Link>
          <button onClick={() => onDelete(product.id)} className="p-1 text-gray-400 hover:text-red-500">
            <FiTrash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function statusClass(status: string) {
  if (status === "ACTIVE") return "bg-green-100 text-green-700";
  if (status === "DRAFT") return "bg-gray-100 text-gray-700";
  return "bg-red-100 text-red-700";
}

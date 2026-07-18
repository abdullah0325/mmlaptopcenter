"use client";

import { ProductListHeader } from "./product-list-header";
import { ProductTable } from "./product-table";
import { useProducts } from "./use-products";

export function ProductList() {
  const { products, loading, search, setSearch, deleteProduct } = useProducts();

  return (
    <div className="p-4 md:p-8">
      <ProductListHeader search={search} setSearch={setSearch} />
      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-sm text-gray-500">No products found</p>
      ) : (
        <ProductTable products={products} onDelete={deleteProduct} />
      )}
    </div>
  );
}

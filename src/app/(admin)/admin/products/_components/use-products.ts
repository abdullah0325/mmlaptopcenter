"use client";

import { useEffect, useState } from "react";
import type { Product } from "./types";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    void fetchProducts();
  }, [search]);

  async function fetchProducts() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      params.set("limit", "50");

      const res = await fetch(`/api/admin/products?${params}`, { next: { revalidate: 0 } });
      const data = await res.json();
      if (data.products) setProducts(data.products);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
        next: { revalidate: 0 },
      });
      if (res.ok) setProducts((items) => items.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  }

  return { products, loading, search, setSearch, deleteProduct };
}

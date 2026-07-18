"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { CollectionFormValues } from "./collection-form";

function slugify(input: string) {
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function useCollectionForm({ mode, collectionId, initialValues }: {
  mode: "create" | "edit";
  collectionId?: string;
  initialValues?: Partial<CollectionFormValues>;
}) {
  const router = useRouter();
  const [values, setValues] = useState<CollectionFormValues>({
    title: "", handle: "", description: "", descriptionHtml: "", image: "",
    seoTitle: "", seoDescription: "", productHandles: [], isFeatured: false, ...initialValues,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Array<{ id: string; title: string; handle: string }>>([]);
  const [productSearch, setProductSearch] = useState("");
  const canAutoHandle = useMemo(() => values.handle.trim().length === 0, [values.handle]);

  useEffect(() => {
    if (canAutoHandle && values.title.trim()) setValues((v) => ({ ...v, handle: slugify(v.title) }));
  }, [values.title, canAutoHandle]);

  useEffect(() => {
    async function loadProducts() {
      const res = await fetch("/api/admin/products?limit=200");
      const data = await res.json().catch(() => ({}));
      setProducts(Array.isArray(data.products) ? data.products : []);
    }
    void loadProducts();
  }, []);

  const filteredProducts = useMemo(() => products.filter((p) => `${p.title} ${p.handle}`.toLowerCase().includes(productSearch.toLowerCase())), [products, productSearch]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = { ...values, image: values.image?.trim() || undefined, productHandles: values.productHandles ?? [], isFeatured: values.isFeatured ?? false };
      const res = await fetch(mode === "create" ? "/api/admin/collections" : `/api/admin/collections/${collectionId}`, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "Failed to save collection");
        return;
      }
      router.push("/admin/collections");
      router.refresh();
    } catch {
      setError("Failed to save collection");
    } finally {
      setSaving(false);
    }
  }

  return { values, setValues, saving, error, productSearch, setProductSearch, filteredProducts, onSubmit };
}

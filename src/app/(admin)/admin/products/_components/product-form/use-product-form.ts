"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { CategoryItem, CollectionItem, ProductFormValues } from "./types";
import { defaultProductValues } from "./initial-values";
import { loadProductExtras, saveProductExtra } from "./product-extras";
import { slugifyHandle } from "./utils";

export function useProductForm({ mode, productId, initialValues }: {
  mode: "create" | "edit";
  productId?: string;
  initialValues?: Partial<ProductFormValues>;
}) {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>({ ...defaultProductValues, ...initialValues });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [collectionSearch, setCollectionSearch] = useState("");
  const [savingDetails, setSavingDetails] = useState(false);

  const canAutoHandle = useMemo(() => values.handle.trim().length === 0, [values.handle]);
  const parentCategories = useMemo(() => categories.filter((c) => !c.parentId), [categories]);
  const subcategories = useMemo(() => categories.filter((c) => c.parentId === values.categoryId), [categories, values.categoryId]);
  const visibleCollections = useMemo(() => collections.filter((c) => c.title.toLowerCase().includes(collectionSearch.toLowerCase())), [collections, collectionSearch]);

  useEffect(() => {
    if (canAutoHandle && values.title.trim()) setValues((v) => ({ ...v, handle: slugifyHandle(v.title) }));
  }, [values.title, canAutoHandle]);

  useEffect(() => {
    async function loadOptions() {
      const [catRes, colRes] = await Promise.all([
        fetch("/api/admin/categories", { next: { revalidate: 0 } }),
        fetch("/api/admin/collections", { next: { revalidate: 0 } }),
      ]);
      const catData = await catRes.json().catch(() => ({}));
      const colData = await colRes.json().catch(() => ({}));
      setCategories(Array.isArray(catData.categories) ? catData.categories : []);
      setCollections(Array.isArray(colData.collections) ? colData.collections : []);
    }
    void loadOptions();
  }, []);

  useEffect(() => {
    if (mode === "edit" && productId) {
      void loadProductExtras(productId, setValues);
    }
  }, [mode, productId]);

  async function saveDetails() {
    await saveProductExtra(productId, "details", values.details, setSavingDetails, setError);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (!values.images.length) {
        setError("At least one image is required");
        return;
      }
      const payload = { ...values, compareAtPrice: values.compareAtPrice === null ? undefined : values.compareAtPrice };
      const res = await fetch(mode === "create" ? "/api/admin/products" : `/api/admin/products/${productId}`, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        next: { revalidate: 0 },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "Failed to save product");
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Failed to save product");
    } finally {
      setSaving(false);
    }
  }

  return {
    values, setValues, saving, error, onSubmit, categories, parentCategories, subcategories,
    collectionSearch, setCollectionSearch, visibleCollections, savingDetails, saveDetails,
  };
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { CategoryFormValues } from "./category-form";

function slugify(input: string) {
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function useCategoryForm({ mode, categoryId, initialValues }: {
  mode: "create" | "edit";
  categoryId?: string;
  initialValues?: Partial<CategoryFormValues>;
}) {
  const router = useRouter();
  const [values, setValues] = useState<CategoryFormValues>({
    name: "", slug: "", description: "", image: "", parentId: "", order: 0,
    featured: false, seoTitle: "", seoDescription: "", productIds: [], ...initialValues,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Array<{ id: string; name: string; parentId?: string | null }>>([]);
  const canAutoSlug = useMemo(() => values.slug.trim().length === 0, [values.slug]);
  const parentOptions = useMemo(() => categories.filter((c) => !c.parentId && c.id !== categoryId), [categories, categoryId]);

  useEffect(() => {
    if (canAutoSlug && values.name.trim()) setValues((v) => ({ ...v, slug: slugify(v.name) }));
  }, [values.name, canAutoSlug]);

  useEffect(() => {
    async function loadCategories() {
      const res = await fetch("/api/admin/categories");
      const data = await res.json().catch(() => ({}));
      setCategories(Array.isArray(data.categories) ? data.categories : []);
    }
    void loadCategories();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError(null);
    try {
      const payload = { ...values, image: values.image?.trim() || undefined, parentId: values.parentId?.trim() || undefined, productIds: values.productIds ?? [] };
      if (!payload.image) {
        setError("Category image is required"); setSaving(false); return;
      }
      const res = await fetch(mode === "create" ? "/api/admin/categories" : `/api/admin/categories/${categoryId}`, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "Failed to save category");
        return;
      }
      router.push("/admin/categories");
      router.refresh();
    } catch {
      setError("Failed to save category");
    } finally {
      setSaving(false);
    }
  }

  return { values, setValues, saving, error, parentOptions, onSubmit };
}

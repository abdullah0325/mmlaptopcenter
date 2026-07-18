"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { BlogFormValues } from "./blog-form";

function slugify(input: string) {
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function useBlogForm({ mode, postId, initialValues }: {
  mode: "create" | "edit";
  postId?: string;
  initialValues?: Partial<BlogFormValues>;
}) {
  const router = useRouter();
  const [values, setValues] = useState<BlogFormValues>({
    title: "", slug: "", excerpt: "", content: "", featuredImage: "",
    author: "Admin", status: "draft", seoTitle: "", seoDescription: "",
    tags: [], isFeatured: false, ...initialValues,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Array<{ id: string; name: string; parentId?: string | null }>>([]);
  const canAutoSlug = useMemo(() => values.slug.trim().length === 0, [values.slug]);

  useEffect(() => {
    if (canAutoSlug && values.title.trim()) setValues((v) => ({ ...v, slug: slugify(v.title) }));
  }, [values.title, canAutoSlug]);

  useEffect(() => {
    async function loadCategories() {
      const res = await fetch("/api/admin/categories");
      const data = await res.json().catch(() => ({}));
      setCategories((Array.isArray(data.categories) ? data.categories : []).filter((c: any) => !c.parentId));
    }
    void loadCategories();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError(null);
    try {
      const payload = { ...values, featuredImage: values.featuredImage?.trim() || undefined, tags: values.tags ?? [], isFeatured: values.isFeatured ?? false };
      const res = await fetch(mode === "create" ? "/api/admin/blog" : `/api/admin/blog/${postId}`, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "Failed to save post");
        return;
      }
      router.push("/admin/blog");
      router.refresh();
    } catch {
      setError("Failed to save post");
    } finally {
      setSaving(false);
    }
  }

  return { values, setValues, saving, error, categories, onSubmit };
}

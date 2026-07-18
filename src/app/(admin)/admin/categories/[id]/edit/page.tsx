"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CategoryForm, type CategoryFormValues } from "../../_components/category-form";

export default function EditCategoryPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<Partial<CategoryFormValues>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/categories/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load category");

        if (cancelled) return;
        setInitialValues({
          name: data.name ?? "",
          slug: data.slug ?? "",
          description: data.description ?? "",
          image: data.image ?? "",
          parentId: data.parentId ?? "",
          order: data.order ?? 0,
          featured: data.featured ?? false,
          seoTitle: data.seoTitle ?? "",
          seoDescription: data.seoDescription ?? "",
          productIds: Array.isArray(data.productIds) ? data.productIds : [],
        });
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load category");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <div className="p-8 text-sm text-[#5A5E55]">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return <CategoryForm mode="edit" categoryId={id} initialValues={initialValues} />;
}


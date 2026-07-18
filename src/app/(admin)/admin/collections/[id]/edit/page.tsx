"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CollectionForm, type CollectionFormValues } from "../../_components/collection-form";

export default function EditCollectionPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<Partial<CollectionFormValues>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/collections/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load collection");

        if (cancelled) return;
        setInitialValues({
          title: data.title ?? "",
          handle: data.handle ?? "",
          description: data.description ?? "",
          descriptionHtml: data.descriptionHtml ?? "",
          image: data.image ?? "",
          seoTitle: data.seoTitle ?? "",
          seoDescription: data.seoDescription ?? "",
          productHandles: Array.isArray(data.productHandles) ? data.productHandles : [],
          isFeatured: data.isFeatured ?? false,
        });
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load collection");
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

  return <CollectionForm mode="edit" collectionId={id} initialValues={initialValues} />;
}


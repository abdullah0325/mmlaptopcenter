"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProductForm, type ProductFormValues, type ProductVariantFormValue } from "../../_components/product-form";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<Partial<ProductFormValues>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/products/${id}`, { next: { revalidate: 0 } });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load product");

        if (cancelled) return;
        setInitialValues({
          title: data.title ?? "",
          handle: data.handle ?? "",
          description: data.description ?? "",
          descriptionHtml: data.descriptionHtml ?? "",
          price: data.price ?? 0,
          compareAtPrice: data.compareAtPrice ?? null,
          sku: data.sku ?? "",
          inventory: data.inventory ?? 0,
          availableForSale: data.availableForSale ?? true,
          status: data.status ?? "ACTIVE",
          seoTitle: data.seoTitle ?? "",
          seoDescription: data.seoDescription ?? "",
          images: Array.isArray(data.images) ? data.images : [],
          featuredImage: data.featuredImage ?? "",
          productType: data.productType ?? "",
          categoryId: data.categoryId ?? "",
          subcategoryId: data.subcategoryId ?? "",
          vendor: data.vendor ?? "MM Laptop Center",
          tags: Array.isArray(data.tags) ? data.tags : [],
          collectionIds: Array.isArray(data.collectionIds) ? data.collectionIds : [],
          isFeatured: data.isFeatured ?? false,
          displayOrder: data.displayOrder && data.displayOrder > 0 ? data.displayOrder : 9999,
          details: Array.isArray(data.details) ? data.details : [],
          color: data.color ?? "",
          size: data.size ?? "",
          storage: data.storage ?? "",
          ram: data.ram ?? "",
          processor: data.processor ?? "",
          condition: data.condition ?? "",
          specifications: data.specifications && typeof data.specifications === "object" ? data.specifications : {},
          customAttributes: data.customAttributes && typeof data.customAttributes === "object" ? data.customAttributes : {},
          variants: Array.isArray(data.variants) ? data.variants.map((variant: ProductVariantFormValue) => ({
            ...variant,
            description: variant.description ?? "",
            sku: variant.sku ?? "",
            images: Array.isArray(variant.images) ? variant.images : [],
            color: variant.color ?? "",
            size: variant.size ?? "",
            storage: variant.storage ?? "",
            ram: variant.ram ?? "",
            processor: variant.processor ?? "",
            condition: variant.condition ?? "",
            specifications: variant.specifications && typeof variant.specifications === "object" ? variant.specifications : {},
            customAttributes: variant.customAttributes && typeof variant.customAttributes === "object" ? variant.customAttributes : {},
          })) : [],
        });
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load product");
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

  return <ProductForm mode="edit" productId={id} initialValues={initialValues} />;
}


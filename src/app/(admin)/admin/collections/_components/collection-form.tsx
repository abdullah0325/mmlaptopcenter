"use client";

import Link from "next/link";
import { CollectionMainFields } from "./collection-main-fields";
import { CollectionSidebarFields } from "./collection-sidebar-fields";
import { useCollectionForm } from "./use-collection-form";

export type CollectionFormValues = {
  title: string;
  handle: string;
  description?: string;
  descriptionHtml?: string;
  image?: string;
  seoTitle?: string;
  seoDescription?: string;
  productHandles: string[];
  isFeatured?: boolean;
};

export function CollectionForm({
  mode,
  collectionId,
  initialValues,
}: {
  mode: "create" | "edit";
  collectionId?: string;
  initialValues?: Partial<CollectionFormValues>;
}) {
  const { values, setValues, saving, error, productSearch, setProductSearch, filteredProducts, onSubmit } = useCollectionForm({ mode, collectionId, initialValues });

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0a0a0a]">
            {mode === "create" ? "Add Collection" : "Edit Collection"}
          </h1>
          <p className="mt-1 text-sm text-[#5A5E55]">
            Collections power the public `/collections/*` pages.
          </p>
        </div>
        <Link
          href="/admin/collections"
          className="rounded-lg border border-[#d8a928]/25 bg-white px-4 py-2 text-sm font-medium text-[#0a0a0a] hover:bg-[#fcf5e8]"
        >
          Back
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={onSubmit}
        className="grid gap-6 rounded-xl border border-[#d8a928]/20 bg-white p-6 lg:grid-cols-2"
      >
        <CollectionMainFields values={values} setValues={setValues} />
        <CollectionSidebarFields values={values} setValues={setValues} productSearch={productSearch} setProductSearch={setProductSearch} filteredProducts={filteredProducts} saving={saving} />
      </form>
    </div>
  );
}


"use client";

import Link from "next/link";
import { CategoryMainFields } from "./category-main-fields";
import { CategorySideFields } from "./category-side-fields";
import { useCategoryForm } from "./use-category-form";

export type CategoryFormValues = {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  order: number;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  productIds: string[];
};

export function CategoryForm({
  mode,
  categoryId,
  initialValues,
}: {
  mode: "create" | "edit";
  categoryId?: string;
  initialValues?: Partial<CategoryFormValues>;
}) {
  const { values, setValues, saving, error, parentOptions, onSubmit } = useCategoryForm({ mode, categoryId, initialValues });

  return (
    <div className="p-4 md:p-8">
      <div className="mb-4 md:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0a0a0a]">
            {mode === "create" ? "Add Category" : "Edit Category"}
          </h1>
          <p className="mt-1 text-xs md:text-sm text-[#5A5E55]">
            Categories can be used for filtering on the public product listing.
          </p>
        </div>
        <Link
          href="/admin/categories"
          className="rounded-lg border border-[#d8a928]/25 bg-white px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium text-[#0a0a0a] hover:bg-[#fcf5e8]"
        >
          Back
        </Link>
      </div>

      {error && (
        <div className="mb-3 md:mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={onSubmit}
        className="grid gap-4 md:gap-6 rounded-xl border border-[#d8a928]/20 bg-white p-4 md:p-6 lg:grid-cols-2"
      >
        <CategoryMainFields values={values} setValues={setValues} />
        <CategorySideFields values={values} setValues={setValues} parentOptions={parentOptions} saving={saving} />
      </form>
    </div>
  );
}


"use client";

import Link from "next/link";
import { BlogContentFields } from "./blog-content-fields";
import { BlogMainFields } from "./blog-main-fields";
import { BlogSeoFields } from "./blog-seo-fields";
import { useBlogForm } from "./use-blog-form";

export type BlogFormValues = {
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  featuredImage?: string;
  categoryId?: string;
  author?: string;
  status: "draft" | "published";
  seoTitle?: string;
  seoDescription?: string;
  tags: string[];
  isFeatured?: boolean;
};

export function BlogForm({
  mode,
  postId,
  initialValues,
}: {
  mode: "create" | "edit";
  postId?: string;
  initialValues?: Partial<BlogFormValues>;
}) {
  const { values, setValues, saving, error, categories, onSubmit } = useBlogForm({ mode, postId, initialValues });

  return (
    <div className="p-4 md:p-8">
      <div className="mb-4 md:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0a0a0a]">
            {mode === "create" ? "Add Blog Post" : "Edit Blog Post"}
          </h1>
          <p className="mt-1 text-xs md:text-sm text-[#5A5E55]">
            This is the admin CMS table (BlogPost).
          </p>
        </div>
        <Link
          href="/admin/blog"
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
        className="grid gap-4 md:gap-6 rounded-xl border border-[#d8a928]/20 bg-white p-4 md:p-6"
      >
        <BlogMainFields values={values} setValues={setValues} categories={categories} />
        <BlogContentFields values={values} setValues={setValues} />
        <BlogSeoFields values={values} setValues={setValues} saving={saving} />
      </form>
    </div>
  );
}


import { Metadata } from "next";
import type { JsonValue } from "@prisma/client/runtime/library";
import { getCategoriesForFilters, getAllProductsForFilter } from "./service";
import { ProductsPageContent } from "./_components/products-page-content";

export const revalidate = 60;

/* ---------------- SEO METADATA ---------------- */

export const metadata: Metadata = {
  title: "Shop Laptops – MM Laptop Center",
  description:
    "MM Laptop Center – Shop premium laptops, gaming gear and accessories",

  keywords: [
    "laptops",
    "gaming laptops",
    "business laptops",
    "ultrabooks",
    "budget laptops",
    "laptop accessories",
    "monitors",
    "keyboards",
    "mice",
    "laptop bags",
    "MM Laptop Center",
  ],

  openGraph: {
    title: "Shop Laptops – MM Laptop Center",
    description:
      "Browse gaming laptops, business ultrabooks, accessories and more at MM Laptop Center.",
    url: "https://mmlaptopcenter.com/products",
    siteName: "MM Laptop Center",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Shop Laptops – MM Laptop Center",
    description:
      "Discover premium laptops, gaming gear and tech accessories at MM Laptop Center.",
  },

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "https://mmlaptopcenter.com/products",
  },
};

/* ---------------- PAGE ---------------- */

export default async function Page({
  searchParams,
}: {
  searchParams?: { q?: string; category?: string; subcategory?: string; tag?: string; min?: string; max?: string };
}) {
  const initialCategorySlug = (searchParams?.category ?? "").trim();

  let categories: Array<{ id: string; name: string; slug: string; order: number; subcategories: Array<{ id: string; name: string; slug: string; parentId: string | null; order: number }> }> = [];
  let allProducts: Array<{ id: string; handle: string; title: string; price: number; compareAtPrice: number | null; featuredImage: string | null; images: JsonValue | null; tags: JsonValue | null; description: string | null; sku: string | null; productType: string | null; vendor: string; categoryId: string | null; subcategoryId: string | null; isFeatured: boolean }> = [];

  try {
    [categories, allProducts] = await Promise.all([
      getCategoriesForFilters(),
      getAllProductsForFilter(),
    ]);
  } catch (error) {
    console.error("Failed to load products:", error);
  }

  return (
    <ProductsPageContent
      categories={categories}
      initialProducts={allProducts}
      initialCategorySlug={initialCategorySlug}
    />
  );
}


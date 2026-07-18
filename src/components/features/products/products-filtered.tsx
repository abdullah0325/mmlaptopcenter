"use client";

import { useMemo, useState } from "react";
import { StoreProductCard } from "@/components/features/products/store-product-card-wrapper";

const FALLBACK_IMAGE = "/logo/mmlaptop.png";

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  order: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  order: number;
  subcategories: Subcategory[];
}

interface Product {
  id: string;
  handle: string;
  title: string;
  price: number | null;
  compareAtPrice: number | null;
  featuredImage: string | null;
  images: unknown;
  tags: unknown;
  description?: string | null;
  sku?: string | null;
  productType?: string | null;
  vendor?: string | null;
  categoryId: string | null;
  subcategoryId: string | null;
}

interface Props {
  categories: Category[];
  initialProducts: Product[];
  initialCategorySlug?: string;
}

type CategoryNode = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  order: number;
};

type ProductRow = {
  categoryId: string;
  products: Product[];
};

function getStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function buildCategoryNodes(categories: Category[]) {
  return categories.flatMap<CategoryNode>((category) => [
    {
      id: category.id,
      name: category.name,
      slug: category.slug,
      parentId: null,
      order: category.order,
    },
    ...category.subcategories.map((subcategory) => ({
      id: subcategory.id,
      name: subcategory.name,
      slug: subcategory.slug,
      parentId: category.id,
      order: subcategory.order,
    })),
  ]);
}

function ProductCard({ product }: { product: Product }) {
  const productImageUrls = getStringArray(product.images);
  const firstImage = productImageUrls[0] || null;
  const firstTag = getStringArray(product.tags)[0];

  return (
    <StoreProductCard
      handle={product.handle}
      title={product.title}
      featuredImageUrl={product.featuredImage || firstImage || FALLBACK_IMAGE}
      imageUrls={productImageUrls}
      price={{ amount: Number(product.price || 0).toFixed(2), currencyCode: "PKR" }}
      compareAtPrice={
        product.compareAtPrice
          ? { amount: Number(product.compareAtPrice).toFixed(2), currencyCode: "PKR" }
          : null
      }
      tag={firstTag}
      productId={product.id}
    />
  );
}

export function ProductsFiltered({
  categories,
  initialProducts,
  initialCategorySlug = "",
}: Props) {
  const categoryNodes = useMemo(() => buildCategoryNodes(categories), [categories]);
  const initialCategory = categoryNodes.find((category) => category.slug === initialCategorySlug);
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategory?.id || "");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

  const categoryById = useMemo(
    () => new Map(categoryNodes.map((category) => [category.id, category])),
    [categoryNodes],
  );

  const childIdsByParentId = useMemo(() => {
    return categoryNodes.reduce((map, category) => {
      if (!category.parentId) return map;
      const ids = map.get(category.parentId) || [];
      ids.push(category.id);
      map.set(category.parentId, ids);
      return map;
    }, new Map<string, string[]>());
  }, [categoryNodes]);

  const categoriesWithProducts = useMemo(() => {
    return categories
      .filter((category) => {
        const relatedCategoryIds = new Set([
          category.id,
          ...category.subcategories.map((subcategory) => subcategory.id),
        ]);

        return initialProducts.some((product) => {
          const effectiveCategoryId = product.subcategoryId || product.categoryId;
          return Boolean(effectiveCategoryId && relatedCategoryIds.has(effectiveCategoryId));
        });
      })
      .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
  }, [categories, initialProducts]);

  const selectedCategoryIds = useMemo(() => {
    if (!selectedCategoryId) return null;

    const category = categoryById.get(selectedCategoryId);
    if (!category) return null;

    return new Set([
      category.id,
      ...(category.parentId ? [] : childIdsByParentId.get(category.id) || []),
    ]);
  }, [categoryById, childIdsByParentId, selectedCategoryId]);

  const filteredProducts = useMemo(() => {
    const products = initialProducts.filter((product) => {
      const price = Number(product.price || 0);
      if (priceRange === "under-50000") return price < 50000;
      if (priceRange === "50000-100000") return price >= 50000 && price <= 100000;
      if (priceRange === "100000-200000") return price > 100000 && price <= 200000;
      if (priceRange === "over-200000") return price > 200000;
      return true;
    });

    return [...products].sort((a, b) => {
      if (sortBy === "price-low") return Number(a.price || 0) - Number(b.price || 0);
      if (sortBy === "price-high") return Number(b.price || 0) - Number(a.price || 0);
      if (sortBy === "name") return a.title.localeCompare(b.title);
      return 0;
    });
  }, [initialProducts, priceRange, sortBy]);

  const selectedProducts = useMemo(() => {
    if (!selectedCategoryIds) return filteredProducts;

    return filteredProducts.filter((product) => {
      const effectiveCategoryId = product.subcategoryId || product.categoryId;
      return Boolean(effectiveCategoryId && selectedCategoryIds.has(effectiveCategoryId));
    });
  }, [filteredProducts, selectedCategoryIds]);

  const otherProducts = useMemo(() => {
    if (!selectedCategoryIds) return [];

    return filteredProducts.filter((product) => {
      const effectiveCategoryId = product.subcategoryId || product.categoryId;
      return !effectiveCategoryId || !selectedCategoryIds.has(effectiveCategoryId);
    });
  }, [filteredProducts, selectedCategoryIds]);

  const buildRows = (sourceProducts: Product[]) => {
    const grouped = sourceProducts.reduce((map, product) => {
      const categoryId = product.subcategoryId || product.categoryId;
      if (!categoryId || !categoryById.has(categoryId)) return map;

      const products = map.get(categoryId) || [];
      products.push(product);
      map.set(categoryId, products);
      return map;
    }, new Map<string, Product[]>());

    return categoryNodes
      .map<ProductRow | null>((category) => {
        const products = grouped.get(category.id) || [];
        return products.length ? { categoryId: category.id, products } : null;
      })
      .filter((row): row is ProductRow => Boolean(row));
  };

  const selectedRows = buildRows(selectedProducts);
  const otherRows = buildRows(otherProducts);
  const visibleRows = selectedRows;

  const pagedRows = visibleRows.filter((row) => row.products.length > 0);

  const pagedOtherRows = otherRows.filter((row) => row.products.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-[#d8a928]/20 bg-white p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-end sm:justify-end">
        <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wide text-[#5A5E55]">
          Category
          <select
            value={selectedCategoryId}
            onChange={(event) => setSelectedCategoryId(event.target.value)}
            className="min-w-44 rounded-lg border border-[#d8a928]/30 bg-[#fcf5e8] px-3 py-2.5 text-sm font-semibold normal-case tracking-normal text-[#0a0a0a] outline-none transition focus:border-[#f6a45d] focus:ring-2 focus:ring-[#f6a45d]/20"
          >
            <option value="">All Products</option>
            {categoriesWithProducts.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </label>

        <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wide text-[#5A5E55]">
          Price Range
          <select
            value={priceRange}
            onChange={(event) => setPriceRange(event.target.value)}
            className="min-w-44 rounded-lg border border-[#d8a928]/30 bg-[#fcf5e8] px-3 py-2.5 text-sm font-semibold normal-case tracking-normal text-[#0a0a0a] outline-none transition focus:border-[#f6a45d] focus:ring-2 focus:ring-[#f6a45d]/20"
          >
            <option value="all">All Prices</option>
            <option value="under-50000">Under PKR 50,000</option>
            <option value="50000-100000">PKR 50,000–100,000</option>
            <option value="100000-200000">PKR 100,000–200,000</option>
            <option value="over-200000">Over PKR 200,000</option>
          </select>
        </label>

        <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wide text-[#5A5E55]">
          Sort By
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="min-w-40 rounded-lg border border-[#d8a928]/30 bg-[#fcf5e8] px-3 py-2.5 text-sm font-semibold normal-case tracking-normal text-[#0a0a0a] outline-none transition focus:border-[#f6a45d] focus:ring-2 focus:ring-[#f6a45d]/20"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </label>
      </div>

      <div className="relative grid gap-6">
        <section className="min-w-0 space-y-6">
          {pagedRows.length > 0 ? (
            pagedRows.map((row) => (
              <div
                key={row.categoryId}
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4"
              >
                {row.products.map((product) => (
                  <ProductCard key={product.handle} product={product} />
                ))}
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-[#d8a928]/20 bg-white p-12 text-center">
              <p className="text-lg text-[#5A5E55]">No products found.</p>
            </div>
          )}

          {selectedCategoryId && pagedOtherRows.length > 0 ? (
            <div className="space-y-6 border-t border-[#d8a928]/20 pt-8">
              <h2 className="font-serif text-xl font-bold text-[#0a0a0a]">Other Products</h2>
              {pagedOtherRows.map((row) => (
                <div
                  key={`other-${row.categoryId}`}
                  className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4"
                >
                  {row.products.map((product) => (
                    <ProductCard key={product.handle} product={product} />
                  ))}
                </div>
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}

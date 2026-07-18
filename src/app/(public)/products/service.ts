import { getAllProducts, searchProducts as searchProductsInDb } from "@/lib/storefront";
import { invariant } from "@esmate/utils";
import { prisma } from "@/lib/prisma";

function getProductImage(product: { featuredImage: string | null; images: unknown }) {
  if (product.featuredImage) {
    return product.featuredImage;
  }

  if (Array.isArray(product.images)) {
    return product.images.find((image): image is string => typeof image === "string") || null;
  }

  return null;
}

export async function getProductList(cursor?: string) {
  const products = await getAllProducts(cursor, 100);
  invariant(products, "products are not available");
  return products;
}

export async function getAllProductsForFilter() {
  return prisma.product.findMany({
    where: { status: "ACTIVE" },
    orderBy: { updatedAt: "desc" },
    take: 100,
    select: {
      id: true,
      handle: true,
      title: true,
      price: true,
      compareAtPrice: true,
      featuredImage: true,
      images: true,
      tags: true,
      description: true,
      sku: true,
      productType: true,
      vendor: true,
      categoryId: true,
      subcategoryId: true,
      isFeatured: true,
    },
  });
}

export async function searchProducts(query: string) {
  return searchProductsInDb(query);
}

export async function getCategoriesForFilters() {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { order: "asc" },
    select: { id: true, name: true, slug: true, order: true },
  });

  const subcategories = await prisma.category.findMany({
    where: { parentId: { not: null } },
    orderBy: { order: "asc" },
    select: { id: true, name: true, slug: true, parentId: true, order: true },
  });

  return categories.map(cat => ({
    ...cat,
    subcategories: subcategories.filter(sub => sub.parentId === cat.id)
  }));
}

export async function getProductsByCategorySlug(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
    select: { productIds: true },
  });

  const productIds = Array.isArray(category?.productIds)
    ? (category!.productIds as unknown[]).filter((x): x is string => typeof x === "string")
    : [];

  if (productIds.length === 0) {
    return [];
  }

  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, status: "ACTIVE" },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      handle: true,
      title: true,
      price: true,
      featuredImage: true,
      images: true,
      tags: true,
    },
    take: 60,
  });

  // Match the `searchProducts` return shape (ProductCardNode[])
  return products.map((p) => ({
    id: p.id,
    handle: p.handle,
    title: p.title,
    tags: Array.isArray(p.tags) ? (p.tags as unknown[]).filter((x): x is string => typeof x === "string") : [],
    featuredImage: {
      id: `${p.id}-featured`,
      url: getProductImage(p) ?? "https://placehold.co/400x300?text=Laptop",
      altText: null,
      width: 1200,
      height: 1200,
    },
    priceRange: {
      minVariantPrice: { amount: Number(p.price ?? 0).toFixed(2), currencyCode: "PKR" },
    },
  }));
}

export async function getProductsAdvanced(params: {
  q?: string;
  categorySlug?: string;
  subcategorySlug?: string;
  tag?: string;
  minPrice?: number;
  maxPrice?: number;
}) {
  const category = params.categorySlug
    ? await prisma.category.findUnique({ where: { slug: params.categorySlug }, select: { id: true } })
    : null;
  const subcategory = params.subcategorySlug
    ? await prisma.category.findUnique({ where: { slug: params.subcategorySlug }, select: { id: true } })
    : null;

  const products = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
      ...(params.q
        ? {
            OR: [
              { title: { contains: params.q, mode: "insensitive" } },
              { description: { contains: params.q, mode: "insensitive" } },
              { seoTitle: { contains: params.q, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(category?.id ? { categoryId: category.id } : {}),
      ...(subcategory?.id ? { subcategoryId: subcategory.id } : {}),
      ...(typeof params.minPrice === "number" ? { price: { gte: params.minPrice } } : {}),
      ...(typeof params.maxPrice === "number" ? { price: { lte: params.maxPrice } } : {}),
    },
    orderBy: { updatedAt: "desc" },
    take: 100,
    select: {
      id: true,
      handle: true,
      title: true,
      price: true,
      compareAtPrice: true,
      featuredImage: true,
      images: true,
      tags: true,
    },
  });

  return products
    .filter((p) => {
      if (!params.tag) return true;
      const tags = Array.isArray(p.tags)
        ? (p.tags as unknown[]).filter((x): x is string => typeof x === "string")
        : [];
      return tags.some((t) => t.toLowerCase().includes(params.tag!.toLowerCase()));
    })
    .map((p) => ({
      id: p.id,
      handle: p.handle,
      title: p.title,
      tags: Array.isArray(p.tags)
        ? (p.tags as unknown[]).filter((x): x is string => typeof x === "string")
        : [],
      featuredImage: {
        id: `${p.id}-featured`,
        url: getProductImage(p) ?? "https://placehold.co/400x300?text=Laptop",
        altText: null,
        width: 1200,
        height: 1200,
      },
      priceRange: {
        minVariantPrice: { amount: Number(p.price ?? 0).toFixed(2), currencyCode: "PKR" },
      },
      compareAtPrice: p.compareAtPrice
        ? { amount: Number(p.compareAtPrice).toFixed(2), currencyCode: "PKR" }
        : null,
    }));
}


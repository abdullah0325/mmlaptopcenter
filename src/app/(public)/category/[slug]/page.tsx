import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StoreProductCard } from "@/components/features/products/store-product-card-wrapper";

const FALLBACK_IMAGE = "/logo/mmlaptop.png";

export const revalidate = 60;

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return { title: "Category not found" };
  return {
    title: `${category.name} | MM Laptop Center`,
    description: category.description || `Explore ${category.name} products on MM Laptop Center.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
    select: { id: true, name: true },
  });
  if (!category) notFound();

  const [subcategories, categoryProducts, allProducts] = await Promise.all([
    prisma.category.findMany({
      where: { parentId: category.id },
      orderBy: { order: "asc" },
      select: { id: true, name: true, slug: true },
    }),
    prisma.product.findMany({
      where: { status: "ACTIVE", OR: [{ categoryId: category.id }, { subcategoryId: category.id }] },
      orderBy: { updatedAt: "desc" },
      take: 48,
      select: { id: true, handle: true, title: true, price: true, compareAtPrice: true, featuredImage: true, images: true, tags: true },
    }),
    prisma.product.findMany({
      where: { status: "ACTIVE" },
      orderBy: { updatedAt: "desc" },
      take: 48,
      select: { id: true, handle: true, title: true, price: true, compareAtPrice: true, featuredImage: true, images: true, tags: true },
    }),
  ]);

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-6 py-8 lg:px-8">
      {subcategories.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-[#0a0a0a]">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {subcategories.map((sub) => (
              <Link key={sub.id} href={`/category/${sub.slug}`} className="rounded-full border border-[#d8a928]/30 bg-white px-4 py-2 text-sm text-[#0a0a0a] hover:bg-[#fcf5e8]">
                {sub.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-xl font-semibold text-[#0a0a0a]">{category.name} Products</h2>
        {categoryProducts.length === 0 ? (
          <div className="rounded-xl border border-[#d8a928]/20 bg-white p-8 text-sm text-[#5A5E55]">No products found in this category yet.</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categoryProducts.map((product) => {
              const firstImage = Array.isArray(product.images)
                ? product.images.find((x): x is string => typeof x === "string")
                : null;
              const firstTag = Array.isArray(product.tags)
                ? product.tags.find((x): x is string => typeof x === "string")
                : undefined;
              return (
                <StoreProductCard
                  key={product.handle}
                  handle={product.handle}
                  title={product.title}
                  featuredImageUrl={product.featuredImage || firstImage || FALLBACK_IMAGE}
                  price={{ amount: Number(product.price || 0).toFixed(2), currencyCode: "PKR" }}
                  compareAtPrice={product.compareAtPrice ? { amount: Number(product.compareAtPrice).toFixed(2), currencyCode: "PKR" } : null}
                  tag={firstTag}
                  productId={product.id}
                />
              );
            })}
          </div>
        )}
      </section>

      {allProducts.length > 0 && (
        <section className="border-t border-[#d8a928]/20 pt-8">
          <h2 className="mb-4 text-xl font-semibold text-[#0a0a0a]">Related Products</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {allProducts.map((product) => {
              const firstImage = Array.isArray(product.images)
                ? product.images.find((x): x is string => typeof x === "string")
                : null;
              const firstTag = Array.isArray(product.tags)
                ? product.tags.find((x): x is string => typeof x === "string")
                : undefined;
              return (
                <StoreProductCard
                  key={product.handle}
                  handle={product.handle}
                  title={product.title}
                  featuredImageUrl={product.featuredImage || firstImage || FALLBACK_IMAGE}
                  price={{ amount: Number(product.price || 0).toFixed(2), currencyCode: "PKR" }}
                  compareAtPrice={product.compareAtPrice ? { amount: Number(product.compareAtPrice).toFixed(2), currencyCode: "PKR" } : null}
                  tag={firstTag}
                  productId={product.id}
                />
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}

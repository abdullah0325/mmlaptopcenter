import { ProductsFiltered } from "@/components/features/products/products-filtered";
import type { JsonValue } from "@prisma/client/runtime/library";

type CategoryFilter = {
  id: string;
  name: string;
  slug: string;
  order: number;
  subcategories: Array<{
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
    order: number;
  }>;
};

type ProductListItem = {
  id: string;
  handle: string;
  title: string;
  price: number;
  compareAtPrice: number | null;
  featuredImage: string | null;
  images: JsonValue | null;
  tags: JsonValue | null;
  description: string | null;
  sku: string | null;
  productType: string | null;
  vendor: string;
  categoryId: string | null;
  subcategoryId: string | null;
  isFeatured: boolean;
};

type ProductsPageContentProps = {
  categories: CategoryFilter[];
  initialProducts: ProductListItem[];
  initialCategorySlug?: string;
};

function ProductsSeoSection() {
  return (
    <section className="mt-16 border-t border-[#d8a928]/20 pt-12">
      <h2 className="text-2xl font-bold text-[#0a0a0a]">
        Premium Laptops, Gaming Gear & Natural Wellness Products
      </h2>

      <p className="mt-4 max-w-4xl text-[#5A5E55]">
        MM Laptop Center specializes in authentic Premium laptops products,
        responsibly sourced and minimally processed to retain their natural
        mineral composition. Our range includes edible laptops for cooking,
        bath and wellness salt, decorative and functional laptops lamps, and
        premium-grade Gaming Gear known for its traditional use in vitality and
        strength.
      </p>

      <p className="mt-4 max-w-4xl text-[#5A5E55]">
        Each product is selected with quality, purity, and sustainability in
        mind. We work closely with trusted suppliers to ensure our customers
        receive genuine Premium products suitable for daily use, wellness
        routines, and natural living.
      </p>
    </section>
  );
}

export function ProductsPageContent({
  categories,
  initialProducts,
  initialCategorySlug = "",
}: ProductsPageContentProps) {
  return (
    <main className="bg-background min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <ProductsFiltered
          categories={categories}
          initialProducts={initialProducts}
          initialCategorySlug={initialCategorySlug}
        />

        <ProductsSeoSection />
      </div>
    </main>
  );
}

import { StoreProductCard } from "@/components/features/products/store-product-card-wrapper";
import { ProductReviews } from "@/components/features/products/product-reviews";
import { titleize } from "@esmate/utils/string";

type RelatedProduct = {
  id: string;
  handle: string;
  title: string;
  tags?: string[];
  featuredImage: { url: string } | null;
  images?: { nodes?: Array<{ url: string }> };
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  compareAtPrice?: { amount: string; currencyCode: string } | null;
};

export function ProductDescriptionSection({
  description,
  descriptionHtml,
}: {
  description?: string | null;
  descriptionHtml?: string | null;
}) {
  const hasDescriptionHtml = Boolean(descriptionHtml?.trim());
  const hasDescription = Boolean(description?.trim());

  return (
    <section className="rounded-2xl border border-orange-200/80 bg-white p-5 shadow-sm sm:p-6">
      <div className="max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Overview</p>
        <h2 className="mt-2 font-serif text-2xl font-extrabold text-gray-950 sm:text-3xl">Product Description</h2>
        <div className="mt-4">
          {hasDescriptionHtml ? (
            <div
              className="prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: descriptionHtml || "" }}
            />
          ) : hasDescription ? (
            <p className="whitespace-pre-line text-sm leading-7 text-gray-700">{description}</p>
          ) : (
            <p className="text-sm text-gray-700">
              This product is ready for consultation. Contact MM Laptop Center for detailed specifications.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export function ProductReviewsSection({ productHandle }: { productHandle: string }) {
  return (
    <section className="rounded-xl border border-[#d8a928]/20 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8b1a1a]">Customer Proof</p>
          <h2 className="mt-2 text-2xl font-bold text-[#0a0a0a]">Reviews & Ratings</h2>
        </div>
        <p className="max-w-md text-sm text-[#5A5E55]">
          Real customer feedback appears here after approval. We show representative store feedback while a product is new.
        </p>
      </div>
      <ProductReviews productHandle={productHandle} />
    </section>
  );
}

export function RelatedProductsSection({ products }: { products: RelatedProduct[] }) {
  if (!products.length) {
    return null;
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8b1a1a]">Same Category</p>
          <h2 className="text-2xl font-bold text-[#0a0a0a]">Related Products</h2>
        </div>
        <p className="text-sm text-[#5A5E55]">More options from the same main category.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => {
          const galleryImages = product.images?.nodes?.map((image) => image.url) || [];

          return (
            <StoreProductCard
              key={product.handle}
              handle={product.handle}
              title={titleize(product.title)}
              featuredImageUrl={product.featuredImage?.url || galleryImages[0] || "/logo/mmlaptop.png"}
              imageUrls={galleryImages}
              price={product.priceRange.minVariantPrice}
              compareAtPrice={product.compareAtPrice}
              tag={product.tags?.[0]}
              productId={product.id}
            />
          );
        })}
      </div>
    </section>
  );
}

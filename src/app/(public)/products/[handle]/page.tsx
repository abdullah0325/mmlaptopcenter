import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductSingle } from "./product-single";
import { getProductSingle } from "./service";

export const revalidate = 60;

interface Props {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  try {
    const product = await getProductSingle(handle);

    return {
      title: product.seo.title,
      description: product.seo.description,
    };
  } catch {
    return {
      title: "Product Not Found",
    };
  }
}

export default async function Page({ params }: Props) {
  const { handle } = await params;
  try {
    const data = await getProductSingle(handle);

    const productLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: data.title,
      image: data.images?.nodes?.map((img) => img.url) || [],
      description: data.description || data.seo.description,
      sku: data.variants?.nodes?.[0]?.sku || undefined,
      brand: { "@type": "Brand", name: data.vendor || "MM Laptop Center" },
      offers: {
        "@type": "Offer",
        priceCurrency: data.priceRange.minVariantPrice.currencyCode,
        price: data.priceRange.minVariantPrice.amount,
        availability: data.variants?.nodes?.[0]?.availableForSale
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      },
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
        />
        <ProductSingle data={data} />
      </>
    );
  } catch {
    notFound();
  }
}


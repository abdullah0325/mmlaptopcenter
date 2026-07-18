"use client";
import { Button } from "@esmate/shadcn/components/ui/button";
import { Loader2 } from "@esmate/shadcn/pkgs/lucide-react";
import { useState } from "react";
import { getProductList } from "./service";
import { useRequest } from "@esmate/react/ahooks";
import { titleize } from "@esmate/utils/string";
import { StoreProductCard } from "@/components/features/products/store-product-card-wrapper";

const FALLBACK_IMAGE = "/logo/mmlaptop.png";

interface Props {
  data: Awaited<ReturnType<typeof getProductList>>;
}

export function ProductList(props: Props) {
  const [pages, setPages] = useState([props.data]);
  const lastPage = pages[pages.length - 1];
  const lastCursor = lastPage.edges[lastPage.edges.length - 1]?.cursor;
  const hasNextPage = lastPage.pageInfo.hasNextPage;

  const request = useRequest(
    async () => {
      setPages([...pages, await getProductList(lastCursor)]);
    },
    {
      manual: true,
    },
  );

  return (
    <section className="container mx-auto p-10 mt-10 mb-20">
      <h1 className="sr-only">Products</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {pages
          .flatMap(({ edges }) => edges)
          .map(({ node }) => (
            <StoreProductCard
              key={node.handle}
              handle={node.handle}
              title={titleize(node.title)}
              featuredImageUrl={node.featuredImage?.url || FALLBACK_IMAGE}
              price={node.priceRange.minVariantPrice}
              tag={node.tags?.[0]}
              productId={node.id}
            />
          ))}
      </div>
      {hasNextPage && (
        <div className="mt-12 flex justify-center ">
          <Button
            size="lg"
            variant={request.error ? "destructive" : "default"}
            onClick={request.run}
            disabled={request.loading}
            className="min-w-50 cursor-pointer"
          >
            {request.loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {request.loading ? "Loading..." : request.error ? "Try Again" : "Load More Products"}
          </Button>
        </div>
      )}
    </section>
  );
}


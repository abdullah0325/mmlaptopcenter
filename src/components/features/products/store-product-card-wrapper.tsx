"use client";

import dynamic from "next/dynamic";

const StoreProductCard = dynamic(
  () => import("@/components/features/products/store-product-card").then((m) => ({ default: m.StoreProductCard })),
  { ssr: false }
);

export { StoreProductCard };

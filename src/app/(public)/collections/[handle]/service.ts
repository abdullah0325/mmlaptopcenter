
import {
  getCollection as getCollectionFromDb,
  getCollectionProducts as getCollectionProductsFromDb,
} from "@/lib/storefront";
import { prisma } from "@/lib/prisma";
import { invariant } from "@esmate/utils";
import type { Prisma } from "@prisma/client";

const DEFAULT_CURRENCY = "PKR";
const DEFAULT_PAGE_SIZE = 12;
const FALLBACK_IMAGE = "/logo/mmlaptop.png";

const virtualCollections = {
  "best-sellers": {
    id: "virtual-best-sellers",
    handle: "best-sellers",
    title: "Best Sellers",
    description:
      "Shop the most popular laptops and accessories at MM Laptop Center, selected from customer favorites and high-value picks.",
    descriptionHtml: null,
    seo: {
      title: "Best Sellers | MM Laptop Center",
      description:
        "Discover MM Laptop Center best-selling laptops, gaming gear, and accessories.",
    },
    image: null,
  },
  "new-arrivals": {
    id: "virtual-new-arrivals",
    handle: "new-arrivals",
    title: "New Arrivals",
    description:
      "Explore the latest laptops, gaming gear, and accessories added to MM Laptop Center.",
    descriptionHtml: null,
    seo: {
      title: "New Arrivals | MM Laptop Center",
      description:
        "Browse the newest laptops and accessories available at MM Laptop Center.",
    },
    image: null,
  },
  "hot-deals": {
    id: "virtual-hot-deals",
    handle: "hot-deals",
    title: "Hot Deals",
    description:
      "Find current deals on laptops, accessories, and gaming essentials at MM Laptop Center.",
    descriptionHtml: null,
    seo: {
      title: "Hot Deals | MM Laptop Center",
      description:
        "Save on selected laptops, gaming gear, and accessories at MM Laptop Center.",
    },
    image: null,
  },
} as const;

function parseCursor(cursor?: string | null) {
  const parsed = Number(cursor ?? 0);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function parseStringArray(value: Prisma.JsonValue | null | undefined): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function toConnection<T>(items: T[], skip: number, totalCount: number) {
  return {
    pageInfo: {
      hasNextPage: skip + items.length < totalCount,
    },
    edges: items.map((node, index) => ({
      cursor: String(skip + index + 1),
      node,
    })),
  };
}

function toProductCardNode(product: {
  id: string;
  handle: string;
  title: string;
  price: number;
  compareAtPrice: number | null;
  featuredImage: string | null;
  images: Prisma.JsonValue;
  tags: Prisma.JsonValue;
}) {
  const imageUrls = parseStringArray(product.images);
  const featuredImageUrl = product.featuredImage ?? imageUrls[0] ?? FALLBACK_IMAGE;

  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    tags: parseStringArray(product.tags),
    featuredImage: {
      id: `${product.id}-featured`,
      url: featuredImageUrl,
      altText: product.title,
      width: 1200,
      height: 1200,
    },
    images: {
      nodes: imageUrls.map((url, index) => ({
        id: `${product.id}-image-${index}`,
        url,
        altText: product.title,
        width: 1200,
        height: 1200,
      })),
    },
    priceRange: {
      minVariantPrice: {
        amount: Number(product.price ?? 0).toFixed(2),
        currencyCode: DEFAULT_CURRENCY,
      },
    },
    compareAtPrice: product.compareAtPrice
      ? {
          amount: Number(product.compareAtPrice).toFixed(2),
          currencyCode: DEFAULT_CURRENCY,
        }
      : null,
  };
}

async function getVirtualCollectionProducts(handle: string, cursor?: string) {
  const skip = parseCursor(cursor);
  const where =
    handle === "hot-deals"
      ? {
          status: "ACTIVE",
          compareAtPrice: {
            not: null,
          },
        }
      : {
          status: "ACTIVE",
        };

  const orderBy =
    handle === "best-sellers"
      ? [{ isFeatured: "desc" as const }, { price: "desc" as const }]
      : handle === "hot-deals"
        ? [{ updatedAt: "desc" as const }]
        : [{ updatedAt: "desc" as const }];

  const [totalCount, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      skip,
      take: DEFAULT_PAGE_SIZE,
      orderBy,
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
    }),
  ]);

  return toConnection(
    products.map((product) => toProductCardNode(product)),
    skip,
    totalCount,
  );
}

export async function getCollection(handle: string) {
  const collection = await getCollectionFromDb(handle);
  if (!collection && handle in virtualCollections) {
    return virtualCollections[handle as keyof typeof virtualCollections];
  }
  invariant(collection, "Collection not found");
  return collection;
}

export async function getCollectionProducts(handle: string, cursor?: string) {
  const products = await getCollectionProductsFromDb(handle, cursor);
  if (!products && handle in virtualCollections) {
    return getVirtualCollectionProducts(handle, cursor);
  }
  invariant(products, "Products not found");
  return products;
}


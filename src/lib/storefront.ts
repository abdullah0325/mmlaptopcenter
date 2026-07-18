import { prisma } from "@/lib/prisma";
import { getSitePage } from "@/lib/site-settings";
import type { Prisma } from "@prisma/client";

const DEFAULT_CURRENCY = "PKR";
const DEFAULT_PAGE_SIZE = 12;
const PLACEHOLDER_IMAGE = "/logo/mmlaptop.png";

type MoneyV2 = {
  amount: string;
  currencyCode: string;
};

type StorefrontImage = {
  id: string;
  url: string;
  altText: string | null;
  width: number;
  height: number;
};

type ProductCardNode = {
  id: string;
  handle: string;
  title: string;
  tags?: string[];
  featuredImage: StorefrontImage | null;
  images: {
    nodes: StorefrontImage[];
  };
  priceRange: {
    minVariantPrice: MoneyV2;
  };
  compareAtPrice?: MoneyV2 | null;
};

type ProductNode = {
  id: string;
  handle: string;
  title: string;
  description: string | null;
  descriptionHtml: string | null;
  seo: {
    title: string;
    description: string;
  };
  priceRange: {
    minVariantPrice: MoneyV2;
  };
  featuredImage: StorefrontImage | null;
  images: {
    nodes: StorefrontImage[];
  };
  options: {
    id?: string;
    name: string;
    values: string[];
  }[];
  variants: {
    nodes: {
      id: string;
      availableForSale: boolean;
      price: MoneyV2;
      compareAtPrice: MoneyV2 | null;
      selectedOptions: {
        name: string;
        value: string;
      }[];
      image: {
        id: string;
      } | null;
      sku?: string | null;
      name?: string;
      description?: string | null;
      stock?: number;
      images?: StorefrontImage[];
      specifications?: Record<string, string>;
    }[];
  };
  vendor: string;
  productType: string | null;
  tags: string[];
  categoryId: string | null;
  metafields: Array<{ key: string; value: string }>;
  recommendations: ProductCardNode[];
};

type CollectionNode = {
  id: string;
  handle: string;
  title: string;
  description: string | null;
  descriptionHtml?: string | null;
  seo?: {
    title: string;
    description: string;
  };
  image: StorefrontImage | null;
};

type Connection<T> = {
  pageInfo: {
    hasNextPage: boolean;
  };
  edges: Array<{
    cursor: string;
    node: T;
  }>;
};

function parseStringArray(value: Prisma.JsonValue | null | undefined): string[] {
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return parseStringArray(parsed as Prisma.JsonValue);
    } catch {
      return value.trim() ? [value] : [];
    }
  }

  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  return [];
}

function uniqueStrings(values: Array<string | null | undefined>): string[] {
  return values.filter((value, index, all): value is string => {
    return typeof value === "string" && value.trim().length > 0 && all.indexOf(value) === index;
  });
}

function toMoney(amount: number | null | undefined): MoneyV2 {
  return {
    amount: Number(amount ?? 0).toFixed(2),
    currencyCode: DEFAULT_CURRENCY,
  };
}

function toImage(url: string | null | undefined, fallbackId: string): StorefrontImage | null {
  if (!url) {
    return null;
  }

  return {
    id: fallbackId,
    url,
    altText: null,
    width: 1200,
    height: 1200,
  };
}

function buildProductCardNode(product: {
  id: string;
  handle: string;
  title: string;
  price: number;
  compareAtPrice?: number | null;
  featuredImage: string | null;
  images: Prisma.JsonValue;
  tags: Prisma.JsonValue;
}): ProductCardNode {
  const imageUrls = uniqueStrings([product.featuredImage, ...parseStringArray(product.images)]);
  const images = imageUrls
    .map((url, index) => toImage(url, `${product.id}-image-${index}`))
    .filter((image): image is StorefrontImage => Boolean(image));
  const featuredImage = toImage(
    product.featuredImage ?? imageUrls[0] ?? PLACEHOLDER_IMAGE,
    `${product.id}-featured`,
  );

  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    tags: parseStringArray(product.tags),
    featuredImage,
    images: {
      nodes: images,
    },
    priceRange: {
      minVariantPrice: toMoney(product.price),
    },
    compareAtPrice: product.compareAtPrice ? toMoney(product.compareAtPrice) : null,
  };
}

async function buildRecommendations(
  product: {
    handle: string;
    categoryId: string | null;
  },
  limit = 4,
) {
  if (!product.categoryId) {
    return [];
  }

  const recommended = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
      availableForSale: true,
      categoryId: product.categoryId,
      handle: {
        not: product.handle,
      },
    },
    take: 12,
    orderBy: {
      updatedAt: "desc",
    },
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

  return recommended
    .slice(0, limit)
    .map((item) => buildProductCardNode(item));
}

async function buildProductNode(product: {
  id: string;
  handle: string;
  title: string;
  description: string | null;
  descriptionHtml: string | null;
  price: number;
  compareAtPrice: number | null;
  sku: string | null;
  inventory: number;
  availableForSale: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  images: Prisma.JsonValue;
  featuredImage: string | null;
  productType: string | null;
  vendor: string;
  tags: Prisma.JsonValue;
  collectionIds: Prisma.JsonValue;
  categoryId: string | null;
  variations: Array<{ id: string; name: string; description: string | null; price: number; compareAtPrice: number | null; sku: string | null; stock: number; images: Prisma.JsonValue; color: string | null; size: string | null; storage: string | null; ram: string | null; processor: string | null; condition: string | null; specifications: Prisma.JsonValue; active: boolean; isDefault: boolean }>;
}) {
  const imageUrls = uniqueStrings([product.featuredImage, ...parseStringArray(product.images)]);
  const images = imageUrls
    .map((url, index) => toImage(url, `${product.id}-image-${index}`))
    .filter((image): image is StorefrontImage => Boolean(image));

  const fallbackImage = toImage(PLACEHOLDER_IMAGE, `${product.id}-featured`);
  if (fallbackImage && !images.length) {
    images.push(fallbackImage);
  }
  const activeVariations = product.variations.filter((variant) => variant.active);
  const variantOptions = [
    { name: "Color", values: activeVariations.map((variant) => variant.color) },
    { name: "Price", values: activeVariations.map((variant) => String(variant.price)) },
    { name: "Size", values: activeVariations.map((variant) => variant.size) },
    { name: "Storage", values: activeVariations.map((variant) => variant.storage) },
    { name: "Condition", values: activeVariations.map((variant) => variant.condition) },
  ].map((option) => ({ ...option, values: [...new Set(option.values.filter((value): value is string => Boolean(value)))] })).filter((option) => option.values.length);

  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    description: product.description,
    descriptionHtml: product.descriptionHtml,
    seo: {
      title: product.seoTitle ?? product.title,
      description: product.seoDescription ?? product.description ?? product.title,
    },
    priceRange: {
      minVariantPrice: toMoney(product.price),
    },
    featuredImage:
      toImage(
        product.featuredImage ?? images[0]?.url ?? null,
        `${product.id}-featured`,
      ) ?? null,
    images: {
      nodes: images,
    },
    options: variantOptions,
    variants: {
      nodes: [
        {
          id: product.id,
          availableForSale: product.availableForSale && product.inventory > 0,
          price: toMoney(product.price),
          compareAtPrice: product.compareAtPrice ? toMoney(product.compareAtPrice) : null,
          selectedOptions: [],
          image: images[0] ? { id: images[0].id } : null,
          sku: product.sku,
          name: product.title,
          description: product.description,
          stock: product.inventory,
          images,
          specifications: {},
        },
        ...activeVariations.map((variant) => {
        const variantImages = parseStringArray(variant.images).map((url, index) => toImage(url, `${variant.id}-image-${index}`)).filter((image): image is StorefrontImage => Boolean(image));
        const variantImage = variantImages[0];
        return {
          id: variant.id,
          availableForSale: variant.active && variant.stock > 0,
          price: toMoney(variant.price),
          compareAtPrice: variant.compareAtPrice ? toMoney(variant.compareAtPrice) : null,
          selectedOptions: [
            ["Color", variant.color], ["Price", String(variant.price)], ["Size", variant.size], ["Storage", variant.storage], ["Condition", variant.condition],
          ].filter((item): item is [string, string] => Boolean(item[1])).map(([name, value]) => ({ name, value })),
          image: variantImage ? { id: variantImage.id } : images[0] ? { id: images[0].id } : null,
          sku: variant.sku,
          name: variant.name,
          description: variant.description,
          stock: variant.stock,
          images: variantImages,
          specifications: variant.specifications && typeof variant.specifications === "object" && !Array.isArray(variant.specifications) ? variant.specifications as Record<string, string> : {},
        };
        }),
      ],
    },
    vendor: product.vendor,
    productType: product.productType,
    tags: parseStringArray(product.tags),
    categoryId: product.categoryId,
    metafields: [
      { key: "vendor", value: product.vendor },
      { key: "sku", value: product.sku ?? "N/A" },
      { key: "inventory", value: String(product.inventory) },
      { key: "productType", value: product.productType ?? "General" },
    ],
    recommendations: await buildRecommendations(product),
  } satisfies ProductNode;
}

function buildCollectionNode(collection: {
  id: string;
  handle: string;
  title: string;
  description: string | null;
  descriptionHtml: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  image: string | null;
}): CollectionNode {
  return {
    id: collection.id,
    handle: collection.handle,
    title: collection.title,
    description: collection.description,
    descriptionHtml: collection.descriptionHtml,
    seo: {
      title: collection.seoTitle ?? collection.title,
      description:
        collection.seoDescription ?? collection.description ?? collection.title,
    },
    image: toImage(collection.image, `${collection.id}-image`),
  };
}

function toConnection<T>(items: T[], skip: number, totalCount: number): Connection<T> {
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

function parseCursor(cursor?: string | null) {
  const parsed = Number(cursor ?? 0);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

export async function getProduct(handle: string) {
  const product = await prisma.product.findUnique({
    where: { handle },
    select: {
      id: true,
      handle: true,
      title: true,
      description: true,
      descriptionHtml: true,
      price: true,
      compareAtPrice: true,
      sku: true,
      inventory: true,
      availableForSale: true,
      seoTitle: true,
      seoDescription: true,
      images: true,
      featuredImage: true,
      productType: true,
      vendor: true,
      tags: true,
      collectionIds: true,
      categoryId: true,
      status: true,
      variations: { orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }] },
    },
  });

  if (!product || product.status !== "ACTIVE") {
    return null;
  }

  return buildProductNode(product);
}

export async function getAllProducts(cursor?: string, take = DEFAULT_PAGE_SIZE) {
  const skip = parseCursor(cursor);
  const where = {
    status: "ACTIVE",
  } as const;

  const [totalCount, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      skip,
      take,
      orderBy: [{ displayOrder: "asc" }, { updatedAt: "desc" }],
      select: {
        id: true,
        handle: true,
        title: true,
        price: true,
        featuredImage: true,
        images: true,
        tags: true,
      },
    }),
  ]);

  return toConnection(
    products.map((product) => buildProductCardNode(product)),
    skip,
    totalCount,
  );
}

export async function getCollection(handle: string) {
  const collection = await prisma.collection.findUnique({
    where: { handle },
    select: {
      id: true,
      handle: true,
      title: true,
      description: true,
      descriptionHtml: true,
      seoTitle: true,
      seoDescription: true,
      image: true,
      productHandles: true,
    },
  });

  if (!collection) {
    return null;
  }

  return buildCollectionNode(collection);
}

export async function getAllCollections(cursor?: string, take = DEFAULT_PAGE_SIZE) {
  const skip = parseCursor(cursor);
  const [totalCount, collections] = await Promise.all([
    prisma.collection.count(),
    prisma.collection.findMany({
      skip,
      take,
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        handle: true,
        title: true,
        description: true,
        descriptionHtml: true,
        seoTitle: true,
        seoDescription: true,
        image: true,
      },
    }),
  ]);

  return toConnection(
    collections.map((collection) => buildCollectionNode(collection)),
    skip,
    totalCount,
  );
}

export async function getCollectionProducts(
  handle: string,
  cursor?: string,
  take = DEFAULT_PAGE_SIZE,
) {
  const collection = await prisma.collection.findUnique({
    where: { handle },
    select: {
      productHandles: true,
    },
  });

  if (!collection) {
    return null;
  }

  const productHandles = parseStringArray(collection.productHandles);
  const skip = parseCursor(cursor);
  const pagedHandles = productHandles.slice(skip, skip + take);

  const products = await prisma.product.findMany({
    where: {
      handle: {
        in: pagedHandles,
      },
      status: "ACTIVE",
    },
    select: {
      id: true,
      handle: true,
      title: true,
      description: true,
      price: true,
      compareAtPrice: true,
      featuredImage: true,
      images: true,
      tags: true,
    },
  });

  const orderedProducts = pagedHandles
    .map((productHandle) => products.find((product) => product.handle === productHandle))
    .filter((product): product is (typeof products)[number] => Boolean(product))
    .map((product) => buildProductCardNode(product));

  return toConnection(orderedProducts, skip, productHandles.length);
}

export async function searchProducts(query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return [];
  }

  const products = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
      OR: [
        { title: { contains: normalizedQuery, mode: "insensitive" } },
        { description: { contains: normalizedQuery, mode: "insensitive" } },
        { seoTitle: { contains: normalizedQuery, mode: "insensitive" } },
        { seoDescription: { contains: normalizedQuery, mode: "insensitive" } },
      ],
    },
    take: 20,
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      handle: true,
      title: true,
      description: true,
      price: true,
      featuredImage: true,
      images: true,
      tags: true,
    },
  });

  return products
    .filter((product) => {
      const tags = parseStringArray(product.tags);
      return (
        product.title.toLowerCase().includes(normalizedQuery) ||
        (product.description ?? "").toLowerCase().includes(normalizedQuery) ||
        tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
      );
    })
    .slice(0, 10)
    .map((product) => buildProductCardNode(product));
}

export async function getPage(handle: string) {
  return getSitePage(handle);
}

export const storefront = {
  query: async () => {
    throw new Error("Legacy storefront queries have been removed.");
  },
  mutation: async () => {
    throw new Error("Legacy storefront mutations have been removed.");
  },
};

import type { Prisma } from "@prisma/client";

const CURRENCY = "PKR";
const DEFAULT_BRAND = "MM Laptop Center";
const MAX_ADDITIONAL_IMAGES = 10;

type CatalogVariant = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  sku: string | null;
  stock: number;
  images: Prisma.JsonValue;
  color: string | null;
  size: string | null;
  storage: string | null;
  ram: string | null;
  processor: string | null;
  condition: string | null;
  specifications: Prisma.JsonValue;
  customAttributes: Prisma.JsonValue;
  active: boolean;
  isDefault: boolean;
};

export type MetaCatalogProduct = {
  id: string;
  handle: string;
  title: string;
  description: string | null;
  descriptionHtml: string | null;
  price: number;
  compareAtPrice: number | null;
  sku: string | null;
  inventory: number;
  images: Prisma.JsonValue;
  featuredImage: string | null;
  productType: string | null;
  categoryId: string | null;
  subcategoryId: string | null;
  vendor: string;
  tags: Prisma.JsonValue;
  color: string | null;
  size: string | null;
  storage: string | null;
  ram: string | null;
  processor: string | null;
  condition: string | null;
  specifications: Prisma.JsonValue;
  customAttributes: Prisma.JsonValue;
  variations: CatalogVariant[];
};

function asStringArray(value: Prisma.JsonValue | null | undefined): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function asRecord(value: Prisma.JsonValue | null | undefined): Record<string, string> {
  if (!value || Array.isArray(value) || typeof value !== "object") return {};
  return Object.fromEntries(
    Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === "string"),
  );
}

function firstValue(record: Record<string, string>, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = record[key] ?? record[key.toLowerCase()] ?? record[key.toUpperCase()];
    if (value?.trim()) return value.trim();
  }
}

function stripHtml(value: string): string {
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function escapeXml(value: unknown): string {
  return String(value ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function absoluteUrl(value: string, baseUrl: string): string | null {
  try {
    const url = new URL(value, `${baseUrl}/`);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function normalizeCondition(value: string | null | undefined): "new" | "used" | "refurbished" {
  const condition = value?.toLowerCase() ?? "";
  if (condition.includes("refurb")) return "refurbished";
  if (condition.includes("used") || condition.includes("pre-owned") || condition.includes("preowned")) return "used";
  return "new";
}

function xmlField(name: string, value: unknown): string {
  return `      <g:${name}>${escapeXml(value)}</g:${name}>`;
}

function chooseVariant(product: MetaCatalogProduct): CatalogVariant | null {
  const inStock = product.variations.filter((variant) => variant.active && variant.stock > 0);
  return inStock.find((variant) => variant.isDefault) ?? inStock[0] ?? null;
}

function formatPrice(value: number): string {
  return `${value.toFixed(2)} ${CURRENCY}`;
}

export function buildMetaCatalogXml(
  products: MetaCatalogProduct[],
  baseUrl: string,
  categories: ReadonlyMap<string, string>,
): string {
  const items = products.map((product) => {
    const variant = chooseVariant(product);
    const currentPrice = variant?.price ?? product.price;
    const compareAtPrice = variant?.compareAtPrice ?? product.compareAtPrice;
    const hasSale = typeof compareAtPrice === "number" && compareAtPrice > currentPrice;
    const custom = { ...asRecord(product.customAttributes), ...asRecord(variant?.customAttributes) };
    const specifications = { ...asRecord(product.specifications), ...asRecord(variant?.specifications) };
    const rawImages = [
      ...(variant ? asStringArray(variant.images) : []),
      product.featuredImage,
      ...asStringArray(product.images),
    ].filter((image): image is string => Boolean(image));
    const images = [...new Set(rawImages.map((image) => absoluteUrl(image, baseUrl)).filter((image): image is string => Boolean(image)))];
    if (!Number.isFinite(currentPrice) || currentPrice <= 0 || images.length === 0) return null;
    const productUrl = new URL(`/products/${encodeURIComponent(product.handle)}`, `${baseUrl}/`).toString();
    const category = product.subcategoryId
      ? categories.get(product.subcategoryId) ?? categories.get(product.categoryId ?? "")
      : categories.get(product.categoryId ?? "");
    const description = stripHtml(
      variant?.description ?? product.description ?? product.descriptionHtml ?? product.title,
    ).slice(0, 9999);
    const title = variant ? `${product.title} - ${variant.name}` : product.title;
    const fields = [
      xmlField("id", product.id),
      xmlField("title", title.slice(0, 150)),
      xmlField("description", description),
      xmlField("availability", "in stock"),
      xmlField("condition", normalizeCondition(variant?.condition ?? product.condition)),
      xmlField("price", formatPrice(hasSale ? compareAtPrice : currentPrice)),
      ...(hasSale ? [xmlField("sale_price", formatPrice(currentPrice))] : []),
      xmlField("brand", product.vendor.trim() || DEFAULT_BRAND),
      xmlField("link", productUrl),
      xmlField("image_link", images[0]),
      ...images.slice(1, MAX_ADDITIONAL_IMAGES + 1).map((image) => xmlField("additional_image_link", image)),
      ...(product.productType || category ? [xmlField("product_type", product.productType ?? category)] : []),
      ...(variant?.sku || product.sku ? [xmlField("sku", variant?.sku ?? product.sku)] : []),
      ...(variant?.color || product.color ? [xmlField("color", variant?.color ?? product.color)] : []),
      ...(variant?.size || product.size ? [xmlField("size", variant?.size ?? product.size)] : []),
      ...(firstValue(custom, ["gtin", "upc", "ean", "isbn"]) ? [xmlField("gtin", firstValue(custom, ["gtin", "upc", "ean", "isbn"]))] : []),
      ...(firstValue(custom, ["mpn"]) ? [xmlField("mpn", firstValue(custom, ["mpn"]))] : []),
      ...(firstValue(custom, ["google_product_category"]) ? [xmlField("google_product_category", firstValue(custom, ["google_product_category"]))] : []),
      ...(firstValue(custom, ["age_group"]) ? [xmlField("age_group", firstValue(custom, ["age_group"]))] : []),
      ...(firstValue(custom, ["gender"]) ? [xmlField("gender", firstValue(custom, ["gender"]))] : []),
      ...(firstValue(custom, ["material"]) ? [xmlField("material", firstValue(custom, ["material"]))] : []),
      ...(firstValue(custom, ["pattern"]) ? [xmlField("pattern", firstValue(custom, ["pattern"]))] : []),
      ...(asStringArray(product.tags).length > 0
        ? [xmlField("custom_label_0", asStringArray(product.tags).slice(0, 5).join(", "))]
        : []),
      ...(variant?.storage || product.storage ? [xmlField("custom_label_1", `Storage: ${variant?.storage ?? product.storage}`)] : []),
      ...(variant?.ram || product.ram ? [xmlField("custom_label_2", `RAM: ${variant?.ram ?? product.ram}`)] : []),
      ...(variant?.processor || product.processor ? [xmlField("custom_label_3", `Processor: ${variant?.processor ?? product.processor}`)] : []),
      ...(firstValue(specifications, ["model", "Model"]) ? [xmlField("custom_label_4", firstValue(specifications, ["model", "Model"]))] : []),
    ];
    return `    <item>\n${fields.join("\n")}\n    </item>`;
  }).filter((item): item is string => item !== null);

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>MM Laptop Center Product Catalog</title>
    <link>${escapeXml(baseUrl)}</link>
    <description>Live product catalog for MM Laptop Center</description>
${items.join("\n")}
  </channel>
</rss>`;
}

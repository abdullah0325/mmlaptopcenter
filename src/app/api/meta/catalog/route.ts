import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { buildMetaCatalogXml } from "@/lib/meta-catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getBaseUrl(request: Request): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const candidate = configured || new URL(request.url).origin;
  const url = new URL(candidate);
  if (url.protocol !== "https:" && url.hostname !== "localhost") {
    throw new Error("NEXT_PUBLIC_SITE_URL must use HTTPS in production");
  }
  return url.origin;
}

export async function GET(request: Request) {
  try {
    const products = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
        availableForSale: true,
        price: { gt: 0 },
        AND: [
          {
            OR: [
              { inventory: { gt: 0 } },
              { variations: { some: { active: true, stock: { gt: 0 } } } },
            ],
          },
          {
            OR: [
              { featuredImage: { not: null } },
              { NOT: { images: { equals: [] } } },
              {
                variations: {
                  some: {
                    active: true,
                    stock: { gt: 0 },
                    NOT: { images: { equals: [] } },
                  },
                },
              },
            ],
          },
        ],
      },
      orderBy: [{ displayOrder: "asc" }, { updatedAt: "desc" }],
      select: {
        id: true, handle: true, title: true, description: true, descriptionHtml: true,
        price: true, compareAtPrice: true, sku: true, inventory: true, images: true,
        featuredImage: true, productType: true, categoryId: true, subcategoryId: true,
        vendor: true, tags: true, color: true, size: true, storage: true, ram: true,
        processor: true, condition: true, specifications: true, customAttributes: true,
        variations: {
          where: { active: true, stock: { gt: 0 } },
          orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
          select: {
            id: true, name: true, description: true, price: true, compareAtPrice: true,
            sku: true, stock: true, images: true, color: true, size: true, storage: true,
            ram: true, processor: true, condition: true, specifications: true,
            customAttributes: true, active: true, isDefault: true,
          },
        },
      },
    });

    const categoryIds = [...new Set(products.flatMap((product) => [product.categoryId, product.subcategoryId]).filter((id): id is string => Boolean(id)))];
    const categories = categoryIds.length
      ? await prisma.category.findMany({ where: { id: { in: categoryIds } }, select: { id: true, name: true } })
      : [];
    const xml = buildMetaCatalogXml(products, getBaseUrl(request), new Map(categories.map((category) => [category.id, category.name])));
    const etag = `"${createHash("sha256").update(xml).digest("base64url")}"`;

    if (request.headers.get("if-none-match") === etag) {
      return new Response(null, { status: 304, headers: { ETag: etag, "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=3600" } });
    }

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Content-Disposition": 'inline; filename="meta-catalog.xml"',
        "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=3600",
        ETag: etag,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Failed to generate Meta catalog feed:", error);
    return new Response("Catalog feed is temporarily unavailable.", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
  }
}

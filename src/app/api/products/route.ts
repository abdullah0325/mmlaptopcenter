import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = (searchParams.get("search") || "").trim();
    const categoryId = (searchParams.get("category") || "").trim();
    const tag = (searchParams.get("tag") || "").trim();

    const products = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
        ...(categoryId ? { OR: [{ categoryId }, { subcategoryId: categoryId }] } : {}),
      },
      orderBy: [{ displayOrder: "asc" }, { updatedAt: "desc" }],
      take: 50,
      select: {
        id: true,
        handle: true,
        title: true,
        price: true,
        featuredImage: true,
        images: true,
        categoryId: true,
        subcategoryId: true,
        tags: true,
      },
    });

    const normalized = products
      .map((product) => {
        const tags = Array.isArray(product.tags)
          ? (product.tags as unknown[]).filter((x): x is string => typeof x === "string")
          : [];
        const firstImage = Array.isArray(product.images)
          ? ((product.images as unknown[]).find((x): x is string => typeof x === "string") ?? null)
          : null;
        return {
          ...product,
          tags,
          image: product.featuredImage || firstImage,
        };
      })
      .filter((product) => (tag ? product.tags.some((t) => t.toLowerCase().includes(tag.toLowerCase())) : true));

    return NextResponse.json({ products: normalized });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message || "Failed to fetch products" }, { status: 500 });
  }
}


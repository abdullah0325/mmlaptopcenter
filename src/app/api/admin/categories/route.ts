import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  image: z.string().min(1, "Category image is required"),
  parentId: z.string().optional(),
  order: z.number().int().default(0),
  featured: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  productIds: z.array(z.string()).default([]),
});

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const categories = await prisma.category.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ categories });
  } catch (error: unknown) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to fetch categories" },
      { status: 401 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const validated = categorySchema.parse(body);
    const category = await prisma.category.upsert({
      where: { slug: validated.slug },
      update: validated,
      create: validated,
    });
    return NextResponse.json({ category }, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating category:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    const err = error as { code?: string };
    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "A category with this name or slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: (error as Error).message || "Failed to create category" },
      { status: 500 }
    );
  }
}
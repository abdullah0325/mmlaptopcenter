import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";

const blogSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  featuredImage: z.string().optional(),
  categoryId: z.string().optional(),
  author: z.string().default("Admin"),
  status: z.string().default("draft"),
  publishedAt: z.union([z.string(), z.date()]).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  tags: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
});

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "";
    const where: any = {};
    if (status) where.status = status;
    const posts = await prisma.blogPost.findMany({ where, orderBy: { createdAt: "desc" } });
    return NextResponse.json({ blogs: posts });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
    return NextResponse.json({ error: (error as Error).message }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const validated = blogSchema.parse(body);
    if (validated.publishedAt) validated.publishedAt = new Date(validated.publishedAt);
    const post = await prisma.blogPost.create({ data: validated });
    return NextResponse.json({ blog: post }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
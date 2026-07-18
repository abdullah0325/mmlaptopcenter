import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";

const reviewSchema = z.object({
  authorName: z.string().min(1),
  authorEmail: z.string().email().optional().or(z.literal("")),
  authorImage: z.string().optional(),
  rating: z.number().min(1).max(5).default(5),
  content: z.string().min(1),
  productId: z.string().optional(),
  productHandle: z.string().optional(),
  isFeatured: z.boolean().default(false),
  status: z.enum(["pending", "approved", "rejected"]).default("pending"),
  isVerifiedPurchase: z.boolean().default(false),
  adminNote: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const isFeatured = searchParams.get("isFeatured");
    const productHandle = searchParams.get("productHandle");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: any = {};
    if (status) where.status = status;
    if (isFeatured !== null) where.isFeatured = isFeatured === "true";
    if (productHandle) where.productHandle = productHandle;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          authorName: true,
          authorEmail: true,
          authorImage: true,
          rating: true,
          content: true,
          productId: true,
          productHandle: true,
          isFeatured: true,
          status: true,
          isVerifiedPurchase: true,
          helpfulCount: true,
          images: true,
          adminNote: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.review.count({ where }),
    ]);

    // Get summary statistics using raw query
    const stats = await prisma.$queryRaw`
      SELECT status, COUNT(*) as count 
      FROM "Review" 
      GROUP BY status
    ` as any[];

    const statusCounts: Record<string, number> = {
      pending: 0,
      approved: 0,
      rejected: 0,
    };
    stats.forEach((s) => {
      statusCounts[s.status] = parseInt(s.count) || 0;
    });

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      statistics: statusCounts,
    });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const validated = reviewSchema.parse(body);
    const review = await prisma.review.create({ data: validated });
    return NextResponse.json({ review }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const submitReviewSchema = z.object({
  authorName: z.string().min(1, "Name is required"),
  authorEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  rating: z.number().min(1).max(5, "Rating must be between 1 and 5"),
  content: z.string().min(10, "Review must be at least 10 characters"),
  productId: z.string().optional(),
  productHandle: z.string().optional(),
  images: z.array(z.string()).optional(),
});

// GET reviews for a specific product (only approved reviews)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productHandle = searchParams.get("productHandle");
    const sortBy = searchParams.get("sortBy") || "newest"; // newest, highest, lowest
    const limit = parseInt(searchParams.get("limit") || "50");

    if (!productHandle) {
      return NextResponse.json({ error: "Product handle is required" }, { status: 400 });
    }

    // Build sort order
    let orderBy: any = { createdAt: "desc" };
    if (sortBy === "highest") {
      orderBy = { rating: "desc" };
    } else if (sortBy === "lowest") {
      orderBy = { rating: "asc" };
    }

    const reviews = await prisma.review.findMany({
      where: {
        productHandle,
        status: "approved",
      },
      orderBy,
      take: limit,
      select: {
        id: true,
        authorName: true,
        authorImage: true,
        rating: true,
        content: true,
        isVerifiedPurchase: true,
        helpfulCount: true,
        images: true,
        createdAt: true,
      },
    });

    // Get review statistics
    const stats = await prisma.review.aggregate({
      where: {
        productHandle,
        status: "approved",
      },
      _avg: { rating: true },
      _count: { id: true },
    });

    // Get rating distribution
    const ratingDistribution = await prisma.review.groupBy({
      by: ["rating"],
      where: {
        productHandle,
        status: "approved",
      },
      _count: { id: true },
    });

    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratingDistribution.forEach((r) => {
      if (r._count && typeof r._count === 'object' && 'id' in r._count) {
        distribution[r.rating] = (r._count as { id: number }).id;
      }
    });

    return NextResponse.json({
      reviews,
      statistics: {
        averageRating: stats._avg.rating || 0,
        totalReviews: stats._count.id,
        distribution,
      },
    });
  } catch (error: unknown) {
    console.error("Failed to fetch reviews:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// POST - Submit a new review
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = submitReviewSchema.parse(body);

    if (!validated.productId && !validated.productHandle) {
      return NextResponse.json(
        { error: "Product ID or handle is required" },
        { status: 400 }
      );
    }

    // Check if user already reviewed this product (by email if provided)
    if (validated.authorEmail) {
      const existingReview = await prisma.review.findFirst({
        where: {
          productHandle: validated.productHandle,
          authorEmail: validated.authorEmail,
          status: { in: ["approved", "pending"] },
        },
      });

      if (existingReview) {
        return NextResponse.json(
          { error: "You have already submitted a review for this product" },
          { status: 400 }
        );
      }
    }

    const review = await prisma.review.create({
      data: {
        authorName: validated.authorName,
        authorEmail: validated.authorEmail,
        rating: validated.rating,
        content: validated.content,
        productId: validated.productId,
        productHandle: validated.productHandle,
        images: validated.images || [],
        status: "pending", // Requires admin approval
        isFeatured: false,
        isVerifiedPurchase: false,
      },
    });

    return NextResponse.json(
      { 
        review, 
        message: "Your review has been submitted and is awaiting approval" 
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Failed to submit review:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
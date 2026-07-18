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

const reviewPartialSchema = reviewSchema.partial();

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const review = await prisma.review.findUnique({ 
      where: { id },
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
      }
    });
    if (!review) return NextResponse.json({ error: "Review not found" }, { status: 404 });
    return NextResponse.json(review);
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 401 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const validated = reviewPartialSchema.parse(body);
    
    // Check if review exists
    const existingReview = await prisma.review.findUnique({ where: { id } });
    if (!existingReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }
    
    const review = await prisma.review.update({ 
      where: { id }, 
      data: validated 
    });
    return NextResponse.json(review);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";

const detailSchema = z.object({
  id: z.string().optional(), // For updates
  title: z.string().min(1, "Detail title is required"),
  description: z.string().optional(),
  image: z.string().optional(),
  videoUrl: z.string().optional(),
});

// GET /api/admin/products/[id]/details - Get all details for a product
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      select: { details: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ details: product.details });
  } catch (error: any) {
    console.error("Error fetching details:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch details" },
      { status: 401 }
    );
  }
}

// POST /api/admin/products/[id]/details - Create or update details for a product
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const { details } = body;

    if (!Array.isArray(details)) {
      return NextResponse.json(
        { error: "Details must be an array" },
        { status: 400 }
      );
    }

    // Validate each detail
    const validatedDetails = details.map((d: any) => detailSchema.parse(d));

    // Update the product with new details
    const product = await prisma.product.update({
      where: { id },
      data: { details: validatedDetails },
    });

    return NextResponse.json({ details: product.details });
  } catch (error: unknown) {
    console.error("Error saving details:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: (error as Error).message || "Failed to save details" },
      { status: 500 }
    );
  }
}

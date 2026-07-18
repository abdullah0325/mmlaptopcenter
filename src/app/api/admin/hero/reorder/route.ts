import { NextRequest, NextResponse } from "next/server";
import { reorderHeroSlides } from "@/lib/hero-service";
import { requireAdmin } from "@/lib/admin-auth";
import { z } from "zod";

const reorderSchema = z.object({
  orderedIds: z.array(z.string()),
});

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { orderedIds } = reorderSchema.parse(body);
    const slides = await reorderHeroSlides(orderedIds);
    return NextResponse.json({ slides });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
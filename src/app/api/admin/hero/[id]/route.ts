import { NextRequest, NextResponse } from "next/server";
import {
  getAllHeroSlides,
  updateHeroSlide,
  deleteHeroSlide,
} from "@/lib/hero-service";
import { requireAdmin } from "@/lib/admin-auth";
import { z } from "zod";

const updateHeroSlideSchema = z.object({
  imageUrl: z.string().optional(),
  mobileImageUrl: z.string().optional(),
  imageAlt: z.string().optional(),
  eyebrow: z.string().optional(),
  title: z.string().optional(),
  titleHighlight: z.string().optional(),
  description: z.string().optional(),
  ctaPrimaryLabel: z.string().optional(),
  ctaPrimaryHref: z.string().optional(),
  ctaSecondaryLabel: z.string().optional(),
  ctaSecondaryHref: z.string().optional(),
  isActive: z.boolean().optional(),
  order: z.number().optional(),
});

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    const slides = await getAllHeroSlides();
    const slide = slides.find((s) => s.id === id);
    if (!slide) {
      return NextResponse.json({ error: "Slide not found" }, { status: 404 });
    }
    return NextResponse.json({ slide });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 401 },
    );
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const validated = updateHeroSlideSchema.parse(body);
    const slide = await updateHeroSlide(id, validated);
    if (!slide) {
      const allSlides = await getAllHeroSlides();
      console.error("Slide not found for update", { id, availableIds: allSlides.map(s => s.id), slideCount: allSlides.length });
      return NextResponse.json({ error: "Slide not found", availableIds: allSlides.map(s => s.id), slideCount: allSlides.length, requestedId: id }, { status: 404 });
    }
    return NextResponse.json({ slide });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 },
      );
    }
    console.error("PATCH error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    const success = await deleteHeroSlide(id);
    if (!success) {
      return NextResponse.json({ error: "Slide not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}

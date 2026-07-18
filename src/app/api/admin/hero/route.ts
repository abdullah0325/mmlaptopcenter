import { NextRequest, NextResponse } from "next/server";
import { getAllHeroSlides, createHeroSlide, getActiveHeroSlides } from "@/lib/hero-service";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";

const heroSlideSchema = z.object({
  imageUrl: z.string().min(1),
  mobileImageUrl: z.string().optional(),
  imageAlt: z.string().min(1),
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  titleHighlight: z.string().min(1),
  description: z.string().min(1),
  ctaPrimaryLabel: z.string().optional(),
  ctaPrimaryHref: z.string().optional(),
  ctaSecondaryLabel: z.string().optional(),
  ctaSecondaryHref: z.string().optional(),
  isActive: z.boolean().default(true),
});

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") !== "false";
    const slides = activeOnly ? await getActiveHeroSlides() : await getAllHeroSlides();
    return NextResponse.json({ slides });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 401 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const validated = heroSlideSchema.parse(body);
    const slide = await createHeroSlide(validated);
    return NextResponse.json({ slide }, { status: 201 });
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

import { NextResponse } from "next/server";
import { getActiveHeroSlides } from "@/lib/hero-service";

export async function GET() {
  try {
    const slides = await getActiveHeroSlides();
    return NextResponse.json({ slides });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch hero slides" },
      { status: 500 },
    );
  }
}
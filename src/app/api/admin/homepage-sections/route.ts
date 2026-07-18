import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";

const homepageSectionSchema = z.object({
  sectionKey: z.string().min(1),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  content: z.any().optional(),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
  image: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");
    const where: any = {};
    if (key) where.sectionKey = key;
    const sections = await prisma.homepageSection.findMany({
      where,
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ sections });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const validated = homepageSectionSchema.parse(body);
    const section = await prisma.homepageSection.upsert({
      where: { sectionKey: validated.sectionKey },
      update: validated,
      create: validated,
    });
    return NextResponse.json({ section });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
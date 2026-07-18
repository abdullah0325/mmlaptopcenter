import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { prepareVideoData, VIDEO_PLACEMENTS, VIDEO_PLATFORMS, VideoUrlError } from "@/lib/video-utils";
import { z } from "zod";

function optionalEnum<T extends readonly string[]>(value: string | null, allowed: T): T[number] | undefined {
  return value && allowed.includes(value) ? value as T[number] : undefined;
}

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();
    const platform = optionalEnum(searchParams.get("platform"), VIDEO_PLATFORMS);
    const placement = optionalEnum(searchParams.get("placement"), VIDEO_PLACEMENTS);
    const active = searchParams.get("active");
    const featured = searchParams.get("featured");

    const where: Prisma.VideoWhereInput = {};
    if (platform) where.platform = platform;
    if (placement) where.placement = placement;
    if (active === "true" || active === "false") where.active = active === "true";
    if (featured === "true" || featured === "false") where.featured = featured === "true";
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { videoUrl: { contains: q, mode: "insensitive" } },
        { buttonText: { contains: q, mode: "insensitive" } },
        { seoTitle: { contains: q, mode: "insensitive" } },
        { seoDescription: { contains: q, mode: "insensitive" } },
      ];
    }

    const videos = await prisma.video.findMany({
      where,
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ videos });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const data = await prepareVideoData(body);
    const video = await prisma.video.create({ data });
    return NextResponse.json({ video }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
    }
    if (error instanceof VideoUrlError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

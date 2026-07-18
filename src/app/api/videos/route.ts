import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeVideo, VIDEO_PLACEMENTS, VIDEO_PLATFORMS } from "@/lib/video-utils";

function optionalEnum<T extends readonly string[]>(value: string | null, allowed: T): T[number] | undefined {
  return value && allowed.includes(value) ? value as T[number] : undefined;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const platform = optionalEnum(searchParams.get("platform"), VIDEO_PLATFORMS);
  const placement = optionalEnum(searchParams.get("placement"), VIDEO_PLACEMENTS);
  const featured = searchParams.get("featured");

  const videos = await prisma.video.findMany({
    where: {
      active: true,
      ...(platform ? { platform } : {}),
      ...(placement ? { placement } : {}),
      ...(featured === "true" || featured === "false" ? { featured: featured === "true" } : {}),
    },
    orderBy: [{ featured: "desc" }, { displayOrder: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ videos: videos.map(serializeVideo) });
}

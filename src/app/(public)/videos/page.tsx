import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { serializeVideo } from "@/lib/video-utils";
import { VideosPageClient } from "@/components/features/videos/videos-page-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Videos | MM Laptop Center",
  description: "Watch MM Laptop Center product demos, tech guides, social videos, and shop updates.",
};

export default async function VideosPage() {
  const videos = await prisma.video.findMany({
    where: { active: true },
    orderBy: [{ featured: "desc" }, { displayOrder: "asc" }, { createdAt: "desc" }],
  });

  return <VideosPageClient videos={videos.map(serializeVideo)} />;
}

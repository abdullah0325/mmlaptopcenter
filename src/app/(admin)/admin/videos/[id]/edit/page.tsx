import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { VideoForm } from "../../_components/video-form";
import type { VideoFormValues } from "../../_components/types";

export const dynamic = "force-dynamic";

export default async function EditVideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const video = await prisma.video.findUnique({ where: { id } });
  if (!video) notFound();

  const initialValues: VideoFormValues = {
    title: video.title,
    description: video.description || "",
    thumbnail: video.thumbnail || "",
    videoUrl: video.videoUrl,
    platform: video.platform,
    placement: video.placement,
    format: video.format,
    buttonText: video.buttonText || "",
    buttonUrl: video.buttonUrl || "",
    featured: video.featured,
    active: video.active,
    displayOrder: video.displayOrder,
    seoTitle: video.seoTitle || "",
    seoDescription: video.seoDescription || "",
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/videos" className="text-sm font-semibold text-[#b57910] hover:text-[#8a5b08]">
          Back to videos
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-[#0a0a0a]">Edit Video</h1>
      </div>
      <VideoForm mode="edit" videoId={video.id} initialValues={initialValues} />
    </div>
  );
}

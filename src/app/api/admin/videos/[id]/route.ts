import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { deleteImage } from "@/lib/cloudinary";
import { prepareVideoData, VideoUrlError } from "@/lib/video-utils";
import { z } from "zod";

async function deleteThumbnailAsset(url: string | null) {
  if (!url) return;
  const asset = await prisma.mediaAsset.findFirst({ where: { url } });
  if (!asset) return;
  await deleteImage(asset.publicId).catch((error) => {
    console.warn(`Cloudinary thumbnail delete failed for ${asset.publicId}:`, error);
  });
  await prisma.mediaAsset.delete({ where: { id: asset.id } }).catch(() => null);
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const video = await prisma.video.findUnique({ where: { id } });
    if (!video) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(video);
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 401 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const data = await prepareVideoData(body);
    const video = await prisma.video.update({ where: { id }, data });
    return NextResponse.json(video);
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

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const video = await prisma.video.findUnique({ where: { id } });
    if (!video) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await deleteThumbnailAsset(video.thumbnail);
    await prisma.video.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

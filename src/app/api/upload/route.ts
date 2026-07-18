import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { deleteImage, uploadImage } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const formData = await request.formData();
    const file = formData.get("file");
    const folder = String(formData.get("folder") || "mmlaptop-center");
    const usedIn = String(formData.get("usedIn") || "general");
    const referenceId = String(formData.get("referenceId") || "");
    const alt = String(formData.get("alt") || "");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const result = await uploadImage(buffer, folder);

    const media = await prisma.mediaAsset.create({
      data: {
        filename: file.name,
        url: result.url,
        publicId: result.publicId,
        type: file.type || "image",
        size: result.bytes,
        alt: alt || null,
        usedIn,
        referenceId: referenceId || null,
      },
    });

    return NextResponse.json({
      secure_url: result.url,
      url: result.url,
      publicId: result.publicId,
      media,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message || "Upload failed" },
      { status: 500 },
    );
  }
}

function publicIdFromCloudinaryUrl(url: string) {
  try {
    const parsed = new URL(url);
    const uploadIndex = parsed.pathname.indexOf("/upload/");
    if (uploadIndex === -1) return null;

    const afterUpload = parsed.pathname.slice(uploadIndex + "/upload/".length);
    const parts = afterUpload.split("/").filter(Boolean);
    const versionIndex = parts.findIndex((part) => /^v\d+$/.test(part));
    const publicIdParts = versionIndex >= 0 ? parts.slice(versionIndex + 1) : parts;
    const publicId = publicIdParts.join("/").replace(/\.[^.]+$/, "");

    return publicId || null;
  } catch {
    return null;
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json().catch(() => ({}));
    const url = typeof body?.url === "string" ? body.url : "";
    const publicIdFromBody = typeof body?.publicId === "string" ? body.publicId : "";

    if (!url && !publicIdFromBody) {
      return NextResponse.json({ error: "Image URL or publicId is required" }, { status: 400 });
    }

    const media = url
      ? await prisma.mediaAsset.findFirst({ where: { url } })
      : null;
    const publicId = media?.publicId || publicIdFromBody || publicIdFromCloudinaryUrl(url);

    if (publicId) {
      await deleteImage(publicId);
    }

    if (url) {
      await prisma.mediaAsset.deleteMany({ where: { url } });
    } else if (publicId) {
      await prisma.mediaAsset.deleteMany({ where: { publicId } });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message || "Delete failed" },
      { status: 500 },
    );
  }
}


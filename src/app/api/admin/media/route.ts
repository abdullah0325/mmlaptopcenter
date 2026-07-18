import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { uploadImage } from "@/lib/cloudinary";

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const usedIn = searchParams.get("usedIn") || "";
    const where: any = {};
    if (usedIn) where.usedIn = usedIn;
    const media = await prisma.mediaAsset.findMany({ where, orderBy: { createdAt: "desc" } });
    return NextResponse.json({ media });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const formData = await request.formData();
    const file = formData.get("file");
    const usedIn = String(formData.get("usedIn") || "media");
    const alt = String(formData.get("alt") || "");
    const folder = String(formData.get("folder") || "mmlaptop/media");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploaded = await uploadImage(buffer, folder);

    const media = await prisma.mediaAsset.create({
      data: {
        filename: file.name,
        url: uploaded.url,
        publicId: uploaded.publicId,
        type: file.type || "image",
        size: uploaded.bytes,
        alt: alt || null,
        usedIn,
      },
    });

    return NextResponse.json({ media }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
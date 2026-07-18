import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { uploadImage } from "@/lib/cloudinary";
import { updateHeroSlide } from "@/lib/hero-service";

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const slideId = formData.get("slideId") as string | null;
    const imageField = formData.get("imageField") === "mobileImageUrl" ? "mobileImageUrl" : "imageUrl";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const result = await uploadImage(buffer, "hero");

    const url = result.url;
    const publicId = result.publicId;

    if (slideId) {
      await updateHeroSlide(slideId, {
        [imageField]: url,
      });
    }

    return NextResponse.json({ url, publicId });
  } catch (error: unknown) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to upload image" },
      { status: 500 },
    );
  }
}

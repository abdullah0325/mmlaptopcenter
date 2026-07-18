import Link from "next/link";
import { VideoForm } from "../_components/video-form";
import { emptyVideoFormValues } from "../_components/types";

export default function NewVideoPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/videos" className="text-sm font-semibold text-[#b57910] hover:text-[#8a5b08]">
          Back to videos
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-[#0a0a0a]">Add Video</h1>
      </div>
      <VideoForm mode="create" initialValues={emptyVideoFormValues} />
    </div>
  );
}

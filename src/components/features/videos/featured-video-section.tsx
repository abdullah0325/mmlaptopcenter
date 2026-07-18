"use client";

import Link from "next/link";
import { Video } from "@esmate/shadcn/pkgs/lucide-react";
import type { PublicVideo } from "@/lib/video-utils";
import { SharedVideoPlayer } from "./shared-video-player";

export function FeaturedVideoSection({
  videos,
  heading,
  description,
}: {
  videos: PublicVideo[];
  heading: string;
  description: string;
}) {
  if (!videos.length) return null;

  return (
    <section className="bg-white px-6 py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="max-w-3xl space-y-5">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#ffedd5] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#ea580c]">
            <Video className="h-4 w-4" />
            Featured Video
          </span>
          <h2 className="font-serif text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl lg:text-5xl">
            {heading}
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">{description}</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/videos" className="inline-flex items-center gap-2 rounded-full bg-[#1a1308] px-6 py-3 text-sm font-bold text-white hover:bg-[#2a2118]">
              View All Videos
            </Link>
          </div>
        </div>
        <SharedVideoPlayer videos={videos} />
      </div>
    </section>
  );
}

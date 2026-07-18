"use client";

import { useMemo, useState } from "react";
import { VIDEO_PLATFORM_LABELS, VIDEO_PLATFORMS, type PublicVideo, type VideoPlatformValue } from "@/lib/video-utils";
import { SharedVideoPlayer } from "./shared-video-player";

const PAGE_SIZE = 8;

const PLATFORM_STYLES: Record<VideoPlatformValue, { section: string; badge: string; title: string }> = {
  YOUTUBE: { section: "border-red-200 bg-gradient-to-br from-white to-red-50", badge: "bg-red-600 text-white", title: "text-red-700" },
  TIKTOK: { section: "border-gray-800 bg-gradient-to-br from-black via-gray-950 to-cyan-950", badge: "bg-white text-black shadow-[3px_3px_0_#25f4ee,-3px_-3px_0_#fe2c55]", title: "text-white" },
  FACEBOOK: { section: "border-blue-200 bg-gradient-to-br from-white to-blue-50", badge: "bg-blue-600 text-white", title: "text-blue-700" },
  INSTAGRAM: { section: "border-fuchsia-200 bg-gradient-to-br from-orange-50 via-white to-fuchsia-50", badge: "bg-gradient-to-r from-orange-500 via-pink-500 to-fuchsia-600 text-white", title: "text-fuchsia-700" },
};

function PlatformVideoSection({ platform, videos }: { platform: VideoPlatformValue; videos: PublicVideo[] }) {
  if (!videos.length) return null;
  const styles = PLATFORM_STYLES[platform];
  return (
    <section className={`min-w-0 overflow-hidden rounded-3xl border p-4 shadow-sm sm:p-6 ${styles.section}`}>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider ${styles.badge}`}>{VIDEO_PLATFORM_LABELS[platform]}</span>
        <h2 className={`font-serif text-2xl font-bold ${styles.title}`}>{VIDEO_PLATFORM_LABELS[platform]} Videos</h2>
      </div>
      <SharedVideoPlayer videos={videos} theme={platform} />
    </section>
  );
}

export function VideosPageClient({ videos }: { videos: PublicVideo[] }) {
  const [platform, setPlatform] = useState<VideoPlatformValue | "ALL">("ALL");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(
    () => (platform === "ALL" ? videos : videos.filter((video) => video.platform === platform)),
    [platform, videos],
  );

  const visibleVideos = filtered.slice(0, visible);
  const featuredVideos = filtered.filter((video) => video.featured).slice(0, 4);

  return (
    <main className="bg-gray-50 text-[#0a0a0a]">
      <section className="border-b border-[#d8a928]/25 bg-[#fcf5e8] px-6 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl space-y-5">
            <span className="inline-flex rounded-full bg-[#ffedd5] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#ea580c]">
              MM Laptop Center Videos
            </span>
            <h1 className="font-serif text-4xl font-extrabold tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
              Product demos, tech guides, and shop updates.
            </h1>
            <p className="text-base leading-relaxed text-gray-700 sm:text-lg">
              Watch our latest laptop showcases, buying guides, repairs, reels, and customer-focused videos across every platform.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-10 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setPlatform("ALL");
                setVisible(PAGE_SIZE);
              }}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${platform === "ALL" ? "bg-[#1a1308] text-white" : "bg-white text-gray-700 hover:bg-[#fcf5e8]"}`}
            >
              All
            </button>
            {VIDEO_PLATFORMS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setPlatform(item);
                  setVisible(PAGE_SIZE);
                }}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${platform === item ? "bg-[#1a1308] text-white" : "bg-white text-gray-700 hover:bg-[#fcf5e8]"}`}
              >
                {VIDEO_PLATFORM_LABELS[item]}
              </button>
            ))}
          </div>

          {featuredVideos.length ? (
            <section className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-gray-950">Featured Videos</h2>
              <SharedVideoPlayer videos={featuredVideos} theme={platform === "ALL" ? "DEFAULT" : platform} />
            </section>
          ) : null}

          {platform === "ALL" ? (
            <div className="space-y-10">
              {VIDEO_PLATFORMS.map((item) => {
                const platformVideos = videos.filter((video) => video.platform === item).slice(0, visible);
                return <PlatformVideoSection key={item} platform={item} videos={platformVideos} />;
              })}
            </div>
          ) : (
            <PlatformVideoSection platform={platform} videos={visibleVideos} />
          )}

          {!filtered.length ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm font-semibold text-gray-500">
              No active videos are available for this platform yet.
            </div>
          ) : null}

          {visible < filtered.length ? (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setVisible((count) => count + PAGE_SIZE)}
                className="rounded-full bg-[#1a1308] px-6 py-3 text-sm font-bold text-white hover:bg-[#2a2118]"
              >
                Load More
              </button>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

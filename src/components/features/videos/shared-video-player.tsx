"use client";

import Image from "next/image";
import { useState } from "react";
import { ExternalLink, Play } from "@esmate/shadcn/pkgs/lucide-react";
import { VIDEO_PLATFORM_LABELS, type PublicVideo, type VideoPlatformValue } from "@/lib/video-utils";

const THEMES: Record<VideoPlatformValue | "DEFAULT", { active: string; hover: string; label: string }> = {
  DEFAULT: { active: "border-[#ea580c] ring-[#ea580c]", hover: "hover:border-[#d8a928]", label: "text-gray-500" },
  YOUTUBE: { active: "border-red-600 ring-red-600", hover: "hover:border-red-400", label: "text-red-600" },
  TIKTOK: { active: "border-cyan-400 ring-pink-500", hover: "hover:border-cyan-400", label: "text-pink-500" },
  FACEBOOK: { active: "border-blue-600 ring-blue-600", hover: "hover:border-blue-400", label: "text-blue-600" },
  INSTAGRAM: { active: "border-fuchsia-500 ring-orange-400", hover: "hover:border-fuchsia-400", label: "text-fuchsia-600" },
};

export function SharedVideoPlayer({ videos, theme = "DEFAULT" }: { videos: PublicVideo[]; theme?: VideoPlatformValue | "DEFAULT" }) {
  const [selectedId, setSelectedId] = useState(videos[0]?.id ?? "");
  const selected = videos.find((video) => video.id === selectedId) ?? videos[0];
  if (!selected) return null;
  const styles = THEMES[theme];

  return (
    <div className="grid min-w-0 gap-5 overflow-hidden lg:grid-cols-[minmax(0,1fr)_minmax(260px,340px)]">
      <div className="min-w-0 overflow-hidden rounded-2xl border border-[#d8a928]/20 bg-white shadow-sm">
        <div className="flex aspect-video w-full items-center justify-center overflow-hidden bg-[#090909]">
          <div className={selected.format === "VERTICAL" ? "h-full max-w-full aspect-[9/16]" : "h-full w-full"}>
            {selected.embedUrl ? (
              <iframe
                key={selected.id}
                src={selected.embedUrl}
                title={selected.title}
                className="h-full w-full border-0"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center text-white">
                <p className="text-sm font-semibold">This video cannot be embedded.</p>
                <a href={selected.videoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-gray-950">
                  Open on {VIDEO_PLATFORM_LABELS[selected.platform]} <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-2 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-serif text-xl font-bold leading-tight text-gray-950">{selected.title}</h3>
          </div>
          {selected.description ? <p className="line-clamp-2 text-sm leading-relaxed text-gray-600">{selected.description}</p> : null}
        </div>
      </div>

      <aside className="min-w-0 overflow-hidden">
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-700">Suggested videos</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 lg:max-h-[520px] lg:flex-col lg:overflow-x-hidden lg:overflow-y-auto lg:pr-1">
          {videos.map((video) => (
            <button
              key={video.id}
              type="button"
              onClick={() => setSelectedId(video.id)}
              className={`flex w-[270px] shrink-0 items-center gap-3 overflow-hidden rounded-xl border bg-white p-2 text-left transition lg:w-full ${video.id === selected.id ? `${styles.active} ring-1` : `border-gray-200 ${styles.hover}`}`}
            >
              <span className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-black ${video.format === "VERTICAL" ? "h-24 w-[54px]" : "h-[72px] w-32"}`}>
                {video.thumbnail ? <Image src={video.thumbnail} alt="" fill sizes="128px" className="object-contain" /> : <Play className="h-7 w-7 text-white" />}
              </span>
              <span className="min-w-0">
                <span className="line-clamp-2 text-sm font-bold leading-snug text-gray-950">{video.title}</span>
                <span className={`mt-1 block text-xs font-semibold ${styles.label}`}>{VIDEO_PLATFORM_LABELS[video.platform]}</span>
              </span>
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}

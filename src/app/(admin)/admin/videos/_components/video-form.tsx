"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AdminImageUpload } from "@/components/admin/image-upload";
import {
  buildVideoEmbedUrl,
  detectVideoPlatform,
  VIDEO_PLACEMENT_LABELS,
  VIDEO_PLACEMENTS,
  VIDEO_FORMAT_LABELS,
  VIDEO_FORMATS,
  VIDEO_PLATFORM_LABELS,
  VIDEO_PLATFORMS,
} from "@/lib/video-utils";
import type { VideoFormValues } from "./types";

type VideoFormProps = {
  mode: "create" | "edit";
  videoId?: string;
  initialValues: VideoFormValues;
};

export function VideoForm({ mode, videoId, initialValues }: VideoFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<VideoFormValues>(initialValues);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const embedUrl = useMemo(
    () => buildVideoEmbedUrl(values.platform, values.videoUrl),
    [values.platform, values.videoUrl],
  );

  function update<K extends keyof VideoFormValues>(key: K, value: VideoFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function updateVideoUrl(videoUrl: string) {
    const platform = detectVideoPlatform(videoUrl);
    setValues((current) => ({ ...current, videoUrl, ...(platform ? { platform } : {}) }));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(mode === "create" ? "/api/admin/videos" : `/api/admin/videos/${videoId}`, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Unable to save video");
      router.push("/admin/videos");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save video");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#0a0a0a] outline-none focus:border-[#d8a928] focus:ring-2 focus:ring-[#d8a928]/20";

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        {error ? <div className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</div> : null}

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1.5 md:col-span-2">
            <span className="text-sm font-semibold text-gray-800">Title</span>
            <input className={inputClass} value={values.title} onChange={(e) => update("title", e.target.value)} required />
          </label>

          <label className="space-y-1.5 md:col-span-2">
            <span className="text-sm font-semibold text-gray-800">Description</span>
            <textarea
              className={`${inputClass} min-h-28`}
              value={values.description || ""}
              onChange={(e) => update("description", e.target.value)}
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-semibold text-gray-800">Platform</span>
            <select className={inputClass} value={values.platform} onChange={(e) => update("platform", e.target.value as VideoFormValues["platform"])}>
              {VIDEO_PLATFORMS.map((platform) => (
                <option key={platform} value={platform}>{VIDEO_PLATFORM_LABELS[platform]}</option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-semibold text-gray-800">Placement</span>
            <select className={inputClass} value={values.placement} onChange={(e) => update("placement", e.target.value as VideoFormValues["placement"])}>
              {VIDEO_PLACEMENTS.map((placement) => (
                <option key={placement} value={placement}>{VIDEO_PLACEMENT_LABELS[placement]}</option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5 md:col-span-2">
            <span className="text-sm font-semibold text-gray-800">Video Format</span>
            <select className={inputClass} value={values.format} onChange={(e) => update("format", e.target.value as VideoFormValues["format"])}>
              {VIDEO_FORMATS.map((format) => (
                <option key={format} value={format}>{VIDEO_FORMAT_LABELS[format]}</option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5 md:col-span-2">
            <span className="text-sm font-semibold text-gray-800">Video URL</span>
            <input className={inputClass} value={values.videoUrl} onChange={(e) => updateVideoUrl(e.target.value)} required />
            <div className="text-xs leading-5 text-gray-500">
              <p className="font-semibold text-gray-700">Supported URLs</p>
              <p>YouTube: Share URL · TikTok: Share URL</p>
              <p>Facebook: Video/Post URL · Instagram: Reel/Post URL</p>
            </div>
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-semibold text-gray-800">Button Text</span>
            <input className={inputClass} value={values.buttonText || ""} onChange={(e) => update("buttonText", e.target.value)} />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-semibold text-gray-800">Button URL</span>
            <input className={inputClass} value={values.buttonUrl || ""} onChange={(e) => update("buttonUrl", e.target.value)} />
          </label>

          <label className="space-y-1.5">
            <span className="text-sm font-semibold text-gray-800">Display Order</span>
            <input
              className={inputClass}
              type="number"
              value={values.displayOrder}
              onChange={(e) => update("displayOrder", Number(e.target.value))}
            />
          </label>

          <div className="flex items-center gap-4 pt-7">
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-gray-800">
              <input type="checkbox" checked={values.featured} onChange={(e) => update("featured", e.target.checked)} />
              Featured
            </label>
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-gray-800">
              <input type="checkbox" checked={values.active} onChange={(e) => update("active", e.target.checked)} />
              Active
            </label>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-sm font-semibold text-gray-800">SEO Title</span>
            <input className={inputClass} value={values.seoTitle || ""} onChange={(e) => update("seoTitle", e.target.value)} />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-semibold text-gray-800">SEO Description</span>
            <input className={inputClass} value={values.seoDescription || ""} onChange={(e) => update("seoDescription", e.target.value)} />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 pt-5">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[#1a1308] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#2a2118] disabled:opacity-60"
          >
            {saving ? "Saving..." : mode === "create" ? "Create Video" : "Update Video"}
          </button>
          <Link href="/admin/videos" className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-800 hover:bg-gray-50">
            Cancel
          </Link>
        </div>
      </div>

      <aside className="space-y-5">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <AdminImageUpload
            label="Thumbnail"
            folder="mmlaptop/videos"
            usedIn="video"
            value={values.thumbnail || ""}
            onChange={(url) => update("thumbnail", url)}
          />
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-700">Preview</h2>
            <span className="rounded-full bg-orange-50 px-2 py-1 text-xs font-bold text-orange-700">
              {VIDEO_PLATFORM_LABELS[values.platform]}
            </span>
          </div>
          {embedUrl ? (
            <div className={`overflow-hidden rounded-xl bg-black ${values.format === "VERTICAL" ? "mx-auto aspect-[9/16] max-h-[520px]" : "aspect-video"}`}>
              <iframe
                src={embedUrl}
                title={values.title || "Video preview"}
                className="h-full w-full"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : values.thumbnail ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-xl">
              <Image src={values.thumbnail} alt="" fill sizes="340px" className="object-cover" />
            </div>
          ) : (
            <div className="flex aspect-video items-center justify-center rounded-xl bg-gray-100 text-sm font-semibold text-gray-500">
              Add a valid URL to preview
            </div>
          )}
        </div>
      </aside>
    </form>
  );
}

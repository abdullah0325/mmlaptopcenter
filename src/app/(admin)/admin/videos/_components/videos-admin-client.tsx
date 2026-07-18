"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, Pencil, Plus, Search, Trash2 } from "@esmate/shadcn/pkgs/lucide-react";
import { VIDEO_PLACEMENT_LABELS, VIDEO_PLACEMENTS, VIDEO_PLATFORM_LABELS, VIDEO_PLATFORMS } from "@/lib/video-utils";
import type { AdminVideo } from "./types";

export function VideosAdminClient() {
  const [videos, setVideos] = useState<AdminVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState("");
  const [placement, setPlacement] = useState("");
  const [active, setActive] = useState("");
  const [featured, setFeatured] = useState("");

  const params = useMemo(() => {
    const search = new URLSearchParams();
    if (query.trim()) search.set("q", query.trim());
    if (platform) search.set("platform", platform);
    if (placement) search.set("placement", placement);
    if (active) search.set("active", active);
    if (featured) search.set("featured", featured);
    return search.toString();
  }, [active, featured, placement, platform, query]);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/videos${params ? `?${params}` : ""}`, { next: { revalidate: 0 } });
    const data = await res.json();
    setVideos(data.videos || []);
    setLoading(false);
  }, [params]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchVideos();
    }, 150);
    return () => window.clearTimeout(timer);
  }, [fetchVideos]);

  async function deleteVideo(id: string) {
    if (!confirm("Delete this video? This also removes its uploaded thumbnail from Cloudinary when available.")) return;
    const res = await fetch(`/api/admin/videos/${id}`, { method: "DELETE" });
    if (res.ok) void fetchVideos();
  }

  async function quickUpdate(video: AdminVideo, patch: Partial<AdminVideo>) {
    const body = { ...video, ...patch };
    const res = await fetch(`/api/admin/videos/${video.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) void fetchVideos();
  }

  const selectClass = "rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 outline-none focus:border-[#d8a928]";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#0a0a0a]">Videos</h1>
          <p className="text-sm text-gray-500">Manage homepage, about page, and public video page content.</p>
        </div>
        <Link href="/admin/videos/new" className="inline-flex items-center gap-2 rounded-lg bg-[#1a1308] px-4 py-2 text-sm font-bold text-white hover:bg-[#2a2118]">
          <Plus className="h-4 w-4" />
          Add Video
        </Link>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[minmax(220px,1fr)_160px_160px_140px_140px]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title, description, URL..."
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-[#d8a928]"
            />
          </label>
          <select value={platform} onChange={(e) => setPlatform(e.target.value)} className={selectClass}>
            <option value="">All platforms</option>
            {VIDEO_PLATFORMS.map((item) => <option key={item} value={item}>{VIDEO_PLATFORM_LABELS[item]}</option>)}
          </select>
          <select value={placement} onChange={(e) => setPlacement(e.target.value)} className={selectClass}>
            <option value="">All placements</option>
            {VIDEO_PLACEMENTS.map((item) => <option key={item} value={item}>{VIDEO_PLACEMENT_LABELS[item]}</option>)}
          </select>
          <select value={active} onChange={(e) => setActive(e.target.value)} className={selectClass}>
            <option value="">Any status</option>
            <option value="true">Active</option>
            <option value="false">Disabled</option>
          </select>
          <select value={featured} onChange={(e) => setFeatured(e.target.value)} className={selectClass}>
            <option value="">Any feature</option>
            <option value="true">Featured</option>
            <option value="false">Not featured</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="grid grid-cols-[72px_minmax(220px,1fr)_120px_140px_90px_110px_130px] gap-3 border-b border-gray-100 bg-gray-50 px-4 py-3 text-xs font-bold uppercase text-gray-500">
          <span>Thumb</span>
          <span>Video</span>
          <span>Platform</span>
          <span>Placement</span>
          <span>Order</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>
        {loading ? (
          <div className="p-8 text-center text-sm font-semibold text-gray-500">Loading videos...</div>
        ) : videos.length ? (
          <div className="divide-y divide-gray-100">
            {videos.map((video) => (
              <div key={video.id} className="grid grid-cols-[72px_minmax(220px,1fr)_120px_140px_90px_110px_130px] items-center gap-3 px-4 py-3">
                <div className="h-12 w-16 overflow-hidden rounded-lg bg-gray-100">
                  {video.thumbnail ? (
                    <div className="relative h-full w-full">
                      <Image src={video.thumbnail} alt="" fill sizes="64px" className="object-cover" />
                    </div>
                  ) : null}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-bold text-gray-950">{video.title}</div>
                  <div className="truncate text-xs text-gray-500">{video.videoUrl}</div>
                </div>
                <span className="text-sm font-semibold text-gray-700">{VIDEO_PLATFORM_LABELS[video.platform]}</span>
                <span className="text-sm font-semibold text-gray-700">{VIDEO_PLACEMENT_LABELS[video.placement]}</span>
                <span className="text-sm font-bold text-gray-950">{video.displayOrder}</span>
                <div className="space-y-1">
                  <button onClick={() => void quickUpdate(video, { active: !video.active })} className={`block rounded-full px-2 py-1 text-xs font-bold ${video.active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                    {video.active ? "Active" : "Disabled"}
                  </button>
                  <button onClick={() => void quickUpdate(video, { featured: !video.featured })} className={`block rounded-full px-2 py-1 text-xs font-bold ${video.featured ? "bg-orange-50 text-orange-700" : "bg-gray-100 text-gray-600"}`}>
                    {video.featured ? "Featured" : "Normal"}
                  </button>
                </div>
                <div className="flex justify-end gap-2">
                  <a href={video.videoUrl} target="_blank" rel="noreferrer" className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50" aria-label="Preview">
                    <Eye className="h-4 w-4" />
                  </a>
                  <Link href={`/admin/videos/${video.id}/edit`} className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50" aria-label="Edit">
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button onClick={() => void deleteVideo(video.id)} className="rounded-lg border border-red-100 p-2 text-red-600 hover:bg-red-50" aria-label="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-sm font-semibold text-gray-500">No videos found.</div>
        )}
      </div>
    </div>
  );
}

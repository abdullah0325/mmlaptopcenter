import { z } from "zod";
import type { Video } from "@prisma/client";

export const VIDEO_PLATFORMS = ["YOUTUBE", "TIKTOK", "FACEBOOK", "INSTAGRAM"] as const;
export const VIDEO_PLACEMENTS = ["HOMEPAGE", "ABOUT", "VIDEOS_PAGE"] as const;
export const VIDEO_FORMATS = ["LANDSCAPE", "VERTICAL"] as const;

export type VideoPlatformValue = (typeof VIDEO_PLATFORMS)[number];
export type VideoPlacementValue = (typeof VIDEO_PLACEMENTS)[number];
export type VideoFormatValue = (typeof VIDEO_FORMATS)[number];

export class VideoUrlError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VideoUrlError";
  }
}

export const VIDEO_PLATFORM_LABELS: Record<VideoPlatformValue, string> = {
  YOUTUBE: "YouTube",
  TIKTOK: "TikTok",
  FACEBOOK: "Facebook",
  INSTAGRAM: "Instagram",
};

export const VIDEO_PLACEMENT_LABELS: Record<VideoPlacementValue, string> = {
  HOMEPAGE: "Homepage",
  ABOUT: "About Page",
  VIDEOS_PAGE: "Videos Page",
};

export const VIDEO_FORMAT_LABELS: Record<VideoFormatValue, string> = {
  LANDSCAPE: "Landscape / Laptop Screen",
  VERTICAL: "Vertical / Reel / Short",
};

export const videoSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().optional().nullable(),
  thumbnail: z.string().trim().optional().nullable(),
  videoUrl: z.string().trim().url("Enter a valid video URL"),
  // Kept in the payload for backwards compatibility. The URL is the source of truth.
  platform: z.enum(VIDEO_PLATFORMS).optional(),
  placement: z.enum(VIDEO_PLACEMENTS).default("VIDEOS_PAGE"),
  format: z.enum(VIDEO_FORMATS).default("LANDSCAPE"),
  buttonText: z.string().trim().optional().nullable(),
  buttonUrl: z.string().trim().optional().nullable(),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  displayOrder: z.coerce.number().int().default(0),
  seoTitle: z.string().trim().optional().nullable(),
  seoDescription: z.string().trim().optional().nullable(),
});

export type VideoFormPayload = z.infer<typeof videoSchema>;

export type PublicVideo = {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  videoUrl: string;
  embedUrl: string | null;
  platform: VideoPlatformValue;
  placement: VideoPlacementValue;
  format: VideoFormatValue;
  buttonText: string | null;
  buttonUrl: string | null;
  featured: boolean;
  active: boolean;
  displayOrder: number;
  seoTitle: string | null;
  seoDescription: string | null;
};

function safeUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url : null;
  } catch {
    return null;
  }
}

function isHost(url: URL, domain: string) {
  return url.hostname === domain || url.hostname.endsWith(`.${domain}`);
}

export function detectVideoPlatform(value: string): VideoPlatformValue | null {
  const url = safeUrl(value);
  if (!url) return null;
  if (url.hostname === "youtu.be" || isHost(url, "youtube.com")) return "YOUTUBE";
  if (isHost(url, "tiktok.com")) return "TIKTOK";
  if (url.hostname === "fb.watch" || isHost(url, "facebook.com")) return "FACEBOOK";
  if (isHost(url, "instagram.com")) return "INSTAGRAM";
  return null;
}

function youtubeEmbed(url: URL) {
  let id = "";
  if (url.hostname === "youtu.be") id = url.pathname.split("/").filter(Boolean)[0] || "";
  else if (isHost(url, "youtube.com") && url.pathname === "/watch") id = url.searchParams.get("v") || "";
  if (!/^[\w-]{6,}$/.test(id)) return null;
  return `https://www.youtube.com/embed/${id}`;
}

function tiktokEmbed(url: URL) {
  if (!isHost(url, "tiktok.com")) return null;
  const match = url.pathname.match(/^\/@[^/]+\/video\/(\d+)/);
  return match ? `https://www.tiktok.com/player/v1/${match[1]}` : null;
}

function facebookEmbed(url: URL) {
  if (!(url.hostname === "fb.watch" || isHost(url, "facebook.com"))) return null;
  // Facebook's Copy link action now commonly returns /share/r/... and
  // /share/v/... URLs. Older videos can also use watch.php or story.php.
  // The Facebook player resolves those public share URLs itself, so avoid
  // rejecting valid links just because their path is not a canonical
  // /videos/... permalink.
  const isVideoPath =
    url.hostname === "fb.watch" ||
    /\/(watch(?:\.php)?|videos|reels?|posts|permalink|share\/(?:r|v|reel|video))(\/|$)/i.test(url.pathname) ||
    /\/(?:story|video)\.php$/i.test(url.pathname) ||
    url.searchParams.has("v") ||
    url.searchParams.has("story_fbid");
  if (!isVideoPath) return null;
  return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url.toString())}&show_text=false&width=734`;
}

function instagramEmbed(url: URL) {
  if (!isHost(url, "instagram.com")) return null;
  const match = url.pathname.match(/^\/(p|reel)\/([\w-]+)/);
  return match ? `https://www.instagram.com/${match[1]}/${match[2]}/embed/` : null;
}

export function buildVideoEmbedUrl(platform: VideoPlatformValue, videoUrl: string) {
  const url = safeUrl(videoUrl);
  if (!url || detectVideoPlatform(videoUrl) !== platform) return null;
  if (platform === "YOUTUBE") return youtubeEmbed(url);
  if (platform === "TIKTOK") return tiktokEmbed(url);
  if (platform === "FACEBOOK") return facebookEmbed(url);
  return instagramEmbed(url);
}

async function resolveTikTokUrl(videoUrl: string) {
  const url = safeUrl(videoUrl);
  if (!url || url.hostname !== "vm.tiktok.com") return videoUrl;
  try {
    const response = await fetch(url, { method: "HEAD", redirect: "follow", cache: "no-store" });
    return response.url;
  } catch {
    throw new VideoUrlError("The TikTok short URL could not be resolved. Check that it is public and try again.");
  }
}

export async function prepareVideoData(input: unknown) {
  const validated = videoSchema.parse(input);
  const platform = detectVideoPlatform(validated.videoUrl);
  if (!platform) throw new VideoUrlError("Unsupported video URL. Use a YouTube, TikTok, Facebook, or Instagram URL.");

  const resolvedUrl = platform === "TIKTOK" ? await resolveTikTokUrl(validated.videoUrl) : validated.videoUrl;
  const embedUrl = buildVideoEmbedUrl(platform, resolvedUrl);
  if (!embedUrl) throw new VideoUrlError(`This ${VIDEO_PLATFORM_LABELS[platform]} URL is invalid or cannot be embedded.`);

  const buttonUrl = validated.buttonUrl ? safeUrl(validated.buttonUrl)?.toString() ?? null : null;
  return {
    ...validated,
    platform,
    description: validated.description || null,
    thumbnail: validated.thumbnail || null,
    videoUrl: validated.videoUrl,
    embedUrl,
    buttonText: validated.buttonText || null,
    buttonUrl,
    seoTitle: validated.seoTitle || null,
    seoDescription: validated.seoDescription || null,
  };
}

export function serializeVideo(video: Video): PublicVideo {
  return {
    id: video.id,
    title: video.title,
    description: video.description,
    thumbnail: video.thumbnail,
    videoUrl: video.videoUrl,
    embedUrl: buildVideoEmbedUrl(video.platform, video.videoUrl) ?? video.embedUrl,
    platform: video.platform,
    placement: video.placement,
    format: video.format,
    buttonText: video.buttonText,
    buttonUrl: video.buttonUrl,
    featured: video.featured,
    active: video.active,
    displayOrder: video.displayOrder,
    seoTitle: video.seoTitle,
    seoDescription: video.seoDescription,
  };
}

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

export type VideoFormPayload = {
  title: string;
  description?: string | null;
  thumbnail?: string | null;
  videoUrl: string;
  platform?: VideoPlatformValue;
  placement: VideoPlacementValue;
  format: VideoFormatValue;
  buttonText?: string | null;
  buttonUrl?: string | null;
  featured: boolean;
  active: boolean;
  displayOrder: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

function optionalString(value: unknown, field: string) {
  if (value == null) return null;
  if (typeof value !== "string") throw new VideoUrlError(`${field} must be a string`);
  return value.trim();
}

function enumValue<T extends readonly string[]>(
  value: unknown,
  allowed: T,
  fallback: T[number],
  field: string,
): T[number] {
  if (value == null) return fallback;
  if (typeof value !== "string" || !allowed.includes(value)) {
    throw new VideoUrlError(`Invalid ${field}`);
  }
  return value as T[number];
}

function parseVideoInput(input: unknown): VideoFormPayload {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new VideoUrlError("Invalid video data");
  }

  const value = input as Record<string, unknown>;
  const title = optionalString(value.title, "Title");
  if (!title) throw new VideoUrlError("Title is required");

  const videoUrl = optionalString(value.videoUrl, "Video URL");
  if (!videoUrl || !safeUrl(videoUrl)) {
    throw new VideoUrlError("Enter a valid video URL");
  }

  if (value.platform != null && !VIDEO_PLATFORMS.includes(value.platform as VideoPlatformValue)) {
    throw new VideoUrlError("Invalid platform");
  }

  const displayOrder = value.displayOrder == null ? 0 : Number(value.displayOrder);
  if (!Number.isInteger(displayOrder)) throw new VideoUrlError("Display order must be an integer");
  if (value.featured != null && typeof value.featured !== "boolean") {
    throw new VideoUrlError("Featured must be a boolean");
  }
  if (value.active != null && typeof value.active !== "boolean") {
    throw new VideoUrlError("Active must be a boolean");
  }

  return {
    title,
    description: optionalString(value.description, "Description"),
    thumbnail: optionalString(value.thumbnail, "Thumbnail"),
    videoUrl,
    platform: value.platform as VideoPlatformValue | undefined,
    placement: enumValue(value.placement, VIDEO_PLACEMENTS, "VIDEOS_PAGE", "placement"),
    format: enumValue(value.format, VIDEO_FORMATS, "LANDSCAPE", "format"),
    buttonText: optionalString(value.buttonText, "Button text"),
    buttonUrl: optionalString(value.buttonUrl, "Button URL"),
    featured: value.featured === true,
    active: value.active !== false,
    displayOrder,
    seoTitle: optionalString(value.seoTitle, "SEO title"),
    seoDescription: optionalString(value.seoDescription, "SEO description"),
  };
}

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
  const validated = parseVideoInput(input);
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

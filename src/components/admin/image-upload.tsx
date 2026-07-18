"use client";

import { useRef, useState } from "react";
import { X } from "@esmate/shadcn/pkgs/lucide-react";

type UploadMode = "single" | "multiple";

export function AdminImageUpload({
  label,
  folder,
  usedIn,
  mode = "single",
  value,
  values,
  onChange,
  onChangeMany,
}: {
  label: string;
  folder: string;
  usedIn: string;
  mode?: UploadMode;
  value?: string;
  values?: string[];
  onChange?: (url: string) => void;
  onChangeMany?: (urls: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);

  async function uploadFiles(files: FileList) {
    setUploading(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);
        formData.append("usedIn", usedIn);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || "Upload failed");
        }
        uploadedUrls.push(data.secure_url || data.url);
      }

      if (mode === "single") {
        onChange?.(uploadedUrls[0] || "");
      } else {
        onChangeMany?.([...(values || []), ...uploadedUrls]);
      }
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function deleteUploadedImage(url: string) {
    if (!url || deletingUrl) return;

    setDeletingUrl(url);
    try {
      const res = await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "Delete failed");
      }

      if (mode === "single") {
        onChange?.("");
      } else {
        onChangeMany?.((values || []).filter((item) => item !== url));
      }
    } finally {
      setDeletingUrl(null);
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#0a0a0a]">{label}</label>
      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={mode === "multiple"}
          onChange={(e) => {
            if (e.target.files?.length) {
              void uploadFiles(e.target.files);
            }
          }}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-lg border border-[#d8a928]/25 bg-white px-3 py-2 text-sm font-medium text-[#0a0a0a] hover:bg-[#fcf5e8] disabled:opacity-60"
        >
          {uploading ? "Uploading..." : mode === "single" ? "Upload image" : "Upload images"}
        </button>
      </div>

      {mode === "single" && value ? (
        <div className="relative h-24 w-24 overflow-hidden rounded-lg border border-gray-200">
          <img src={value} alt="Uploaded preview" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => void deleteUploadedImage(value)}
            disabled={deletingUrl === value}
            className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow hover:bg-red-700 disabled:opacity-60"
            aria-label="Delete image"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}

      {mode === "multiple" && values?.length ? (
        <div className="grid grid-cols-4 gap-2">
          {values.map((url) => (
            <div key={url} className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200">
              <img
                src={url}
                alt="Uploaded preview"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => void deleteUploadedImage(url)}
                disabled={deletingUrl === url}
                className="absolute right-1 top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white shadow hover:bg-red-700 disabled:opacity-60"
                aria-label="Delete image"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}


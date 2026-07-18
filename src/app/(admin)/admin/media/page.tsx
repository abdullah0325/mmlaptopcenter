"use client";

import { FiUpload } from "react-icons/fi";
import { MediaGrid } from "./_components/media-grid";
import { useMedia } from "./_components/use-media";

export default function MediaPage() {
  const state = useMedia();

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold text-[#0a0a0a]">Media Library</h1>
      <div className="mb-6">
        <input type="file" ref={state.fileInputRef} onChange={state.handleUpload} accept="image/*" className="hidden" />
        <button onClick={() => state.fileInputRef.current?.click()} disabled={state.uploading} className="flex items-center gap-2 rounded-lg bg-[#d8a928] px-4 py-2 text-sm font-medium text-white hover:bg-[#b8923f] disabled:opacity-50"><FiUpload className="h-4 w-4" />{state.uploading ? "Uploading..." : "Upload File"}</button>
      </div>
      {state.loading ? <p>Loading...</p> : state.media.length === 0 ? <p className="text-gray-500">No media files yet</p> : <MediaGrid media={state.media} copied={state.copied} copyUrl={state.copyUrl} deleteMedia={state.deleteMedia} />}
    </div>
  );
}

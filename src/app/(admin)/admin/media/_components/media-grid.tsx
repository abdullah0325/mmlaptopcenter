import { FiCheck, FiCopy, FiTrash2 } from "react-icons/fi";
import type { MediaItem } from "./types";

export function MediaGrid({ media, copied, copyUrl, deleteMedia }: {
  media: MediaItem[];
  copied: string | null;
  copyUrl: (url: string) => void;
  deleteMedia: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
      {media.map((item) => (
        <div key={item.id} className="group relative">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100"><img src={item.url} alt={item.filename} className="h-full w-full object-cover" /></div>
          <p className="mt-1 truncate text-xs">{item.filename}</p>
          <div className="mt-1 flex gap-1">
            <button onClick={() => copyUrl(item.url)} className="flex flex-1 items-center justify-center gap-1 rounded bg-gray-100 py-1 text-xs hover:bg-gray-200">{copied === item.url ? <FiCheck className="h-3 w-3" /> : <FiCopy className="h-3 w-3" />}{copied === item.url ? "Copied" : "Copy"}</button>
            <button onClick={() => deleteMedia(item.id)} className="flex flex-1 items-center justify-center gap-1 rounded bg-red-50 py-1 text-xs text-red-600 hover:bg-red-100"><FiTrash2 className="h-3 w-3" /></button>
          </div>
        </div>
      ))}
    </div>
  );
}

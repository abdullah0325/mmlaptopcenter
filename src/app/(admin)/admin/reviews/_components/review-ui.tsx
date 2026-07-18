import { Star } from "lucide-react";
import type { Review } from "./types";

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => <Star key={star} className={`h-3 w-3 ${star <= rating ? "fill-[#d8a928] text-[#d8a928]" : "text-gray-300"}`} />)}
    </div>
  );
}

export function StatusBadge({ status }: { status: Review["status"] }) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    approved: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
  };
  return <span className={`rounded-full border px-2 py-0.5 text-xs ${styles[status]}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
}

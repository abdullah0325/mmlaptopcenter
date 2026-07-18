import type { Review, Statistics } from "./types";

export function ReviewStats({ reviews, statistics, total }: { reviews: Review[]; statistics: Statistics; total: number }) {
  const cards = [
    ["Total Reviews", total, "bg-white border-[#d8a928]/20 text-[#0a0a0a]"],
    ["Pending", statistics.pending, "bg-yellow-50 border-yellow-200 text-yellow-800"],
    ["Approved", statistics.approved, "bg-green-50 border-green-200 text-green-800"],
    ["Rejected", statistics.rejected, "bg-red-50 border-red-200 text-red-800"],
    ["Featured", reviews.filter((r) => r.isFeatured).length, "bg-[#fcf5e8] border-[#d8a928]/30 text-[#d8a928]"],
  ] as const;
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-5">
      {cards.map(([label, value, classes]) => <div key={label} className={`rounded-xl border p-4 ${classes}`}><div className="text-sm">{label}</div><div className="text-2xl font-bold">{value}</div></div>)}
    </div>
  );
}

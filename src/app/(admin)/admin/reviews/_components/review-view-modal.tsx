import type { Review } from "./types";
import { formatDate, StarRating, StatusBadge } from "./review-ui";

export function ReviewViewModal({
  review, onClose, onEdit,
}: {
  review: Review;
  onClose: () => void;
  onEdit: (review: Review) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-xl bg-white p-6">
        <div className="mb-4 flex items-start justify-between"><h2 className="text-lg font-bold text-[#0a0a0a]">Review Details</h2><button onClick={onClose} className="text-[#5A5E55] hover:text-[#0a0a0a]">x</button></div>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fcf5e8]">{review.authorImage ? <img src={review.authorImage} alt="" className="h-full w-full rounded-full object-cover" /> : <span className="text-lg font-bold text-[#5A5E55]">{review.authorName.charAt(0).toUpperCase()}</span>}</div>
            <div><div className="font-semibold text-[#0a0a0a]">{review.authorName}</div><div className="text-sm text-[#5A5E55]">{review.authorEmail || "No email"}</div><div className="text-xs text-[#5A5E55]">{formatDate(review.createdAt)}</div></div>
          </div>
          <StarRating rating={review.rating} />
          <p className="whitespace-pre-wrap text-sm text-[#5A5E55]">{review.content}</p>
          {review.images.length > 0 && <div><div className="mb-2 text-sm font-medium text-[#0a0a0a]">Attached Images</div><div className="flex flex-wrap gap-2">{review.images.map((img, idx) => <img key={idx} src={img} alt={`Review image ${idx + 1}`} className="h-20 w-20 rounded-lg border border-[#d8a928]/20 object-cover" />)}</div></div>}
          <div className="flex gap-4 text-sm"><div><span className="text-[#5A5E55]">Status: </span><StatusBadge status={review.status} /></div><div><span className="text-[#5A5E55]">Featured: </span>{review.isFeatured ? "Yes" : "No"}</div><div><span className="text-[#5A5E55]">Verified: </span>{review.isVerifiedPurchase ? "Yes" : "No"}</div></div>
          {review.adminNote && <div className="rounded-lg bg-[#fcf5e8] p-3"><div className="mb-1 text-sm font-medium text-[#0a0a0a]">Admin Note</div><p className="text-sm text-[#5A5E55]">{review.adminNote}</p></div>}
        </div>
        <div className="mt-6 flex justify-end gap-2 border-t pt-4"><button onClick={() => onEdit(review)} className="rounded-lg border border-[#d8a928]/30 px-4 py-2 text-sm hover:bg-[#fcf5e8]">Edit Review</button><button onClick={onClose} className="rounded-lg bg-[#f6a45d] px-4 py-2 text-sm text-white hover:bg-[#d8861f]">Close</button></div>
      </div>
    </div>
  );
}

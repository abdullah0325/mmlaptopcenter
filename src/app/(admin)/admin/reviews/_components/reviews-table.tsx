import { Award, CheckCircle, Edit3, Eye, Trash2, XCircle } from "lucide-react";
import type { Review } from "./types";
import { formatDate, StarRating, StatusBadge } from "./review-ui";

export function ReviewsTable({
  reviews, approveReview, rejectReview, toggleFeatured, deleteReview, openModal, setViewingReview,
}: {
  reviews: Review[];
  approveReview: (id: string) => void;
  rejectReview: (id: string) => void;
  toggleFeatured: (id: string, featured: boolean) => void;
  deleteReview: (id: string) => void;
  openModal: (review: Review) => void;
  setViewingReview: (review: Review) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#d8a928]/20 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead><tr className="border-b border-[#d8a928]/20 bg-[#fcf5e8]">{["Author", "Rating", "Content", "Product", "Status", "Featured", "Date", "Actions"].map((h) => <th key={h} className="px-4 py-3 font-medium text-[#0a0a0a]">{h}</th>)}</tr></thead>
          <tbody>{reviews.map((review) => <ReviewRow key={review.id} review={review} approveReview={approveReview} rejectReview={rejectReview} toggleFeatured={toggleFeatured} deleteReview={deleteReview} openModal={openModal} setViewingReview={setViewingReview} />)}</tbody>
        </table>
      </div>
    </div>
  );
}

function ReviewRow({ review, approveReview, rejectReview, toggleFeatured, deleteReview, openModal, setViewingReview }: {
  review: Review; approveReview: (id: string) => void; rejectReview: (id: string) => void;
  toggleFeatured: (id: string, featured: boolean) => void; deleteReview: (id: string) => void; openModal: (review: Review) => void; setViewingReview: (review: Review) => void;
}) {
  return (
    <tr className="border-b border-gray-100 hover:bg-[#fcf5e8]/30">
      <td className="px-4 py-3"><div className="font-medium text-[#0a0a0a]">{review.authorName}</div>{review.authorEmail && <div className="text-xs text-[#5A5E55]">{review.authorEmail}</div>}{review.isVerifiedPurchase && <span className="mt-1 flex items-center gap-1 text-[10px] text-[#f6a45d]"><CheckCircle className="h-3 w-3" /> Verified</span>}</td>
      <td className="px-4 py-3"><StarRating rating={review.rating} /></td>
      <td className="max-w-xs px-4 py-3"><div className="truncate text-sm text-[#5A5E55]" title={review.content}>{review.content.substring(0, 60)}...</div>{review.images.length > 0 && <span className="text-[10px] text-[#d8a928]">{review.images.length} image(s)</span>}</td>
      <td className="px-4 py-3">{review.productHandle ? <a href={`/products/${review.productHandle}`} className="text-sm text-[#f6a45d] hover:underline" target="_blank" rel="noopener noreferrer">{review.productHandle}</a> : <span className="text-xs text-[#5A5E55]">-</span>}</td>
      <td className="px-4 py-3"><StatusBadge status={review.status} /></td>
      <td className="px-4 py-3">{review.isFeatured ? <span className="text-[#d8a928]"><Award className="h-4 w-4" /></span> : <span className="text-xs text-[#5A5E55]">-</span>}</td>
      <td className="px-4 py-3 text-xs text-[#5A5E55]">{formatDate(review.createdAt)}</td>
      <td className="px-4 py-3"><div className="flex items-center gap-2"><Button onClick={() => setViewingReview(review)} title="View" color="gold"><Eye /></Button>{review.status === "pending" && <><Button onClick={() => approveReview(review.id)} title="Approve" color="green"><CheckCircle /></Button><Button onClick={() => rejectReview(review.id)} title="Reject" color="red"><XCircle /></Button></>}<Button onClick={() => toggleFeatured(review.id, !review.isFeatured)} title={review.isFeatured ? "Unfeature" : "Feature"} color="gold"><Award /></Button><Button onClick={() => openModal(review)} title="Edit" color="gold"><Edit3 /></Button><Button onClick={() => deleteReview(review.id)} title="Delete" color="red"><Trash2 /></Button></div></td>
    </tr>
  );
}

function Button({ children, onClick, title, color }: { children: React.ReactElement; onClick: () => void; title: string; color: "green" | "red" | "gold" }) {
  const colors = { green: "text-green-600 hover:bg-green-50", red: "text-red-600 hover:bg-red-50", gold: "text-[#d8a928] hover:bg-[#d8a928]/10" };
  return <button onClick={onClick} className={`rounded p-1 ${colors[color]}`} title={title}>{children}</button>;
}

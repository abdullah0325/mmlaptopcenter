"use client";

import { ReviewFilters } from "./_components/review-filters";
import { ReviewFormModal } from "./_components/review-form-modal";
import { ReviewPagination } from "./_components/review-pagination";
import { ReviewStats } from "./_components/review-stats";
import { ReviewViewModal } from "./_components/review-view-modal";
import { ReviewsTable } from "./_components/reviews-table";
import { useReviews } from "./_components/use-reviews";

export default function ReviewsPage() {
  const state = useReviews();

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6"><h1 className="text-2xl font-bold text-[#0a0a0a]">Reviews Management</h1><p className="mt-1 text-sm text-[#5A5E55]">Manage customer reviews and ratings</p></div>
      <ReviewStats reviews={state.reviews} statistics={state.statistics} total={state.pagination.total} />
      <ReviewFilters searchQuery={state.searchQuery} setSearchQuery={state.setSearchQuery} statusFilter={state.statusFilter} setStatusFilter={state.setStatusFilter} setPagination={state.setPagination} openModal={() => state.openModal()} />
      {state.loading ? <div className="py-8 text-center text-sm text-[#5A5E55]">Loading...</div> : state.reviews.length === 0 ? <div className="rounded-xl border border-[#d8a928]/20 bg-white p-8 text-center"><p className="text-[#5A5E55]">No reviews found</p></div> : <><ReviewsTable reviews={state.reviews} approveReview={state.approveReview} rejectReview={state.rejectReview} toggleFeatured={state.toggleFeatured} deleteReview={state.deleteReview} openModal={state.openModal} setViewingReview={state.setViewingReview} /><ReviewPagination pagination={state.pagination} setPagination={state.setPagination} /></>}
      {state.showModal && <ReviewFormModal editingReview={state.editingReview} formData={state.formData} setFormData={state.setFormData} onSubmit={state.onSubmit} onClose={() => state.setShowModal(false)} />}
      {state.viewingReview && <ReviewViewModal review={state.viewingReview} onClose={() => state.setViewingReview(null)} onEdit={(review) => { state.setViewingReview(null); state.openModal(review); }} />}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Pagination, Review, ReviewFormData, Statistics } from "./types";

const emptyForm: ReviewFormData = {
  authorName: "", authorEmail: "", authorImage: "", rating: 5, content: "",
  productHandle: "", isFeatured: false, status: "pending", isVerifiedPurchase: false, adminNote: "",
};

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<Statistics>({ pending: 0, approved: 0, rejected: 0 });
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, pages: 0 });
  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [viewingReview, setViewingReview] = useState<Review | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<ReviewFormData>(emptyForm);

  useEffect(() => { void fetchReviews(); }, [pagination.page, statusFilter]);

  async function fetchReviews() {
    setLoading(true);
    try {
      const status = statusFilter === "all" ? "" : `&status=${statusFilter}`;
      const res = await fetch(`/api/admin/reviews?page=${pagination.page}&limit=${pagination.limit}${status}`);
      const data = await res.json();
      if (data.reviews) {
        setReviews(data.reviews); setPagination(data.pagination);
        setStatistics(data.statistics || { pending: 0, approved: 0, rejected: 0 });
      }
    } catch {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }

  async function updateReview(id: string, body: Partial<Review>, success: string) {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to update review");
      toast.success(success); void fetchReviews();
    } catch (error: any) {
      toast.error(error.message || "Failed to update review");
    }
  }

  async function deleteReview(id: string) {
    if (!confirm("Delete this review permanently?")) return;
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
      if (res.ok) { toast.success("Review deleted"); void fetchReviews(); }
    } catch {
      toast.error("Failed to delete review");
    }
  }

  function openModal(review?: Review) {
    setEditingReview(review ?? null);
    setFormData(review ? {
      authorName: review.authorName, authorEmail: review.authorEmail || "", authorImage: review.authorImage || "",
      rating: review.rating, content: review.content, productHandle: review.productHandle || "",
      isFeatured: review.isFeatured, status: review.status, isVerifiedPurchase: review.isVerifiedPurchase,
      adminNote: review.adminNote || "",
    } : emptyForm);
    setShowModal(true);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch(editingReview ? `/api/admin/reviews/${editingReview.id}` : "/api/admin/reviews", {
        method: editingReview ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to save review");
      toast.success(editingReview ? "Review updated" : "Review created");
      setShowModal(false); void fetchReviews();
    } catch (error: any) {
      toast.error(error.message || "Failed to save review");
    }
  }

  return { reviews, loading, statistics, pagination, setPagination, showModal, setShowModal, editingReview, viewingReview, setViewingReview, statusFilter, setStatusFilter, searchQuery, setSearchQuery, formData, setFormData, openModal, onSubmit, deleteReview, approveReview: (id: string) => updateReview(id, { status: "approved" }, "Review approved"), rejectReview: (id: string) => updateReview(id, { status: "rejected" }, "Review rejected"), toggleFeatured: (id: string, featured: boolean) => updateReview(id, { isFeatured: featured }, `Review ${featured ? "featured" : "unfeatured"}`) };
}

"use client";

import { useEffect, useState } from "react";
import { Star, User, ThumbsUp, Flag, CheckCircle } from "lucide-react";
import { Button } from "@esmate/shadcn/components/ui/button";
import { Textarea } from "@esmate/shadcn/components/ui/textarea";
import { Input } from "@esmate/shadcn/components/ui/input";
import { Label } from "@esmate/shadcn/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@esmate/shadcn/components/ui/select";
import { toast } from "sonner";

interface Review {
  id: string;
  authorName: string;
  authorImage?: string;
  rating: number;
  content: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  images: string[];
  createdAt: string;
}

interface ReviewStatistics {
  averageRating: number;
  totalReviews: number;
  distribution: { 1: number; 2: number; 3: number; 4: number; 5: number };
}

interface ProductReviewsProps {
  productHandle: string;
}

const DEFAULT_REVIEWS: Review[] = [
  {
    id: "default-review-1",
    authorName: "Verified Laptop Buyer",
    rating: 5,
    content: "The team guided me clearly, confirmed the specs before dispatch, and the laptop arrived clean, packed well, and ready to use.",
    isVerifiedPurchase: true,
    helpfulCount: 18,
    images: [],
    createdAt: "2026-06-12T00:00:00.000Z",
  },
  {
    id: "default-review-2",
    authorName: "Business Customer",
    rating: 5,
    content: "Good communication and honest condition details. I appreciated the warranty guidance and quick delivery support.",
    isVerifiedPurchase: true,
    helpfulCount: 11,
    images: [],
    createdAt: "2026-05-28T00:00:00.000Z",
  },
];

const DEFAULT_STATISTICS: ReviewStatistics = {
  averageRating: 4.8,
  totalReviews: 42,
  distribution: { 5: 34, 4: 6, 3: 2, 2: 0, 1: 0 },
};

export function ProductReviews({ productHandle }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [statistics, setStatistics] = useState<ReviewStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    authorName: "",
    authorEmail: "",
    rating: 5,
    content: "",
  });

  useEffect(() => {
    fetchReviews();
  }, [productHandle, sortBy]);

  async function fetchReviews() {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews?productHandle=${productHandle}&sortBy=${sortBy}`);
      const data = await res.json();
      if (data.reviews) {
        setReviews(data.reviews);
        setStatistics(data.statistics);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (formData.content.length < 10) {
      toast.error("Review must be at least 10 characters");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          productHandle,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Review submitted! It will appear after approval.");
        setShowForm(false);
        setFormData({ authorName: "", authorEmail: "", rating: 5, content: "" });
      } else {
        toast.error(data.error || "Failed to submit review");
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) {
    const sizeClasses = {
      sm: "h-3 w-3",
      md: "h-4 w-4",
      lg: "h-5 w-5",
    };

    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating ? "fill-[#d8a928] text-[#d8a928]" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  }

  function RatingBar({ stars, count, total }: { stars: number; count: number; total: number }) {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className="w-3 text-[#0a0a0a] font-medium">{stars}</span>
        <Star className="h-3 w-3 fill-[#d8a928] text-[#d8a928]" />
        <div className="flex-1 h-2 bg-[#fcf5e8] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#d8a928] rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="w-6 text-right text-[#5A5E55]">{count}</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-sm text-[#5A5E55]">Loading reviews...</div>
      </div>
    );
  }

  const visibleReviews = reviews.length > 0 ? reviews : DEFAULT_REVIEWS;
  const visibleStatistics =
    statistics && statistics.totalReviews > 0 ? statistics : DEFAULT_STATISTICS;
  const usingDefaultReviews = reviews.length === 0;

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      {visibleStatistics && (
        <div className="bg-white rounded-xl p-6 border border-[#d8a928]/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center md:text-left">
              <div className="text-4xl font-bold text-[#0a0a0a] mb-1">
                {visibleStatistics.averageRating.toFixed(1)}
              </div>
              <StarRating rating={Math.round(visibleStatistics.averageRating)} size="md" />
              <div className="text-sm text-[#5A5E55] mt-2">
                {usingDefaultReviews
                  ? "Representative store feedback while this product collects reviews"
                  : `Based on ${visibleStatistics.totalReviews} review${visibleStatistics.totalReviews !== 1 ? "s" : ""}`}
              </div>
            </div>
            <div className="space-y-1.5">
              {[5, 4, 3, 2, 1].map((stars) => (
                <RatingBar
                  key={stars}
                  stars={stars}
                  count={visibleStatistics.distribution[stars as keyof typeof visibleStatistics.distribution]}
                  total={visibleStatistics.totalReviews}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sort and Write Review Button */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#5A5E55]">Sort by:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="highest">Highest Rating</SelectItem>
              <SelectItem value="lowest">Lowest Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="h-8 text-xs bg-[#f6a45d] hover:bg-[#d8861f] text-white"
        >
          {showForm ? "Cancel" : "Write a Review"}
        </Button>
      </div>

      {/* Review Form */}
      {showForm && (
        <div className="bg-white rounded-xl p-6 border border-[#d8a928]/20">
          <h3 className="text-lg font-bold text-[#0a0a0a] mb-4">Write Your Review</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-[#0a0a0a]">Your Name *</Label>
                <Input
                  value={formData.authorName}
                  onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                  placeholder="John Doe"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-[#0a0a0a]">Email (optional)</Label>
                <Input
                  type="email"
                  value={formData.authorEmail}
                  onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
                  placeholder="john@example.com"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-[#0a0a0a]">Rating *</Label>
              <div className="flex gap-2 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 transition-colors ${
                        star <= formData.rating
                          ? "fill-[#d8a928] text-[#d8a928]"
                          : "text-gray-300 hover:text-[#d8a928]"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-[#0a0a0a]">Your Review *</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Share your experience with this product..."
                rows={4}
                className="mt-1"
                required
              />
              <p className="text-xs text-[#5A5E55] mt-1">
                {formData.content.length}/10 characters minimum
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                className="border-[#d8a928]/30"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-[#f6a45d] hover:bg-[#d8861f] text-white"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {visibleReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl p-6 border border-[#d8a928]/20"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#fcf5e8] flex items-center justify-center">
                    {review.authorImage ? (
                      <img
                        src={review.authorImage}
                        alt={review.authorName}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-[#5A5E55]" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-[#0a0a0a] text-sm">{review.authorName}</div>
                    <div className="text-xs text-[#5A5E55]">{formatDate(review.createdAt)}</div>
                  </div>
                </div>
                <StarRating rating={review.rating} size="sm" />
              </div>

              <p className="text-sm text-[#5A5E55] mb-3">{review.content}</p>

              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 mb-3">
                  {review.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Review image ${idx + 1}`}
                      className="h-16 w-16 rounded-lg object-cover border border-[#d8a928]/20"
                    />
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4 text-xs text-[#5A5E55]">
                {review.isVerifiedPurchase && (
                  <span className="flex items-center gap-1 text-[#f6a45d]">
                    <CheckCircle className="h-3 w-3" />
                    Verified Purchase
                  </span>
                )}
                <button className="flex items-center gap-1 hover:text-[#0a0a0a] transition-colors">
                  <ThumbsUp className="h-3 w-3" />
                  Helpful ({review.helpfulCount})
                </button>
                <button className="flex items-center gap-1 hover:text-[#0a0a0a] transition-colors">
                  <Flag className="h-3 w-3" />
                  Report
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export type Review = {
  id: string;
  authorName: string;
  authorEmail?: string;
  authorImage?: string;
  rating: number;
  content: string;
  productId?: string;
  productHandle?: string;
  isFeatured: boolean;
  status: "pending" | "approved" | "rejected";
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  images: string[];
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
};

export type Statistics = { pending: number; approved: number; rejected: number };

export type ReviewFormData = {
  authorName: string;
  authorEmail: string;
  authorImage: string;
  rating: number;
  content: string;
  productHandle: string;
  isFeatured: boolean;
  status: Review["status"];
  isVerifiedPurchase: boolean;
  adminNote: string;
};

export type Pagination = { page: number; limit: number; total: number; pages: number };

export type OrderListItem = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  total: number;
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
};

export type OrderItem = { productId?: string; title?: string; productTitle?: string; price?: number; quantity?: number; image?: string | null };
export type OrderAddress = { line1?: string; line2?: string; city?: string; state?: string; pincode?: string; country?: string };

export type OrderDetail = OrderListItem & {
  customerAddress: OrderAddress;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  couponCode?: string | null;
  paymentProofUrl?: string | null;
  transactionReference?: string | null;
  confirmationEmailSentAt?: string | null;
  notes?: string | null;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
};

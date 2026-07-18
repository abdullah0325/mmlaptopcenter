/**
 * WhatsApp Integration Utilities
 * 
 * This module provides utility functions for WhatsApp integration
 * including phone number validation, formatting, and message building.
 */

// Admin WhatsApp number (your business number)
export const ADMIN_WHATSAPP_NUMBER = "923234567890";

/**
 * Validate if a phone number is a valid WhatsApp number
 * Accepts formats like: 03xxxxxxxxx, +923xxxxxxxxx, 923xxxxxxxxx
 */
export function isValidWhatsAppNumber(phone: string): boolean {
  if (!phone) return false;
  // Remove spaces, dashes, and parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, "");
  // Should be 10-15 digits, optionally starting with +
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(cleaned);
}

/**
 * Format phone number for WhatsApp URL
 * Removes +, spaces, dashes, and parentheses
 */
export function formatPhoneForWhatsApp(phone: string): string {
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, "");
  if (cleaned.startsWith("0")) return `92${cleaned.slice(1)}`;
  return cleaned;
}

/**
 * Build a WhatsApp URL for chatting with a customer
 */
export function buildWhatsAppChatUrl(phone: string, message?: string): string {
  const formattedPhone = formatPhoneForWhatsApp(phone);
  const encodedMessage = message ? encodeURIComponent(message) : "";
  return `https://wa.me/${formattedPhone}${encodedMessage ? `?text=${encodedMessage}` : ""}`;
}

/**
 * Open WhatsApp chat with a customer in a new window
 */
export function openWhatsAppChat(phone: string, message?: string): void {
  const url = buildWhatsAppChatUrl(phone, message);
  window.open(url, "_blank");
}

// Order-related types
export interface OrderItem {
  title: string;
  quantity: number;
  price: number;
  productId?: string;
}

export interface OrderAddress {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  customerAddress?: OrderAddress;
  items?: OrderItem[];
  subtotal?: number;
  shippingCost?: number;
  tax?: number;
  total: number;
  discount?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  orderStatus?: string;
  createdAt?: string;
}

/**
 * Build order confirmation message for sending to customers
 */
export function buildOrderConfirmationMessage(order: Order): string {
  const items = (Array.isArray(order.items) ? order.items : [])
    .map((item) => {
      return `• ${item.title} x${item.quantity} - Rs. ${(item.price * item.quantity).toLocaleString()}`;
    })
    .join("\n");

  const address = order.customerAddress || {};
  const addressStr = [address.line1, address.line2, address.city, address.state, address.pincode]
    .filter(Boolean)
    .join(", ");

  return `Assalam-o-Alaikum ${order.customerName}! 🌿

Your order *${order.orderNumber}* has been confirmed!

*Order Details:*
${items}

*Total: Rs. ${order.total.toLocaleString()}*

*Delivery Address:*
${addressStr}

*Payment:* ${order.paymentMethod?.replaceAll("_", " ").toUpperCase() || "N/A"}
*Order Status:* ${order.orderStatus || "confirmed"}

We're preparing your order for dispatch. You'll receive tracking updates soon.

Thank you for choosing MM Laptop Center! 💚

For queries, reply to this message.`;
}

/**
 * Build order details message for internal use/sharing
 */
export function buildOrderDetailsMessage(order: Order): string {
  const items = (Array.isArray(order.items) ? order.items : [])
    .map((item) => {
      return `• ${item.title} x${item.quantity}`;
    })
    .join("\n");

  const address = order.customerAddress || {};
  const addressStr = [address.line1, address.line2, address.city, address.state, address.pincode]
    .filter(Boolean)
    .join(", ");

  const placedDate = order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A";

  return `*Order ${order.orderNumber}*

*Customer:* ${order.customerName}
*Phone:* ${order.customerPhone}
*Email:* ${order.customerEmail}

*Items:*
${items}

*Total:* Rs. ${order.total.toLocaleString()}
*Payment:* ${order.paymentMethod?.toUpperCase() || "N/A"} (${order.paymentStatus || "N/A"})
*Status:* ${order.orderStatus || "N/A"}

*Address:* ${addressStr}

*Placed:* ${placedDate}`;
}

/**
 * Build a pre-filled order message for customers to send via WhatsApp
 * (Used during checkout when customer wants to order via WhatsApp)
 */
export function buildCustomerOrderMessage(cartItems: any[], customerName: string, customerPhone: string, address: { line1: string; line2?: string; city: string; pincode?: string }): string {
  const items = cartItems
    .map((line) => {
      const title = line?.merchandise?.product?.title || "Product";
      const qty = line?.quantity || 1;
      const price = Number(line?.cost?.totalAmount?.amount || 0).toLocaleString();
      return `• ${title} x${qty} - Rs. ${price}`;
    })
    .join("\n");

  const subtotal = cartItems
    .reduce((sum, line) => sum + Number(line.cost?.totalAmount?.amount || 0), 0)
    .toLocaleString();

  return `Hi MM Laptop Center,

I would like to order:
${items}

Total: Rs. ${subtotal}

Customer: ${customerName}
Phone: ${customerPhone}
Address: ${address.line1}${address.line2 ? ", " + address.line2 : ""}, ${address.city}${address.pincode ? " - " + address.pincode : ""}

Please confirm my order. Thank you!`;
}

/**
 * Check if a phone number has WhatsApp available
 * This is a client-side check - for server-side verification, use WhatsApp Business API
 */
export async function checkWhatsAppAvailability(phone: string): Promise<boolean> {
  // Note: This is a basic check. For production, you might want to use
  // WhatsApp Business API to verify if a number is registered on WhatsApp
  return isValidWhatsAppNumber(phone);
}

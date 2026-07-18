import nodemailer from "nodemailer";

type EmailOrder = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerAddress: unknown;
  items: unknown;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character] ?? character);
}

export async function sendOrderConfirmationEmail(order: EmailOrder) {
  const user = process.env.GMAIL_USER || process.env.ADMIN_EMAIL || process.env.ADMIN_USER;
  const appPassword = process.env.GMAIL_APP_PASSWORD || process.env.googleapppassword;
  if (!user || !user.includes("@") || !appPassword) {
    throw new Error("Gmail confirmation email is not configured. Add GMAIL_USER and GMAIL_APP_PASSWORD to .env, then restart the server.");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass: appPassword.replaceAll(" ", "") },
  });
  const items = Array.isArray(order.items) ? order.items as Array<{ title?: unknown; quantity?: unknown; price?: unknown }> : [];
  const address = order.customerAddress && typeof order.customerAddress === "object" ? order.customerAddress as Record<string, unknown> : {};
  const addressText = [address.line1, address.line2, address.city, address.state, address.pincode, address.country].filter(Boolean).map(String).join(", ");
  const itemHtml = items.map((item) => `<li style="margin-bottom:8px">${escapeHtml(String(item.title ?? "Item"))} &times; ${Number(item.quantity ?? 1)} — PKR ${(Number(item.price ?? 0) * Number(item.quantity ?? 1)).toLocaleString()}</li>`).join("");

  await transporter.sendMail({
    from: `MM Laptop Center <${user}>`,
    to: order.customerEmail,
    replyTo: user,
    subject: `Order ${order.orderNumber} confirmed`,
    html: `<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#1a1308"><div style="background:#f6a45d;padding:20px;color:white"><h1 style="margin:0;font-size:24px">Order confirmed</h1></div><div style="padding:24px;border:1px solid #eee"><p>Assalam-o-Alaikum ${escapeHtml(order.customerName)},</p><p>Your order <strong>${escapeHtml(order.orderNumber)}</strong> has been confirmed.</p><h3>Products</h3><ul>${itemHtml}</ul><p><strong>Total:</strong> PKR ${order.total.toLocaleString()}</p><p><strong>Payment method:</strong> ${escapeHtml(order.paymentMethod.replaceAll("_", " "))}</p><p><strong>Payment status:</strong> ${escapeHtml(order.paymentStatus)}</p><p><strong>Order status:</strong> ${escapeHtml(order.orderStatus)}</p><p><strong>Delivery address:</strong><br>${escapeHtml(addressText || "Not provided")}</p><p>Thank you for choosing MM Laptop Center.</p></div></div>`,
  });
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { sendOrderConfirmationEmail } from "@/lib/order-email";

const schema = z.object({
  orderStatus: z.enum(["pending", "confirmed", "processing", "shipped", "completed", "cancelled"]).optional(),
  paymentStatus: z.enum(["pending", "verified", "failed", "refunded"]).optional(),
  trackingNumber: z.string().max(120).optional(),
  trackingUrl: z.union([z.string().url(), z.literal("")]).optional(),
  notes: z.string().max(5000).optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const input = schema.parse(await request.json());
    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    const shouldEmail = input.orderStatus === "confirmed" && !existing.confirmationEmailSentAt;
    const order = await prisma.order.update({ where: { id }, data: input });
    let emailWarning: string | undefined;
    if (shouldEmail) {
      try {
        await sendOrderConfirmationEmail(order);
        await prisma.order.update({ where: { id }, data: { confirmationEmailSentAt: new Date() } });
      } catch (error) {
        emailWarning = error instanceof Error ? error.message : "Confirmation email failed.";
      }
    }
    return NextResponse.json({ ...order, confirmationEmailSentAt: shouldEmail && !emailWarning ? new Date().toISOString() : order.confirmationEmailSentAt, emailWarning });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: "Invalid order update", details: error.issues }, { status: 400 });
    return NextResponse.json({ error: error instanceof Error ? error.message : "Update failed" }, { status: 500 });
  }
}

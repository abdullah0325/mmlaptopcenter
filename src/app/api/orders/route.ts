import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { calculateOrderPricing } from "@/lib/order-pricing";

const orderCreateSchema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(10, "Phone number is required and must be at least 10 digits"),
  customerAddress: z.object({
    line1: z.string().min(1),
    line2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().optional(),
    pincode: z.string().optional(),
    country: z.string().optional(),
  }),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1),
      }),
    )
    .min(1),
  notes: z.string().optional(),
  paymentMethod: z.enum(["cod", "bank_transfer", "jazzcash"]).default("cod"),
  paymentProofUrl: z.string().url().optional(),
  transactionReference: z.string().max(120).optional(),
});

const COD_LIMIT = 50_000;
const JAZZCASH_LIMIT = 10_000;

function generateOrderNumber() {
  const ts = new Date()
    .toISOString()
    .replace(/[-:TZ.]/g, "")
    .slice(0, 14);
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `OC-${ts}-${rand}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = orderCreateSchema.parse(body);

    const ids = Array.from(new Set(input.items.map((i) => i.productId)));

    const products = await prisma.product.findMany({
      where: { id: { in: ids }, status: "ACTIVE" },
      select: {
        id: true,
        title: true,
        price: true,
        inventory: true,
        availableForSale: true,
        status: true,
        featuredImage: true,
        images: true,
      },
    });

    const productById = new Map(products.map((p) => [p.id, p]));
    const variations = await prisma.productVariation.findMany({
      where: { id: { in: ids }, active: true, product: { status: "ACTIVE", availableForSale: true } },
      include: { product: { select: { title: true, featuredImage: true } } },
    });
    const variationById = new Map(variations.map((variation) => [variation.id, variation]));

    // Validate items against DB snapshot
    const enrichedItems = input.items.map((item) => {
      const product = productById.get(item.productId);
      const variation = variationById.get(item.productId);
      if (!product && !variation) {
        throw new Error("One or more products are not available. Please check if all products are active.");
      }
      if (product && !product.availableForSale) {
        throw new Error(`Product not available for sale: ${product.title}`);
      }
      if (variation) {
        const images = Array.isArray(variation.images) ? (variation.images as unknown[]).filter((image): image is string => typeof image === "string") : [];
        return { productId: variation.id, title: `${variation.product.title} - ${variation.name}`, price: variation.price, quantity: item.quantity, image: images[0] ?? variation.product.featuredImage ?? null, variationId: variation.id };
      }
      if (!product) throw new Error("Product is not available.");
      // if (product.inventory < item.quantity) {
      //   throw new Error(`Insufficient inventory for ${product.title}. Available: ${product.inventory}`);
      // }
      const images = Array.isArray(product.images)
        ? (product.images as unknown[]).filter((x): x is string => typeof x === "string")
        : [];

      return {
        productId: product.id,
        title: product.title,
        price: product.price,
        quantity: item.quantity,
        image: product.featuredImage ?? images[0] ?? null,
      };
    });

    const subtotal = enrichedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const pricing = calculateOrderPricing(subtotal, input.paymentMethod === "cod");
    const shippingCost = pricing.shippingCost;
    const tax = pricing.tax;
    const discount = 0;
    const total = pricing.total - discount;

    if (input.paymentMethod === "cod" && total > COD_LIMIT) throw new Error(`Cash on delivery is only available for orders up to Rs. ${COD_LIMIT.toLocaleString()}.`);
    if (input.paymentMethod === "jazzcash" && total > JAZZCASH_LIMIT) throw new Error(`JazzCash is only available for orders up to Rs. ${JAZZCASH_LIMIT.toLocaleString()}. Please use bank transfer or bank cash deposit.`);
    if (input.paymentMethod !== "cod" && !input.paymentProofUrl) throw new Error("Payment screenshot is required for prepaid payment.");

    const orderNumber = generateOrderNumber();

    const order = await prisma.$transaction(async (tx) => {
      // Best-effort inventory decrement: do not block order confirmation on stock gaps.
      for (const item of enrichedItems) {
        if ("variationId" in item) await tx.productVariation.updateMany({ where: { id: item.variationId, stock: { gte: item.quantity } }, data: { stock: { decrement: item.quantity } } });
        else await tx.product.updateMany({ where: { id: item.productId, inventory: { gte: item.quantity } }, data: { inventory: { decrement: item.quantity } } });
      }

      return tx.order.create({
        data: {
          orderNumber,
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          customerPhone: input.customerPhone,
          customerAddress: input.customerAddress,
          items: enrichedItems,
          subtotal,
          shippingCost,
          tax,
          total,
          discount,
          paymentMethod: input.paymentMethod,
          paymentStatus: "pending",
          paymentProofUrl: input.paymentProofUrl,
          transactionReference: input.transactionReference,
          orderStatus: "pending",
          notes: input.notes,
        },
      });
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: (error as Error).message || "Failed to place order" },
      { status: 400 },
    );
  }
}


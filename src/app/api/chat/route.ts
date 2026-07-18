import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

// ─── Schema ────────────────────────────────────────────────────────────────────
const reqSchema = z.object({
  message: z.string().min(1),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .optional(),
  draftOrder: z
    .object({
      productId: z.string().optional(),
      productTitle: z.string().optional(),
      productPrice: z.number().optional(),
      customerName: z.string().optional(),
      customerPhone: z.string().optional(),
      customerAddress: z.string().optional(),
      expectedField: z.enum(["name", "phone", "address"]).optional(),
    })
    .optional(),
});

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const C = {
  green: "#f6a45d",
  greenLight: "#f0f7f4",
  gold: "#d8a928",
  goldLight: "#fdf8ee",
  red: "#c0392b",
  text: "#1e1f1c",
  muted: "#6b7280",
  border: "#e8dfc9",
  white: "#ffffff",
};

// ─── HTML Micro-helpers ────────────────────────────────────────────────────────

const hl = (name: string) =>
  `<strong style="color:${C.green}; font-weight:700;">${name}</strong>`;

const priceTag = (amount: number | string) =>
  `<span style="color:${C.gold}; font-weight:700; font-size:15px;">PKR ${amount}</span>`;

const divider = () =>
  `<div style="height:1px; background:${C.border}; margin:10px 0; opacity:0.6;"></div>`;

const infoRow = (label: string, value: string) =>
  `<div style="display:flex; justify-content:space-between; align-items:center; padding:7px 0; border-bottom:1px solid ${C.border};">
    <span style="font-size:12px; color:${C.muted};">${label}</span>
    <span style="font-size:13px; font-weight:600; color:${C.text};">${value}</span>
  </div>`;

const inputPrompt = (icon: string, label: string, hint: string) =>
  `<div style="background:${C.goldLight}; border:1.5px dashed ${C.gold}; border-radius:12px; padding:14px 16px; margin-top:4px;">
    <div style="font-size:13px; font-weight:700; color:${C.text}; margin-bottom:4px;">${icon} ${label}</div>
    <div style="font-size:12px; color:${C.muted};">${hint}</div>
  </div>`;

const orderStepBar = (active: 0 | 1 | 2) => {
  const steps = ["Your Name", "Phone Number", "Delivery Address"];
  const dots = steps
    .map(
      (s, i) =>
        `<div style="display:flex; flex-direction:column; align-items:center; gap:4px; flex:1;">
          <div style="width:26px; height:26px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700;
            background:${i < active ? C.green : i === active ? C.gold : "#e5e7eb"};
            color:${i <= active ? C.white : C.muted};">
            ${i < active ? "✓" : i + 1}
          </div>
          <span style="font-size:10px; color:${i === active ? C.gold : C.muted}; font-weight:${i === active ? "700" : "400"};">${s}</span>
        </div>`
    )
    .join(
      `<div style="flex:1; height:2px; background:${C.border}; margin-top:12px; max-width:40px;"></div>`
    );
  return `<div style="display:flex; align-items:flex-start; justify-content:center; gap:4px; margin:12px 0 4px;">${dots}</div>`;
};

// ─── Order HTML Builders ───────────────────────────────────────────────────────

function buildOrderStartHtml(productTitle: string, productPrice: number): string {
  return `
<div style="display:flex; flex-direction:column; gap:12px;">
  <div style="background:${C.greenLight}; border-radius:14px; padding:14px 16px;">
    <div style="font-size:11px; font-weight:700; color:${C.green}; letter-spacing:0.5px; margin-bottom:8px; text-transform:uppercase;">Your Order</div>
    ${infoRow("Product", `<span style="color:${C.green}; font-weight:700;">${productTitle}</span>`)}
    ${infoRow("Price", priceTag(productPrice))}
  </div>
  ${divider()}
  ${orderStepBar(0)}
  <p style="margin:4px 0 0; font-size:14px; color:${C.muted}; line-height:1.6;">
    Great choice! Let's get this shipped to you. I just need a few quick details 😊
  </p>
  ${inputPrompt("👤", "What's your full name?", "e.g. Ahmed Khan — so we can personalize your order")}
</div>`;
}

function buildPhoneHtml(name: string): string {
  return `
<div style="display:flex; flex-direction:column; gap:12px;">
  <p style="margin:0; font-size:14px; color:${C.muted}; line-height:1.6;">
    Thanks, <strong style="color:${C.text};">${name}</strong>! Lovely name 😊 One step done!
  </p>
  ${orderStepBar(1)}
  ${inputPrompt("📱", "Your WhatsApp / Phone Number?", "e.g. 0300-1234567 — we'll send order updates here")}
</div>`;
}

function buildAddressHtml(name: string): string {
  return `
<div style="display:flex; flex-direction:column; gap:12px;">
  <p style="margin:0; font-size:14px; color:${C.muted}; line-height:1.6;">
    Almost there, <strong style="color:${C.text};">${name}</strong>! 🚚 Just the delivery address and we're done!
  </p>
  ${orderStepBar(2)}
  ${inputPrompt("📍", "Your Full Delivery Address?", "Include city, area, and street — so we deliver right to your door!")}
</div>`;
}

function buildOrderConfirmHtml(draft: {
  productTitle?: string;
  productPrice?: number;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
}): string {
  return `
<div style="display:flex; flex-direction:column; gap:12px;">
  <div style="background:${C.greenLight}; border-radius:14px; padding:18px 16px; text-align:center;">
    <div style="font-size:28px; margin-bottom:8px;">🎉</div>
    <h3 style="margin:0 0 4px; font-size:16px; font-weight:700; color:${C.green};">Order Placed Successfully!</h3>
    <p style="margin:0; font-size:13px; color:${C.muted};">Our team will confirm your order via WhatsApp shortly.</p>
  </div>
  <div style="background:${C.white}; border:1px solid ${C.border}; border-radius:14px; padding:14px;">
    <div style="font-size:11px; font-weight:700; color:${C.muted}; letter-spacing:0.5px; margin-bottom:10px; text-transform:uppercase;">Order Summary</div>
    ${infoRow("Product", `<span style="color:${C.green}; font-weight:700;">${draft.productTitle || "—"}</span>`)}
    ${infoRow("Amount", priceTag(draft.productPrice || "—"))}
    ${divider()}
    ${infoRow("Name", draft.customerName || "—")}
    ${infoRow("Phone", draft.customerPhone || "—")}
    ${infoRow("Address", draft.customerAddress || "—")}
  </div>
  <a href="https://wa.me/923048928282?text=Hi! I just placed an order for ${encodeURIComponent(draft.productTitle || "")} — Name: ${encodeURIComponent(draft.customerName || "")}, Phone: ${encodeURIComponent(draft.customerPhone || "")}" target="_blank"
    style="display:flex; align-items:center; justify-content:center; gap:8px; background:#25d366; color:${C.white}; border-radius:12px; padding:13px; font-size:14px; font-weight:700; text-decoration:none;">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.195.194 1.628.122.602-.1 1.64-.641 1.87-1.26.173-.423.233-.724.233-.989 0-.213-.01-.402-.01-.548z"/></svg>
    Confirm on WhatsApp
  </a>
</div>`;
}

// ─── Product Card Builder ──────────────────────────────────────────────────────

function buildProductCards(products: ProductRow[], intro = ""): string {
  if (!products.length) return "";

  const cards = products
    .map((p) => {
      const tag = Array.isArray(p.tags)
        ? (p.tags as unknown[]).find((x): x is string => typeof x === "string") ?? ""
        : "";
      const hasDiscount = p.compareAtPrice && p.compareAtPrice > p.price;

      return `
<div style="border:1px solid ${C.border}; border-radius:16px; overflow:hidden; background:${C.white}; box-shadow:0 2px 12px rgba(0,0,0,0.06);">
  <div style="position:relative; background:${C.goldLight};">
    <img src="${p.featuredImage || ""}" alt="${p.title}" style="width:100%; aspect-ratio:4/3; object-fit:cover; display:block;" />
    <div style="position:absolute; top:8px; left:8px; background:rgba(255,255,255,0.95); border-radius:20px; padding:4px 12px; font-size:13px; font-weight:700; color:${C.green}; box-shadow:0 1px 4px rgba(0,0,0,0.1);">
      PKR ${p.price}${hasDiscount ? ` <span style="font-size:10px; text-decoration:line-through; color:#999; margin-left:4px;">${p.compareAtPrice}</span>` : ""}
    </div>
    ${hasDiscount ? `<div style="position:absolute; top:8px; right:8px; background:${C.red}; color:${C.white}; border-radius:8px; padding:3px 8px; font-size:10px; font-weight:700; letter-spacing:0.5px;">SALE</div>` : ""}
  </div>
  <div style="padding:14px; display:flex; flex-direction:column; gap:8px;">
    <div style="font-weight:700; font-size:15px; color:${C.text};">${p.title}</div>
    ${tag ? `<span style="display:inline-block; background:${C.greenLight}; border-radius:999px; padding:3px 10px; font-size:11px; font-weight:600; color:${C.green}; width:fit-content;">${tag}</span>` : ""}
    ${p.description ? `<div style="font-size:12px; color:${C.muted}; line-height:1.5; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${p.description}</div>` : ""}
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:2px;">
      <a href="https://wa.me/923048928282?text=Hi, I want to order ${encodeURIComponent(p.title)}" target="_blank"
        style="display:flex; align-items:center; justify-content:center; gap:5px; border:1.5px solid ${C.green}; border-radius:10px; padding:9px; font-size:12px; font-weight:600; color:${C.green}; text-decoration:none; background:${C.white};">
        WhatsApp
      </a>
      <button data-add-to-cart="true" data-variant-id="${p.id}" data-title="${p.title}" data-price="${p.price}" data-image="${p.featuredImage || ""}"
        style="display:flex; align-items:center; justify-content:center; gap:5px; border-radius:10px; padding:9px; font-size:12px; font-weight:600; color:${C.white}; background:${C.green}; border:none; cursor:pointer;">
        Add to Cart
      </button>
    </div>
  </div>
</div>`;
    })
    .join("");

  return `
<div style="display:flex; flex-direction:column; gap:14px; margin-top:12px;">
  ${intro ? `<p style="font-size:14px; color:${C.muted}; margin:0 0 4px; line-height:1.5;">${intro}</p>` : ""}
  ${cards}
  <div style="background:${C.greenLight}; border-radius:12px; padding:12px 16px; text-align:center;">
    <p style="margin:0; font-size:13px; color:${C.green}; font-weight:600;">👉 Like something? Say <strong>"I want to order"</strong> and I'll guide you!</p>
  </div>
</div>`;
}

// ─── Types ─────────────────────────────────────────────────────────────────────
type ProductRow = {
  id: string;
  handle: string;
  title: string;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  tags: unknown;
  featuredImage: string | null;
};

// ─── System Prompt ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `
You are Zara — a smart, warm sales advisor for MM Laptop Center, a premium laptop store from Pakistan.

PERSONALITY:
- Speak like a knowledgeable, helpful friend — not a robot
- Warm, confident, short replies (2–4 sentences max)
- Ask ONE question at a time to understand the user's need
- Use the user's name if you know it

RESPONSE FORMAT — Return ONLY valid HTML. No markdown. No backtick blocks. No preamble.

Patterns to use:

General / greetings:
<p style="font-size:14px; color:#6b7280; line-height:1.65; margin:0 0 8px;">Warm reply here...</p>
<p style="font-size:14px; color:#1e1f1c; font-weight:500; margin:0;">Your question or CTA here.</p>

Product info with highlights:
<h3 style="font-size:16px; font-weight:700; color:#1e1f1c; margin:0 0 8px;">Product Name</h3>
<p style="font-size:14px; color:#6b7280; line-height:1.65; margin:0 0 8px;">Best-for explanation in 2 sentences...</p>
<p style="font-size:13px; color:#f6a45d; font-weight:600; margin:0;">✔ Key feature &nbsp;&nbsp; ✔ Another feature</p>

ALWAYS highlight product names in green: <strong style="color:#f6a45d;">Product Name</strong>
ALWAYS show prices in gold: <span style="color:#d8a928; font-weight:700;">PKR XXXX</span>

KEY PRODUCTS:
- Laptops → work, gaming, student, business use
- MacBooks → creative work, development, apple ecosystem
- Laptop Accessories → bags, sleeves, stands, cooling pads
- Gaming Accessories → mice, keyboards, headsets, controllers
- Chargers → laptop power adapters, USB-C chargers, universal chargers  
- Keyboards & Mouse → wireless, mechanical, ergonomic options

CONTACT INFORMATION (share when asked):
- Address: Sardri Bazar Charsadda Mardan Road KPK Pakistan | All Pakistan delivery available
- Phone: +92 304 8928282
- Email: info@mmlaptopcenter.com
- Founder: Mudasser Meer

RULES:
- Never dump all products unless asked — ask what problem they want to solve first
- Help customers choose based on their budget, use case, and performance needs
- If buying intent detected → say you'll start the order now
- End every reply with ONE clear question or CTA
- NEVER say "As an AI" or "I cannot"
`;

function isProductQuery(text: string) {
  return /gaming laptop|laptop|macbook|accessories|charger|keyboard|mouse|product|show|list|what do you|recommend|available|price|buy|order|purchase/i.test(
    text
  );
}

// ─── Route ─────────────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const body = reqSchema.parse(await request.json());
    const text = body.message.trim();
    const lower = text.toLowerCase();
    let draftOrder = body.draftOrder || {};

    // ── Order State Machine ──────────────────────────────────────────────────
    if (draftOrder.expectedField === "name") {
      draftOrder = { ...draftOrder, customerName: text, expectedField: "phone" };
      return NextResponse.json({
        reply: `Thanks ${text}! Now please share your phone number.`,
        replyHtml: buildPhoneHtml(text),
        draftOrder,
        intent: "order",
      });
    }

    if (draftOrder.expectedField === "phone") {
      draftOrder = { ...draftOrder, customerPhone: text, expectedField: "address" };
      return NextResponse.json({
        reply: "Got it! Last step — what's your delivery address?",
        replyHtml: buildAddressHtml(draftOrder.customerName || "there"),
        draftOrder,
        intent: "order",
      });
    }

    if (draftOrder.expectedField === "address") {
      draftOrder = { ...draftOrder, customerAddress: text, expectedField: undefined };
      if (draftOrder.productId && draftOrder.customerName && draftOrder.customerPhone) {
        return NextResponse.json({
          reply: "Order placed! Our team will confirm via WhatsApp shortly.",
          replyHtml: buildOrderConfirmHtml(draftOrder),
          draftOrder,
          intent: "order_confirm",
          action: "submit_order",
        });
      }
    }

    // ── Buy Intent ───────────────────────────────────────────────────────────
    const buyIntent = /\b(buy|order|purchase|place order|book|i want|want to order)\b/i.test(lower);

    if (buyIntent) {
      const products = await prisma.product.findMany({
        take: 6,
        orderBy: { updatedAt: "desc" },
        select: {
          id: true, handle: true, title: true, description: true,
          price: true, compareAtPrice: true, tags: true, featuredImage: true,
        },
      });

      const selected =
        products.find((p) => lower.includes(p.title.toLowerCase())) || products[0];

      if (selected) {
        draftOrder = {
          productId: selected.id,
          productTitle: selected.title,
          productPrice: selected.price,
          expectedField: "name",
        };
        return NextResponse.json({
          reply: `Awesome! Let's place your order for ${selected.title}. What's your name?`,
          replyHtml: buildOrderStartHtml(selected.title, selected.price),
          draftOrder,
          intent: "order",
          recommendations: products.map((p) => ({
            id: p.id, variantId: p.id, title: p.title,
            price: String(p.price), image: p.featuredImage,
          })),
        });
      }
    }

    // ── Show/Browse Products ─────────────────────────────────────────────────
    const showProducts =
      /show|list|all product|browse|what.*have|what.*sell/i.test(lower);

    if (showProducts) {
      const products = await prisma.product.findMany({
        take: 6,
        orderBy: { updatedAt: "desc" },
        select: {
          id: true, handle: true, title: true, description: true,
          price: true, compareAtPrice: true, tags: true, featuredImage: true,
        },
      });

      return NextResponse.json({
        reply: "Here are our top products — all quality, all performance!",
        replyHtml: buildProductCards(products, "Here's what we have for you 💻 — latest laptops, MacBooks & accessories:"),
        recommendations: products.map((p) => ({
          id: p.id, variantId: p.id, title: p.title,
          price: String(p.price), image: p.featuredImage,
        })),
        draftOrder,
      });
    }

// ── No API key fallback ──────────────────────────────────────────────────
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        reply: "Ask me about laptops, MacBooks, or accessories!",
        replyHtml: `
          <p style="font-size:14px; color:${C.muted}; line-height:1.65; margin:0 0 8px;">I'm here to help you find the perfect laptop! 💻</p>
          <p style="font-size:14px; color:${C.text}; margin:0;">Ask me about ${hl("Laptops")}, ${hl("MacBooks")}, or our ${hl("Accessories")} — or say <span style="color:${C.gold}; font-weight:600;">"show me products"</span> to browse!</p>`,
        draftOrder,
      });
    }

    // ── AI Conversational Reply ───────────────────────────────────────────────
    let productContext = "";
    let products: ProductRow[] = [];

    if (isProductQuery(lower)) {
      products = await prisma.product.findMany({
        take: 4,
        orderBy: { updatedAt: "desc" },
        select: {
          id: true, handle: true, title: true, description: true,
          price: true, compareAtPrice: true, tags: true, featuredImage: true,
        },
      });
      productContext = products
        .map((p) => `${p.title} — PKR ${p.price}. ${p.description || ""}`)
        .join("\n");
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.55,
      max_tokens: 250,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...(productContext
          ? [
              {
                role: "system" as const,
                content: `Current product catalog:\n${productContext}\n\nProduct cards are rendered separately — you ONLY return the conversational HTML reply. Always highlight product names in <strong style="color:#f6a45d;"> and prices in <span style="color:#d8a928; font-weight:700;">.`,
              },
            ]
          : []),
        ...(body.history || []).slice(-6).map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: text },
      ],
    });

    const aiHtml =
      completion.choices[0]?.message?.content?.trim() ||
      `<p style="font-size:14px; color:${C.muted}; margin:0;">How can I help you today? 😊</p>`;

    const aiWantsProducts =
      /here are|check out|take a look|our products|these products|show you/i.test(aiHtml);

    const replyHtml =
      aiWantsProducts && products.length > 0
        ? aiHtml + buildProductCards(products)
        : aiHtml;

    return NextResponse.json({
      reply: aiHtml.replace(/<[^>]*>/g, ""),
      replyHtml,
      ...(products.length > 0 && {
        recommendations: products.map((p) => ({
          id: p.id, variantId: p.id, title: p.title,
          price: String(p.price), image: p.featuredImage,
        })),
      }),
      draftOrder,
    });
  } catch (error: unknown) {
    console.error("[Chat Route Error]", error);
    return NextResponse.json(
      { error: (error as Error).message || "Chat failed" },
      { status: 500 }
    );
  }
}
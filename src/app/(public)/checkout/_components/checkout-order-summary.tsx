"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "@esmate/shadcn/pkgs/lucide-react";
import { calculateOrderPricing, COD_TAX_RATE } from "@/lib/order-pricing";
import type { PaymentMethod } from "./checkout-types";

type Cart = ReturnType<typeof import("@/lib/commerce").useCart>;

export function CheckoutOrderSummary({ cart, subtotal, paymentMethod }: { cart: Cart; subtotal: number; paymentMethod: PaymentMethod }) {
  const pricing = calculateOrderPricing(subtotal, paymentMethod === "cod");

  return <aside className="h-fit rounded-2xl border border-[#d8a928]/25 bg-white p-5 shadow-sm lg:sticky lg:top-24">
    <h2 className="font-serif text-xl font-extrabold text-[#1a1308]">Your purchase</h2>
    <div className="mt-4 space-y-4">
      {cart.lines.map((line) => <div key={line.id} className="flex gap-3 border-b border-[#d8a928]/15 pb-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#fcf5e8]">
          {line.merchandise.image?.url ? <Image src={line.merchandise.image.url} alt={line.merchandise.image.altText || line.merchandise.product.title} fill sizes="64px" className="object-contain p-1" /> : null}
        </div>
        <div className="min-w-0 flex-1">
          <Link href={`/products/${line.merchandise.product.handle}`} className="line-clamp-2 text-sm font-bold text-[#1a1308] hover:text-[#c86f2d]">{line.merchandise.product.title}</Link>
          <p className="mt-1 text-sm font-extrabold text-[#c86f2d]">Rs. {Number(line.cost.totalAmount.amount).toLocaleString()}</p>
          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="inline-flex items-center rounded-lg border border-[#d8a928]/25 bg-[#fcf5e8]">
              <button type="button" aria-label="Decrease quantity" onClick={() => cart.updateQuantity(line.id, line.quantity - 1)} className="p-1.5 text-[#5A5E55] hover:text-[#1a1308]"><Minus className="h-3.5 w-3.5" /></button>
              <span className="min-w-7 text-center text-xs font-bold">{line.quantity}</span>
              <button type="button" aria-label="Increase quantity" onClick={() => cart.updateQuantity(line.id, line.quantity + 1)} className="p-1.5 text-[#5A5E55] hover:text-[#1a1308]"><Plus className="h-3.5 w-3.5" /></button>
            </div>
            <button type="button" onClick={() => cart.removeLine(line.id)} className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700"><Trash2 className="h-3.5 w-3.5" /> Remove</button>
          </div>
        </div>
      </div>)}
    </div>
    <div className="mt-4 space-y-2 text-sm">
      <div className="flex justify-between text-[#5A5E55]"><span>Subtotal</span><span>Rs. {subtotal.toLocaleString()}</span></div>
      <div className="flex justify-between text-[#5A5E55]"><span>Delivery</span><span className="font-semibold text-green-700">Free</span></div>
      {paymentMethod === "cod" ? <div className="flex justify-between text-[#5A5E55]"><span>COD government tax ({COD_TAX_RATE * 100}%)</span><span>Rs. {pricing.tax.toLocaleString()}</span></div> : null}
      <div className="flex justify-between border-t border-[#d8a928]/20 pt-3 font-serif text-lg font-extrabold text-[#1a1308]"><span>Total</span><span className="text-[#c86f2d]">Rs. {pricing.total.toLocaleString()}</span></div>
    </div>
  </aside>;
}

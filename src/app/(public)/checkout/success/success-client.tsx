"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CheckoutSuccessClient() {
  const sp = useSearchParams();
  const orderNumber = sp.get("orderNumber");

  return (
    <main className="min-h-screen bg-[#fcf5e8] px-6 py-16">
      <div className="mx-auto max-w-xl rounded-2xl border border-[#d8a928]/20 bg-white p-8 text-center">
        <h1 className="text-2xl font-bold text-[#0a0a0a]">Order placed</h1>
        <p className="mt-2 text-sm text-[#5A5E55]">
          Thanks! Your order has been saved and will appear in the admin panel.
        </p>
        {orderNumber ? (
          <p className="mt-4 rounded-lg bg-[#fcf5e8] px-4 py-3 text-sm font-semibold text-[#0a0a0a]">
            Order number: {orderNumber}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/products"
            className="inline-flex justify-center rounded-full bg-[#f6a45d] px-6 py-3 text-sm font-semibold text-white hover:bg-[#d8861f]"
          >
            Continue shopping
          </Link>
          <Link
            href="/"
            className="inline-flex justify-center rounded-full border border-[#d8a928]/25 bg-white px-6 py-3 text-sm font-semibold text-[#0a0a0a] hover:bg-[#fcf5e8]"
          >
            Back home
          </Link>
        </div>
      </div>
    </main>
  );
}


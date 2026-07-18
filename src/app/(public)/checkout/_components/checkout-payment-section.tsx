"use client";

import { useRef, useState } from "react";
import { Banknote, Building2, Smartphone, Upload } from "@esmate/shadcn/pkgs/lucide-react";
import { bankAccount, COD_LIMIT, JAZZCASH_LIMIT, jazzCashAccount, type PaymentMethod } from "./checkout-types";
import { calculateOrderPricing } from "@/lib/order-pricing";

type Props = {
  subtotal: number;
  method: PaymentMethod;
  setMethod: (method: PaymentMethod) => void;
  proofUrl: string;
  setProofUrl: (url: string) => void;
  onProofUploaded: () => void;
};

export function CheckoutPaymentSection({ subtotal, method, setMethod, proofUrl, setProofUrl, onProofUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const codAvailable = calculateOrderPricing(subtotal, true).total <= COD_LIMIT;
  const jazzCashAvailable = calculateOrderPricing(subtotal, false).total <= JAZZCASH_LIMIT;

  async function uploadProof(file: File) {
    setUploadError(null);
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setUploadError("Only JPG, PNG, or WebP screenshots are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Screenshot must be smaller than 5 MB.");
      return;
    }
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/orders/payment-proof", { method: "POST", body });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed");
      setProofUrl(data.url);
      onProofUploaded();
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  const optionClass = (selected: boolean) => `rounded-xl border p-4 text-left transition ${selected ? "border-[#d8861f] bg-[#fcf5e8] ring-2 ring-[#f6a45d]/25" : "border-gray-200"} disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-55`;

  return <section className="rounded-2xl border border-[#d8a928]/25 bg-white p-5">
    <h2 className="font-serif text-xl font-extrabold text-[#1a1308]">Payment method</h2>
    <p className="mt-1 text-sm text-[#5A5E55]">Choose how you want to complete your order.</p>
    <div className="mt-4 grid gap-3 sm:grid-cols-3">
      <button type="button" disabled={!codAvailable} onClick={() => setMethod("cod")} className={optionClass(method === "cod")}><Banknote className="h-5 w-5 text-[#c86f2d]" /><span className="mt-2 block font-bold text-[#1a1308]">Cash on Delivery</span><span className="text-xs text-[#5A5E55]">Up to PKR {COD_LIMIT.toLocaleString()}</span></button>
      <button type="button" onClick={() => setMethod("bank_transfer")} className={optionClass(method === "bank_transfer")}><Building2 className="h-5 w-5 text-[#c86f2d]" /><span className="mt-2 block font-bold text-[#1a1308]">Bank Transfer</span><span className="text-xs text-[#5A5E55]">Transfer or cash deposit</span></button>
      <button type="button" disabled={!jazzCashAvailable} onClick={() => setMethod("jazzcash")} className={optionClass(method === "jazzcash")}><Smartphone className="h-5 w-5 text-[#c86f2d]" /><span className="mt-2 block font-bold text-[#1a1308]">JazzCash</span><span className="text-xs text-[#5A5E55]">Up to PKR {JAZZCASH_LIMIT.toLocaleString()}</span></button>
    </div>

    {subtotal > JAZZCASH_LIMIT ? <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">Orders above PKR {JAZZCASH_LIMIT.toLocaleString()} must be paid by bank transfer or bank cash deposit.</p> : null}
    {!codAvailable ? <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">Cash on Delivery is unavailable above PKR {COD_LIMIT.toLocaleString()}.</p> : null}

    {method === "cod" ? <div className="mt-5 rounded-xl bg-[#fcf5e8] p-4 text-sm text-[#5A5E55]"><p className="font-bold text-[#1a1308]">Cash on Delivery instructions</p><p className="mt-1">Delivery is free. Pay the courier in cash when your order arrives; a 4% government COD tax applies.</p></div> : null}

    {method !== "cod" ? <div className="mt-5 space-y-4 border-t border-[#d8a928]/15 pt-5">
      {method === "bank_transfer" ? <div className="rounded-xl bg-[#fcf5e8] p-4 text-sm">
        <p className="font-bold text-[#1a1308]">Bank transfer / cash deposit instructions</p>
        <dl className="mt-3 grid gap-2 text-[#5A5E55] sm:grid-cols-[130px_1fr]"><dt className="font-semibold text-[#1a1308]">Bank</dt><dd>{bankAccount.bank}</dd><dt className="font-semibold text-[#1a1308]">Account Title</dt><dd>{bankAccount.title}</dd><dt className="font-semibold text-[#1a1308]">IBAN</dt><dd className="break-all">{bankAccount.iban}</dd><dt className="font-semibold text-[#1a1308]">Account Number</dt><dd>{bankAccount.number}</dd></dl>
        <p className="mt-3 text-xs text-[#5A5E55]">Transfer the full order amount online or deposit cash at an HBL branch, then upload the receipt below.</p>
      </div> : <div className="rounded-xl bg-[#fcf5e8] p-4 text-sm">
        <p className="font-bold text-[#1a1308]">JazzCash instructions</p>
        <dl className="mt-3 grid gap-2 text-[#5A5E55] sm:grid-cols-[130px_1fr]"><dt className="font-semibold text-[#1a1308]">Account Title</dt><dd>{jazzCashAccount.title}</dd><dt className="font-semibold text-[#1a1308]">Number</dt><dd>{jazzCashAccount.number}</dd></dl>
        <p className="mt-3 text-xs text-[#5A5E55]">Send the full amount (maximum PKR {JAZZCASH_LIMIT.toLocaleString()}), then enter the transaction ID and upload the payment screenshot below.</p>
      </div>}
      <div><input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadProof(file); event.target.value = ""; }} /><button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="inline-flex items-center gap-2 rounded-lg border border-[#d8a928]/30 bg-white px-4 py-2.5 text-sm font-bold text-[#1a1308] hover:bg-[#fcf5e8] disabled:opacity-60"><Upload className="h-4 w-4" />{uploading ? "Uploading..." : proofUrl ? "Replace payment screenshot" : "Upload payment screenshot"}</button><p className="mt-2 text-xs text-[#5A5E55]">Required. JPG, PNG, or WebP; maximum 5 MB.</p>{uploadError ? <p className="mt-1 text-xs font-semibold text-red-700">{uploadError}</p> : null}{proofUrl ? <p className="mt-1 text-xs font-semibold text-green-700">Screenshot uploaded successfully. Admin will verify it.</p> : null}</div>
    </div> : null}
  </section>;
}

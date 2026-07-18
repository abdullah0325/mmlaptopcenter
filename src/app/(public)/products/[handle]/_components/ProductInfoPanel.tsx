"use client";

import { FaWhatsapp } from "react-icons/fa";
import { contact as trackContact } from "@/lib/pixel";
import { Badge } from "@esmate/shadcn/components/ui/badge";
import { Button } from "@esmate/shadcn/components/ui/button";
import { Label } from "@esmate/shadcn/components/ui/label";
import {
  CheckCircle,
  Flame,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
  Zap,
} from "@esmate/shadcn/pkgs/lucide-react";
import { formatMoney, type PriceBlock, type ReviewStats } from "./product-page-utils";

type VariantOption = {
  name: string;
  values: Array<{ value: string; selected?: boolean; disabled?: boolean }>;
};

type ProductInfoPanelProps = {
  title: string;
  priceBlock: PriceBlock | null;
  reviewStats: ReviewStats;
  inventory: number | null;
  sku?: string | null;
  specifications?: Record<string, string>;
  availableForSale: boolean;
  options: VariantOption[];
  selectOption: (name: string, value: string) => void;
  quantity: number;
  changeQuantity: (amount: number) => void;
  selectedLabel: string;
  buyLoading: boolean;
  onAddToCart: () => Promise<void>;
  onBuyNow: () => Promise<void>;
  whatsAppHref: string;
};

export function ProductInfoPanel({
  title,
  priceBlock,
  reviewStats,
  inventory,
  sku,
  specifications = {},
  availableForSale,
  options,
  selectOption,
  quantity,
  changeQuantity,
  selectedLabel,
  buyLoading,
  onAddToCart,
  onBuyNow,
  whatsAppHref,
}: ProductInfoPanelProps) {
  const limitedStock = inventory === null ? 7 : Math.max(1, Math.min(inventory, 9));
  const viewerCount = 18 + (title.length % 24);
  const titleSizeClass =
    title.length > 80
      ? "text-lg sm:text-xl lg:text-[1.35rem]"
      : title.length > 55
        ? "text-xl sm:text-[1.35rem] lg:text-[1.55rem]"
        : title.length > 32
          ? "text-2xl sm:text-[1.7rem] lg:text-[1.95rem]"
          : "text-2xl sm:text-3xl lg:text-[2.2rem]";

  return (
    <aside className="h-full min-w-0 overflow-hidden rounded-2xl border border-orange-200/80 bg-[linear-gradient(135deg,rgba(255,247,237,0.96),rgba(255,255,255,0.92))] px-3 pb-4 pt-3.5 shadow-[0_18px_45px_rgba(26,19,8,0.08)] sm:min-h-[32rem] sm:px-4 sm:pb-5 sm:pt-4 lg:min-h-[36rem]">
      <div className="flex h-full min-w-0 flex-col gap-2.5 sm:overflow-y-auto sm:pr-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge className="rounded-full bg-[#12372a] px-2.5 py-0.5 text-[11px] text-white hover:bg-[#12372a]">
            In Stock
          </Badge>
          <Badge variant="outline" className="rounded-full border-orange-300/80 bg-white/70 px-2.5 py-0.5 text-[11px] font-bold text-orange-700 shadow-sm">
            <Flame className="mr-1 h-3 w-3" />
            Selling fast
          </Badge>
          <span className="rounded-full border border-orange-200 bg-white/60 px-2.5 py-0.5 text-[11px] font-bold text-[#5A5E55]">
            {viewerCount} viewing now
          </span>
        </div>

        <div className="flex min-h-0 flex-1 items-center py-1">
          <h1 className={`break-words font-serif font-extrabold leading-tight tracking-normal text-gray-950 ${titleSizeClass}`}>
            {title}
          </h1>
        </div>

        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-700 sm:text-sm">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= Math.round(reviewStats.averageRating)
                      ? "fill-[#d8a928] text-[#d8a928]"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="font-bold text-gray-950">{reviewStats.averageRating.toFixed(1)}</span>
            <span>{reviewStats.totalReviews} reviews</span>
          </div>

          {priceBlock && (
            <div className="rounded-xl bg-white/65 p-2.5 shadow-sm ring-1 ring-orange-100/80">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-end gap-x-2 gap-y-1">
                    {priceBlock.hasDiscount && priceBlock.compareAt ? (
                      <span className="pb-0.5 text-xs font-semibold text-gray-500 line-through">
                        {formatMoney(priceBlock.compareAt, priceBlock.displayPrice.currencyCode)}
                      </span>
                    ) : null}
                    <span className="text-2xl font-extrabold leading-none text-orange-600 sm:text-[1.7rem]">
                      {formatMoney(priceBlock.displayPrice.amount, priceBlock.displayPrice.currencyCode)}
                    </span>
                    {priceBlock.hasDiscount ? (
                      <Badge className="rounded-full bg-orange-500 px-2 py-0.5 text-[11px] text-white hover:bg-orange-500">
                        {priceBlock.savedPct}% OFF
                      </Badge>
                    ) : null}
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-gray-700">
                    <span className="rounded-full bg-orange-50 px-2 py-0.5 text-orange-700">Only {limitedStock} left</span>
                    <span className="rounded-full bg-orange-50 px-2 py-0.5 text-orange-700">Ends in 02:14:36</span>
                  </div>
                </div>

                <div className="shrink-0">
                  <Label className="sr-only">Quantity</Label>
                  <div className="flex items-center rounded-full border border-orange-200 bg-white p-0.5">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => changeQuantity(-1)}
                      disabled={quantity <= 1}
                      className="h-7 w-7 rounded-full"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </Button>
                    <span className="w-8 text-center text-sm font-bold text-gray-950">{quantity}</span>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => changeQuantity(1)}
                      className="h-7 w-7 rounded-full"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <span className="mt-1 block text-center text-[10px] font-bold uppercase tracking-wide text-gray-500">
                    Qty
                  </span>
                </div>
              </div>
            </div>
          )}

          {options.length > 0 || sku ? (
            <div className="space-y-2.5 rounded-xl bg-white/65 p-2.5 shadow-sm ring-1 ring-orange-100/80">
            <div className="flex items-center justify-between"><h2 className="text-sm font-extrabold text-gray-950">Variants</h2>{sku ? <span className="text-[11px] font-semibold text-gray-500">SKU: {sku}</span> : null}</div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
            {options.map((option) => (
              <div key={option.name} className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-wide text-gray-600">{option.name}</Label>
                <select value={option.values.find((value) => value.selected)?.value || ""} onChange={(event) => selectOption(option.name, event.target.value)} className="h-9 w-full rounded-lg border border-orange-200 bg-white px-2 text-xs font-semibold text-gray-950 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200">
                  <option value="">Any</option>
                  {option.values.map((value) => <option key={value.value} value={value.value} disabled={value.disabled}>{option.name === "Price" ? formatMoney(value.value, priceBlock?.displayPrice.currencyCode || "PKR") : value.value}</option>)}
                </select>
              </div>
            ))}
            </div>
            {selectedLabel ? <p className="truncate text-[11px] font-semibold text-gray-500">Selected: {selectedLabel}</p> : <p className="text-[11px] font-semibold text-gray-500">Main product selected. Choose a filter only if you want a variant.</p>}
            </div>
          ) : null}
          {Object.keys(specifications).length ? <div className="flex flex-wrap gap-1.5">{Object.entries(specifications).map(([name, value]) => <span key={name} className="rounded-full bg-orange-50 px-2 py-1 text-[11px] font-semibold text-orange-800">{name}: {value}</span>)}</div> : null}
        </div>

        <div className="space-y-2.5 pt-1">
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            <Button onClick={onAddToCart} disabled={!availableForSale} className="h-10 min-w-0 rounded-md bg-orange-500 px-0.5 text-[9px] font-bold text-white shadow-[0_10px_22px_rgba(249,115,22,0.2)] hover:bg-orange-600 min-[360px]:px-1 min-[360px]:text-[10px] sm:px-2 sm:text-xs">
              <ShoppingCart className="mr-0.5 h-3 w-3 shrink-0 min-[360px]:mr-1 min-[360px]:h-3.5 min-[360px]:w-3.5 sm:h-4 sm:w-4" />
              Add Cart
            </Button>
            <Button onClick={onBuyNow} disabled={buyLoading || !availableForSale} className="h-10 min-w-0 rounded-md bg-[#1a1308] px-0.5 text-[9px] font-bold text-white hover:bg-[#2a2118] min-[360px]:px-1 min-[360px]:text-[10px] sm:px-2 sm:text-xs">
              <Zap className="mr-0.5 h-3 w-3 shrink-0 min-[360px]:mr-1 min-[360px]:h-3.5 min-[360px]:w-3.5 sm:h-4 sm:w-4" />
              {buyLoading ? "Processing" : "Buy Now"}
            </Button>
            <a
              href={whatsAppHref}
              onClick={() => trackContact("WhatsApp product order")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 min-w-0 items-center justify-center whitespace-nowrap rounded-md bg-[#25D366] px-0.5 text-[9px] font-bold text-white transition hover:bg-[#1fb855] min-[360px]:px-1 min-[360px]:text-[10px] sm:px-2 sm:text-xs"
            >
              <FaWhatsapp className="mr-0.5 h-3 w-3 shrink-0 min-[360px]:mr-1 min-[360px]:h-3.5 min-[360px]:w-3.5 sm:h-4 sm:w-4" />
              WhatsApp
            </a>
          </div>

          <div className="grid grid-cols-3 gap-2 border-t border-orange-200/80 pt-2.5">
            {[
              { icon: Truck, label: "Fast Delivery", text: "All Pakistan" },
              { icon: ShieldCheck, label: "Warranty", text: "Genuine support" },
              { icon: CheckCircle, label: "Verified", text: "Quality checked" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <item.icon className="mx-auto h-3.5 w-3.5 text-orange-600" />
                <div className="mt-0.5 text-[10px] font-bold text-gray-950 sm:text-[11px]">{item.label}</div>
                <div className="text-[10px] text-gray-600">{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

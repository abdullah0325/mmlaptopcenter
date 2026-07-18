"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const FALLBACK_IMAGE = "/logo/mmlaptop.png";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ColorOption {
  hex: string;
}

interface Price {
  amount: string;
  currencyCode: string;
}

export interface StoreProductCardProps {
  handle: string;
  productId: string;
  title: string;
  subtitle?: string;
  featuredImageUrl: string;
  price: Price;
  compareAtPrice?: Price | null;
  tag?: string;            // e.g. "NEW ARRIVAL", "100+ WATCH FACE"
  rating?: number;         // e.g. 4.87
  colors?: ColorOption[];  // color swatches
  extraColorCount?: number; // e.g. 2 (shown as "+2")
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function discountPercent(compare: string, current: string): number | null {
  const c = parseFloat(compare);
  const p = parseFloat(current);
  if (!c || !p || c <= p) return null;
  return Math.round(((c - p) / c) * 100);
}

function formatPrice(amount: string, _currency: string) {
  const n = parseFloat(amount);
  return `Rs.${n.toLocaleString("en-PK")}`;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function StoreProductCard({
  handle,
  title,
  subtitle,
  featuredImageUrl,
  price,
  compareAtPrice,
  tag,
  rating,
  colors = [],
  extraColorCount = 0,
}: StoreProductCardProps) {
  const [imgSrc, setImgSrc] = useState(featuredImageUrl || FALLBACK_IMAGE);

  const discount = compareAtPrice
    ? discountPercent(compareAtPrice.amount, price.amount)
    : null;

  return (
    <div className="group relative flex flex-col rounded-2xl bg-[#f5f5f5] overflow-hidden transition-shadow hover:shadow-md">

      {/* ── Tag badge ── */}
      {/* ── Product image ── */}
      {discount !== null && (
        <span className="absolute right-3 top-3 z-20 rounded-full bg-[#8b1a1a] px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-white shadow-lg">
          {discount}% OFF
        </span>
      )}

      <Link href={`/products/${handle}`} className="block relative aspect-square w-full overflow-hidden bg-[#f5f5f5]">
        <Image
          src={imgSrc}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          onError={() => setImgSrc(FALLBACK_IMAGE)}
        />
      </Link>

      {/* ── Card body ── */}
      <div className="flex flex-col gap-1 px-4 pt-3 pb-4">

        {/* Title + discount */}
        <div className="flex items-start justify-between gap-2">
          <Link href={`/products/${handle}`}>
            <h3 className="text-base font-bold text-[#0a0a0a] leading-tight hover:underline">
              {title}
            </h3>
          </Link>
        </div>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-xs text-gray-500 truncate">{subtitle}</p>
        )}

        {/* Color swatches + rating */}
        <div className="flex items-center justify-between mt-1">
          {/* Swatches */}
          {colors.length > 0 && (
            <div className="flex items-center gap-1">
              {colors.map((c, i) => (
                <span
                  key={i}
                  className="h-4 w-4 rounded-full border border-white shadow-sm ring-1 ring-gray-200"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
              {extraColorCount > 0 && (
                <span className="text-[11px] text-gray-500 font-medium ml-0.5">
                  +{extraColorCount}
                </span>
              )}
            </div>
          )}

          {/* Rating */}
          {rating !== undefined && (
            <div className="flex items-center gap-1 ml-auto">
              <span className="text-yellow-400 text-sm">★</span>
              <span className="text-xs font-semibold text-[#0a0a0a]">{rating.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Prices + Buy button */}
        <div className="flex items-center justify-between mt-2 gap-2">
          <div className="flex flex-col leading-tight">
            {compareAtPrice && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}
              </span>
            )}
            <span className="text-base font-extrabold text-[#0a0a0a]">
              {formatPrice(price.amount, price.currencyCode)}
            </span>
          </div>

          <Link
            href={`/products/${handle}`}
            className="rounded-full bg-[#8b1a1a] px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-[#a52020] active:scale-95 whitespace-nowrap"
          >
            Buy Now
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";

interface ProductDetail {
  id: string;
  title: string;
  description: string;
  image?: string;
}

interface ProductDetailsSliderProps {
  details: ProductDetail[];
}

export function ProductDetailsSlider({ details }: ProductDetailsSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showArrows, setShowArrows] = useState(false);

  if (!details || details.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      <div className="flex items-center gap-2 mb-4">
        <Info className="h-5 w-5 text-[#f6a45d]" />
        <h2 className="text-lg font-bold text-[#0a0a0a]">Product Details</h2>
      </div>

      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-[#d8a928]/30 rounded-full p-2 shadow-lg transition-all duration-300 hover:bg-[#f6a45d] hover:text-white hover:border-[#f6a45d] ${
            showArrows ? "opacity-100" : "opacity-0"
          }`}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {details.map((detail) => (
            <div
              key={detail.id}
              className="flex-shrink-0 w-64 md:w-72 rounded-xl border border-[#d8a928]/20 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              {detail.image && (
                <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden bg-[#fcf5e8]">
                  <Image
                    src={detail.image}
                    alt={detail.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <h3 className="font-semibold text-[#0a0a0a] mb-2">{detail.title}</h3>
              <p className="text-sm text-[#5A5E55]">{detail.description}</p>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-[#d8a928]/30 rounded-full p-2 shadow-lg transition-all duration-300 hover:bg-[#f6a45d] hover:text-white hover:border-[#f6a45d] ${
            showArrows ? "opacity-100" : "opacity-0"
          }`}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
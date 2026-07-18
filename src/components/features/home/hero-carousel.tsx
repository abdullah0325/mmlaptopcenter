"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HeroSlide } from "@/types/hero";

interface HeroCarouselProps {
  slides: HeroSlide[];
}

const AUTOPLAY_MS = 6000;

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (slides.length === 0) return;

    if (active >= slides.length) {
      setActive(0);
    }
  }, [active, slides.length]);

  const goTo = useCallback(
    (index: number) => {
      if (slides.length === 0) return;

      setActive(((index % slides.length) + slides.length) % slides.length);
    },
    [slides.length],
  );

  const next = useCallback(() => {
    if (slides.length <= 1) return;

    setActive((current) => (current + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    if (slides.length <= 1) return;

    setActive((current) => (current - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;

    const timer = window.setTimeout(next, AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [active, isPaused, next, slides.length]);

  if (slides.length === 0) return null;

  return (
    <section
      aria-label="Featured collections"
      aria-roledescription="carousel"
      className="relative h-[clamp(460px,calc(100dvh-88px),600px)] w-full overflow-hidden bg-slate-100"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      {slides.map((slide, index) => {
        const isActive = index === active;
        const hasMobileImage = Boolean(slide.mobileImageUrl);

        return (
          <div
            key={slide.id}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "z-0 opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <Image
              src={slide.imageUrl}
              alt={slide.imageAlt}
              fill
              priority={index === 0}
              sizes="100vw"
              className={`hero-desktop-image object-cover object-right ${
                hasMobileImage ? "has-mobile-hero-image" : ""
              } ${
                isActive ? "hero-image-zoom" : ""
              }`}
            />
            {slide.mobileImageUrl && (
              <Image
                src={slide.mobileImageUrl}
                alt={slide.imageAlt}
                fill
                priority={index === 0}
                sizes="100vw"
                className={`hero-mobile-image object-cover object-right ${
                  isActive ? "hero-image-zoom" : ""
                }`}
              />
            )}
          </div>
        );
      })}

      <div className="pointer-events-none absolute inset-0 z-[1] bg-orange-50/10" />
      <div className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(90deg,rgba(255,247,237,0.82)_0%,rgba(255,247,237,0.62)_34%,rgba(255,247,237,0.28)_58%,rgba(255,255,255,0.04)_76%,transparent_100%)]" />

      <div className="absolute inset-0 z-10">
        {slides.map((slide, index) => {
          const isActive = index === active;

          return (
            <div
              key={slide.id}
              aria-hidden={!isActive}
              className={`absolute inset-0 flex items-center px-5 py-10 transition-all duration-700 ease-out sm:px-8 sm:py-12 md:px-12 lg:px-16 xl:px-20 ${
                isActive
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-5 opacity-0"
              }`}
            >
              <div className="w-full max-w-xl">
                {slide.eyebrow && (
                  <span className="mb-4 inline-flex items-center rounded-full border border-orange-300/80 bg-white/70 px-4 py-1.5 text-xs font-bold uppercase tracking-normal text-orange-700 shadow-sm backdrop-blur-sm">
                    {slide.eyebrow}
                  </span>
                )}

                <h1 className="max-w-xl font-serif text-4xl font-extrabold leading-tight tracking-normal text-gray-950 sm:text-5xl lg:text-6xl">
                  <span>{slide.title}</span>
                  {slide.titleHighlight && (
                    <span className="block text-[#ea580c]">
                      {slide.titleHighlight}
                    </span>
                  )}
                </h1>

                {slide.description && (
                  <p className="mt-5 max-w-lg text-base font-medium leading-7 text-gray-700 sm:text-lg">
                    {slide.description}
                  </p>
                )}

                {(slide.ctaPrimaryLabel || slide.ctaSecondaryLabel) && (
                  <div className="mt-7 flex flex-nowrap items-center gap-2 sm:gap-3">
                    {slide.ctaPrimaryLabel && (
                      <Link
                        href={slide.ctaPrimaryHref || "#"}
                        tabIndex={isActive ? 0 : -1}
                        className="group inline-flex min-h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-md bg-orange-500 px-3 text-xs font-bold text-white shadow-[0_14px_30px_rgba(249,115,22,0.28)] transition-all duration-300 hover:-translate-y-1 hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300 sm:min-h-12 sm:gap-2 sm:px-6 sm:text-sm"
                      >
                        {slide.ctaPrimaryLabel}
                        <span
                          aria-hidden="true"
                          className="text-base leading-none transition-transform duration-300 group-hover:translate-x-1 sm:text-xl"
                        >
                          -&gt;
                        </span>
                      </Link>
                    )}

                    {slide.ctaSecondaryLabel && (
                      <Link
                        href={slide.ctaSecondaryHref || "#"}
                        tabIndex={isActive ? 0 : -1}
                        className="inline-flex min-h-10 items-center justify-center whitespace-nowrap rounded-md border border-orange-200 bg-white/75 px-3 text-xs font-bold text-slate-800 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300 sm:min-h-12 sm:px-6 sm:text-sm"
                      >
                        {slide.ctaSecondaryLabel}
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            className="group absolute left-0 top-1/2 z-30 flex h-16 w-10 -translate-y-1/2 items-center justify-center rounded-r-xl bg-black/10 text-white transition-all duration-300 hover:bg-black/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300 sm:h-20 sm:w-12 lg:h-24 lg:w-14"
          >
            <ChevronLeft className="h-6 w-6 transition-transform duration-300 group-hover:-translate-x-1 sm:h-7 sm:w-7 lg:h-8 lg:w-8" />
          </button>

          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="group absolute right-0 top-1/2 z-30 flex h-16 w-10 -translate-y-1/2 items-center justify-center rounded-l-xl bg-black/10 text-white transition-all duration-300 hover:bg-black/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300 sm:h-20 sm:w-12 lg:h-24 lg:w-14"
          >
            <ChevronRight className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-1 sm:h-7 sm:w-7 lg:h-8 lg:w-8" />
          </button>
        </>
      )}

      {slides.length > 1 && (
        <div
          role="tablist"
          aria-label="Hero slides"
          className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 sm:bottom-7 sm:gap-3"
        >
          {slides.map((slide, index) => {
            const isActive = index === active;

            return (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-label={`Go to slide ${index + 1}`}
                aria-selected={isActive}
                onClick={() => goTo(index)}
                className={`h-2 rounded-full shadow-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300 sm:h-2.5 ${
                  isActive
                    ? "w-12 bg-orange-500 sm:w-16"
                    : "w-8 bg-white/70 hover:bg-white sm:w-11"
                }`}
              />
            );
          })}
        </div>
      )}

      <style jsx global>{`
        @keyframes hero-image-ken-burns {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(1.08);
          }
        }

        .hero-image-zoom {
          animation: hero-image-ken-burns 7s ease-out forwards;
        }

        .hero-mobile-image {
          display: none;
        }

        @media (max-width: 767px) and (orientation: portrait) {
          .hero-desktop-image.has-mobile-hero-image {
            display: none;
          }

          .hero-mobile-image {
            display: block;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-image-zoom {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}

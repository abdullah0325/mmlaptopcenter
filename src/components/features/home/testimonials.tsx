"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";

const testimonials = [
  {
    name: "Ahmed Raza",
    role: "Software Developer – Lahore",
    text: "Bought an ASUS ROG Strix from MM Laptop Center. Runs every game at max settings. Genuine product with full warranty!",
  },
  {
    name: "Ayesha Siddiqua",
    role: "University Student – Karachi",
    text: "Got my MacBook Air M2 here at a great price. Lightweight, fast, and the team helped me pick the right specs.",
  },
  {
    name: "Dr. Usman Malik",
    role: "Clinic Owner – Islamabad",
    text: "Ordered 5 Dell business laptops for our clinic. All arrived configured and ready. Excellent bulk order support.",
  },
  {
    name: "Fatima Noor",
    role: "Graphic Designer – Faisalabad",
    text: "The Dell XPS 15 display is stunning for my design work. MM Laptop Center delivered exactly what I needed.",
  },
  {
    name: "Muhammad Bilal",
    role: "Esports Player – Multan",
    text: "Best gaming laptop shop in Pakistan. Got my MSI Katana with RTX 4050 — smooth 144Hz gaming every day.",
  },
  {
    name: "Hassan Ali",
    role: "Freelancer – Rawalpindi",
    text: "Picked up a ThinkPad X1 Carbon and a Logitech mouse. Professional service and competitive pricing.",
  },
  {
    name: "Sana Tariq",
    role: "Teacher – Peshawar",
    text: "Affordable HP Pavilion for online teaching. Battery lasts all day and the screen is crisp and clear.",
  },
  {
    name: "Imran Shah",
    role: "IT Manager – Quetta",
    text: "We source all our office laptops from MM Laptop Center. Reliable, genuine, and always responsive.",
  },
];

const Testimonials = () => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const move = (direction: 1 | -1) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const firstCard = carousel.firstElementChild as HTMLElement | null;
    const distance = (firstCard?.offsetWidth ?? carousel.clientWidth) + 24;
    const reachedEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 4;
    const reachedStart = carousel.scrollLeft <= 4;

    if (direction === 1 && reachedEnd) {
      carousel.scrollTo({ left: 0, behavior: "smooth" });
    } else if (direction === -1 && reachedStart) {
      carousel.scrollTo({ left: carousel.scrollWidth, behavior: "smooth" });
    } else {
      carousel.scrollBy({ left: distance * direction, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const timer = window.setInterval(() => move(1), 4000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    
    <div className="relative">
      <button
        onClick={() => move(-1)}
        className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-[#fcf5e8] p-2 shadow-md hover:bg-[#f6a45d] hover:text-white transition hidden md:block"
        aria-label="Previous"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div
        ref={carouselRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {testimonials.map((t, i) => (
          <article key={i} className="min-w-full snap-start sm:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)]">
            <div className="rounded-xl border border-[#d8a928]/20 bg-[#f4f1e8] p-6 h-full">
              <div className="flex gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <span key={j} className="text-[#d8a928] text-lg">★</span>
                ))}
              </div>
              <p className="text-[#5A5E55] mb-4 text-sm leading-relaxed">&quot;{t.text}&quot;</p>
              <p className="font-semibold text-[#0a0a0a]">{t.name}</p>
              <p className="text-xs text-[#5A5E55]">{t.role}</p>
            </div>
          </article>
        ))}
      </div>

      <button
        onClick={() => move(1)}
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-[#fcf5e8] p-2 shadow-md hover:bg-[#f6a45d] hover:text-white transition hidden md:block"
        aria-label="Next"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Testimonials;

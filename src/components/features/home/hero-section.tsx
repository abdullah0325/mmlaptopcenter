import { getActiveHeroSlides } from "@/lib/hero-service";
import HeroCarousel from "@/components/features/home/hero-carousel";

export const dynamic = "force-dynamic";

export default async function HeroSection() {
  const slides = await getActiveHeroSlides();

  if (slides.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full overflow-hidden bg-slate-100">
      <HeroCarousel slides={slides} />
    </div>
  );
}

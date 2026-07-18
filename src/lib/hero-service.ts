import { prisma } from "@/lib/prisma";
import { HeroSlide } from "@/types/hero";
import staticHeroSlides from "../../data/hero-slides.json";

type HeroSlideInput = Omit<HeroSlide, "id" | "order">;
type HeroSlideUpdate = Partial<Omit<HeroSlide, "id">>;

function toHeroSlide(slide: any): HeroSlide {
  return {
    id: slide.id,
    imageUrl: slide.imageUrl,
    mobileImageUrl: slide.mobileImageUrl ?? undefined,
    imageAlt: slide.imageAlt,
    eyebrow: slide.eyebrow,
    title: slide.title,
    titleHighlight: slide.titleHighlight,
    description: slide.description,
    ctaPrimaryLabel: slide.ctaPrimaryLabel ?? undefined,
    ctaPrimaryHref: slide.ctaPrimaryHref ?? undefined,
    ctaSecondaryLabel: slide.ctaSecondaryLabel ?? undefined,
    ctaSecondaryHref: slide.ctaSecondaryHref ?? undefined,
    isActive: slide.isActive,
    order: slide.order,
  };
}

export function getStaticHeroSlides(): HeroSlide[] {
  return staticHeroSlides
    .filter((slide) => slide.isActive)
    .sort((a, b) => a.order - b.order)
    .map(toHeroSlide);
}

export async function getActiveHeroSlides(): Promise<HeroSlide[]> {
  try {
    const slides = await prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    return slides.length > 0 ? slides.map(toHeroSlide) : getStaticHeroSlides();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.warn(`Using static hero slides: ${message}`);
    return getStaticHeroSlides();
  }
}

export async function getAllHeroSlides(): Promise<HeroSlide[]> {
  const slides = await prisma.heroSlide.findMany({
    orderBy: { order: "asc" },
  });
  return slides.map(toHeroSlide);
}

export async function createHeroSlide(slide: HeroSlideInput): Promise<HeroSlide> {
  const maxSlide = await prisma.heroSlide.findFirst({
    orderBy: { order: "desc" },
    select: { order: true },
  });
  const created = await prisma.heroSlide.create({
    data: { ...slide, order: (maxSlide?.order ?? 0) + 1 },
  });
  return toHeroSlide(created);
}

export async function updateHeroSlide(
  id: string,
  data: HeroSlideUpdate,
): Promise<HeroSlide | null> {
  try {
    const updated = await prisma.heroSlide.update({
      where: { id },
      data,
    });
    return toHeroSlide(updated);
  } catch (error: any) {
    if (error?.code === "P2025") return null;
    throw error;
  }
}

export async function deleteHeroSlide(id: string): Promise<boolean> {
  try {
    await prisma.heroSlide.delete({ where: { id } });
    return true;
  } catch (error: any) {
    if (error?.code === "P2025") return false;
    throw error;
  }
}

export async function reorderHeroSlides(orderedIds: string[]): Promise<HeroSlide[]> {
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.heroSlide.update({
        where: { id },
        data: { order: index + 1 },
      }),
    ),
  );
  return getAllHeroSlides();
}

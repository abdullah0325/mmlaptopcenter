export interface HeroSlide {
  id: string;
  imageUrl: string;
  mobileImageUrl?: string | null;
  imageAlt: string;
  eyebrow: string;
  title: string;
  titleHighlight: string;
  description: string;
  ctaPrimaryLabel?: string;
  ctaPrimaryHref?: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryHref?: string;
  isActive: boolean;
  order: number;
}

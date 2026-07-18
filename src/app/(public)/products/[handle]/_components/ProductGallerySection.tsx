import Image from "next/image";
import { Badge } from "@esmate/shadcn/components/ui/badge";
import { Button } from "@esmate/shadcn/components/ui/button";
import { Skeleton } from "@esmate/shadcn/components/ui/skeleton";
import { Heart } from "@esmate/shadcn/pkgs/lucide-react";

type GalleryImage = {
  id: string;
  url: string;
  altText: string | null;
  width: number;
  height: number;
};

type ProductGallerySectionProps = {
  title: string;
  images: GalleryImage[];
  currentImage: GalleryImage | null;
  onSelectImage: (image: GalleryImage) => void;
  onToggleWishlist: () => void;
  wishlistActive: boolean;
  discountBadge?: { hasDiscount: boolean; savedPct: number } | null;
};

export function ProductGallerySection({
  title,
  images,
  currentImage,
  onSelectImage,
  onToggleWishlist,
  wishlistActive,
  discountBadge,
}: ProductGallerySectionProps) {
  return (
    <div className="h-full min-w-0 space-y-4 rounded-2xl border border-orange-100/80 bg-white/45 p-2 sm:p-4">
      <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-xl border border-[#d8a928]/20 bg-[#f4f1e8] shadow-md">
        <div className="absolute inset-0 bg-[#f4f1e8]" />
        {currentImage ? (
          <>
            <Image
              src={currentImage.url}
              alt={currentImage.altText || title}
              fill
              priority
              className="object-contain p-2 transition-transform duration-300 hover:scale-[1.03] sm:p-4"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/10 via-transparent to-black/5" />
          </>
        ) : (
          <Skeleton className="h-full w-full" />
        )}

        <Button
          size="icon"
          variant="secondary"
          className="absolute right-3 top-3 h-8 w-8 bg-white/90 shadow-md backdrop-blur-sm hover:bg-white"
          onClick={onToggleWishlist}
        >
          <Heart className={`h-4 w-4 ${wishlistActive ? "fill-[#d8a928] text-[#d8a928]" : "text-[#0a0a0a]"}`} />
        </Button>

        {discountBadge?.hasDiscount && (
          <div className="absolute left-3 top-3">
            <Badge className="bg-[#d8a928] px-2 py-1 text-xs font-semibold text-[#0a0a0a] shadow">
              -{discountBadge.savedPct}%
            </Badge>
          </div>
        )}
      </div>

      <div className="w-full overflow-x-auto px-0.5">
        <div className="flex w-max min-w-full max-w-md justify-start gap-2 pb-2 sm:mx-auto">
          {images.map((img) => (
            <button
              key={img.id}
              onClick={() => onSelectImage(img)}
              className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 bg-[#f4f1e8] sm:h-16 sm:w-16 ${
                img.id === currentImage?.id
                  ? "border-[#f6a45d] ring-2 ring-[#f6a45d] ring-offset-1"
                  : "border-transparent hover:border-[#f6a45d]/40"
              }`}
            >
              <Image src={img.url} alt="" fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

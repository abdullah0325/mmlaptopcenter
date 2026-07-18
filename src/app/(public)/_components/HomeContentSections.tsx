import { CategoriesSection, CollectionsSection, ProductsSection } from "@/components/features/home/products-section";
import { WhyChooseUsSection } from "@/components/features/home/why-choose-us";
import { FeaturedBlogSection } from "@/components/features/home/featured-blog-section";
import { CustomerVoicesSection } from "@/components/features/home/customer-voices-section";
import { FeaturedVideoSection } from "@/components/features/videos/featured-video-section";
import type { PublicVideo } from "@/lib/video-utils";

type HomeContentSectionsProps = {
  categories: Array<{ id: string; name: string; slug: string; image: string | null; parentId?: string | null; order?: number }>;
  products: Array<any>;
  collections: Array<{ id: string; handle: string; title: string; image: string | null; isFeatured?: boolean; productHandles?: string[] }>;
  featuredBlogs: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    featuredImage?: string | null;
    publishedAt?: Date | string | null;
    content?: string | null;
  }>;
  homeVideos: PublicVideo[];
};

export function HomeContentSections({
  categories,
  products,
  collections,
  featuredBlogs,
  homeVideos,
}: HomeContentSectionsProps) {
  return (
    <>
      <CategoriesSection categories={categories} />
      <ProductsSection categories={categories} products={products} collections={collections} />
      <FeaturedVideoSection
        videos={homeVideos}
        heading="See the latest from MM Laptop Center"
        description="Watch featured laptop showcases, buying advice, and shop updates selected by the admin team."
      />
      <CollectionsSection collections={collections} />
      <WhyChooseUsSection />
      <FeaturedBlogSection articles={featuredBlogs} />
      <CustomerVoicesSection />
    </>
  );
}

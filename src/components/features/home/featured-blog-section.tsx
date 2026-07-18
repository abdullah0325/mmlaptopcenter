import BlogSection from "@/components/features/blog/blog-section";

type FeaturedBlogSectionProps = {
  articles: Array<{
    id: string;
    title: string;
    slug: string;
    content?: string | null;
    excerpt?: string | null;
    featuredImage?: string | null;
    publishedAt?: Date | string | null;
  }>;
};

export function FeaturedBlogSection({ articles }: FeaturedBlogSectionProps) {
  return (
    <section className="bg-white px-6 py-10 lg:px-4 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <BlogSection
          articles={articles.map((article) => ({
            id: article.id,
            title: article.title,
            handle: article.slug,
            publishedAt: article.publishedAt ? article.publishedAt.toString() : "",
            content: article.content ?? article.excerpt ?? "",
            image: article.featuredImage ? { url: article.featuredImage } : null,
            blogHandle: "news",
          }))}
        />
      </div>
    </section>
  );
}

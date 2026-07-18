import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar } from "@esmate/shadcn/pkgs/lucide-react";

type BlogPostSummary = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImage: string | null;
  publishedAt: Date | null;
};

type BlogPageContentProps = {
  articles: BlogPostSummary[];
};

export function BlogPageContent({ articles }: BlogPageContentProps) {
  return (
    <div className="bg-[#fcf5e8]">
      <div className="relative h-80 w-full overflow-hidden sm:h-105">
        <Image
          src="https://placehold.co/1400x420?text=MM+Laptop+Center+Blog"
          alt="MM Laptop Center Blog"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#1a1308]/35" />
        <div className="relative z-10 flex h-full items-center justify-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#fcf5e8] sm:text-4xl">
            MM Laptop Center Blogs
          </h1>
        </div>
      </div>

      <div className="p-2 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-[#0a0a0a] sm:text-4xl">
              Latest from the MM Laptop Center
            </h2>

            <p className="mt-4 text-lg text-[#5A5E55]">
              Welcome to the MM Laptop Center blog, where we share practical buying
              guides, tech insights, and stories that help customers choose the right
              premium laptop for work, study, and play.
            </p>

            <p className="mt-4 text-[#5A5E55]">
              From gaming laptop comparisons to business laptop recommendations, our goal
              is to make it easier to choose confident, well-supported technology.
            </p>

            <p className="mt-4 text-[#5A5E55]">
              Whether you are researching specs, accessories, or everyday setup advice,
              you’ll find valuable guidance here.
            </p>
          </div>
        </div>

        {articles.length > 0 ? (
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 p-4 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {articles.map((post) => (
              <article
                key={post.id}
                className="flex flex-col items-start justify-between rounded-2xl border border-[#d8a928]/30 bg-white p-6 transition-shadow group hover:shadow-lg"
              >
                <Link href={`/blogs/news/${post.slug}`} className="w-full">
                  <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-lg bg-white">
                    {post.featuredImage ? (
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[#5A5E55]">
                        No Image
                      </div>
                    )}
                  </div>
                </Link>

                <div className="flex w-full items-center gap-x-4 text-xs">
                  <time
                    dateTime={post.publishedAt?.toISOString() ?? ""}
                    className="flex items-center gap-1 text-[#5A5E55]"
                  >
                    <Calendar className="h-3 w-3" />
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Recently"}
                  </time>
                </div>

                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-[#0a0a0a] transition-colors group-hover:text-[#f6a45d]">
                    <Link href={`/blogs/news/${post.slug}`}>
                      <span className="absolute inset-0" />
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-[#5A5E55]">
                    {post.excerpt || "Read this article on MM Laptop Center blog."}
                  </p>
                </div>

                <div className="relative mt-8 flex items-center gap-x-2 text-sm font-semibold leading-6 text-[#f6a45d]">
                  Read more <ArrowRight className="h-4 w-4" />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-16 text-center text-[#5A5E55]">
            <p>No articles found. Check back soon!</p>
          </div>
        )}

        <div className="mx-auto mt-24 max-w-3xl pt-10 p-2">
          <p className="mb-3 text-center text-2xl font-bold text-[#0a0a0a]">
            Disclaimer
          </p>
          <p className="text-sm font-medium text-[#0a0a0a]">
            At MM Laptop Center, we believe in being open and honest with our customers.
            The following disclaimer outlines important information about the content
            and products featured on our website. Please take a moment to read
            through it carefully.
          </p>

          <details className="group mt-4">
            <summary className="cursor-pointer list-none text-sm font-semibold text-[#f6a45d]">
              Click to view full disclaimer
            </summary>

            <div className="mt-4 space-y-4 text-sm text-[#5A5E55]">
              <p>
                The information provided on this website is for general
                informational and educational purposes only. While we make every
                effort to ensure our content is accurate and up to date, we do
                not guarantee the completeness, reliability, or suitability of
                any information related to our products or their specifications.
              </p>

              <p>
                Our laptops and related tech products are consumer electronics and
                are intended for everyday computing, work, gaming, and productivity
                use. Product availability, pricing, and specifications may change
                without notice.
              </p>

              <p>
                By using our website and purchasing our products, you
                acknowledge and agree that you do so at your own discretion and
                risk. MM Laptop Center is not responsible for any direct, indirect, or
                incidental damages that may result from reliance on information
                presented here.
              </p>

              <p>
                All product descriptions, imagery, and claims are for
                illustrative purposes only and may vary slightly from actual
                products due to manufacturer updates or stock differences.
              </p>

              <p>
                Your trust matters to us and we’re committed to ensuring every
                product you receive meets our high standards of quality and
                authenticity.
              </p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}

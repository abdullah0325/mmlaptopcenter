import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { BlogPageContent } from "./_components/blog-page-content";

/* ---------------- SEO METADATA ---------------- */
export const dynamic = "force-dynamic";

/* ---------------- SEO METADATA ---------------- */
export const metadata: Metadata = {
  title: "Blog | MM Laptop Center Premium Laptops",
  description:
    "Explore health tips, guides, and stories about Premium Laptops from MM Laptop Center. Learn about wellness, nutrition, and sustainable living.",
  keywords: [
    "MM Laptop Center",
    "Premium Laptops",
    "health blog",
    "salt benefits",
    "natural wellness",
    "organic lifestyle",
    "nutrition tips",
    "laptops blog",
  ],
  openGraph: {
    title: "MM Laptop Center Blog",
    description:
      "Latest articles, health guides, and insights from MM Laptop Center Premium Laptops.",
    images: ["https://placehold.co/1400x600?text=MM+Laptop+Center"],
    type: "website",
  },
};

export default async function BlogPage() {
  const articles = await prisma.blogPost.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      featuredImage: true,
      publishedAt: true,
    },
  });

  return <BlogPageContent articles={articles} />;
}


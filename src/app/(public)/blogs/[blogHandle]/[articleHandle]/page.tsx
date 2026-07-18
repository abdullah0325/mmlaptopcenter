import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Calendar } from "@esmate/shadcn/pkgs/lucide-react"
import { Metadata } from "next"
import DOMPurify from "dompurify"

interface Props {
  params: Promise<{
    blogHandle: string
    articleHandle: string
  }>
}

export const dynamic = "force-dynamic"

/* ===========================
   SEO METADATA
=========================== */
export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { articleHandle } = await params
  const article = await prisma.blogPost.findUnique({
    where: { slug: articleHandle },
    select: {
      title: true,
      excerpt: true,
      seoTitle: true,
      seoDescription: true,
      featuredImage: true,
      publishedAt: true,
      author: true,
    },
  })

  if (!article) {
    return { title: "Blog Post" }
  }

  const url = `https://yourdomain.com/blogs/news/${articleHandle}`

  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt || undefined,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      url,
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.excerpt || undefined,
      publishedTime: article.publishedAt?.toISOString(),
      authors: article.author ? [article.author] : [],
      images: article.featuredImage
        ? [
            {
              url: article.featuredImage,
              width: 1200,
              height: 630,
              alt: article.title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.excerpt || undefined,
      images: article.featuredImage ? [article.featuredImage] : [],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

/* ===========================
   PAGE
=========================== */
export default async function ArticlePage({ params }: Props) {
  const { articleHandle } = await params
  const article = await prisma.blogPost.findFirst({
    where: { slug: articleHandle, status: "published" },
    select: {
      title: true,
      content: true,
      featuredImage: true,
      publishedAt: true,
      author: true,
    },
  })

  if (!article) {
    notFound()
  }

  const cleanHtml = DOMPurify.sanitize(article.content ?? "")

  return (
    <article className="bg-background">
      {/* ================= HERO IMAGE ================= */}
      {article.featuredImage && (
        <div className="relative w-full h-[60vh] sm:h-[100vh] overflow-hidden">
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}

      {/* ================= CONTENT ================= */}
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="mx-auto w-full lg:max-w-3xl">
          {/* Title */}
          <h1 className="text-center text-3xl sm:text-4xl font-serif font-bold tracking-tight text-foreground">
            {article.title}
          </h1>

          {/* Meta */}
          <div className="mt-6 flex justify-center">
            <time
              dateTime={article.publishedAt?.toISOString() ?? undefined}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Calendar className="h-4 w-4" />
              {new Date(article.publishedAt || Date.now()).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          </div>

          {/* Content */}
          <div
            className="
              mt-12 prose prose-lg max-w-none
              prose-headings:font-serif
              prose-headings:tracking-tight
              prose-headings:text-foreground
              prose-p:text-muted-foreground
              prose-p:leading-7
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-foreground
              prose-blockquote:border-l-primary
              prose-blockquote:text-muted-foreground
              prose-li:text-muted-foreground
              dark:prose-invert
            "
          >
            <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
          </div>

          {/* Back */}
          <div className="mt-16 text-center">
            <Link
              href="/blogs"
              className="text-primary hover:underline underline-offset-4"
            >
              ← Back to Blogs
            </Link>
          </div>
        </div>
      </div>

      {/* ================= STRUCTURED DATA ================= */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: article.title,
            image: article.featuredImage,
            datePublished: article.publishedAt?.toISOString(),
            author: {
              "@type": "Person",
              name: article.author,
            },
          }),
        }}
      />
    </article>
  )
}


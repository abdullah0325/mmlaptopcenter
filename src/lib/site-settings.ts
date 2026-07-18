import { prisma } from "@/lib/prisma";

type SitePage = {
  id: string;
  title: string;
  body: string;
  seo: {
    title: string;
    description: string;
  };
};

type PolicyContent = {
  title: string;
  body: string;
};

type BlogArticle = {
  id: string;
  title: string;
  handle: string;
  blogHandle: string;
  blogTitle?: string;
  publishedAt: string;
  content: string;
  contentHtml?: string;
  image?: {
    url: string;
    altText?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
  authorV2?: {
    name: string;
  } | null;
  seo?: {
    title?: string | null;
    description?: string | null;
  } | null;
};

async function getSetting<T>(key: string): Promise<T | null> {
  const setting = await prisma.siteSetting.findUnique({
    where: { key },
    select: { value: true },
  });

  return (setting?.value as T | null) ?? null;
}

export async function getPolicyContent(
  key: string,
  fallback: PolicyContent,
): Promise<PolicyContent> {
  const value = await getSetting<PolicyContent>(key);
  return value ?? fallback;
}

export async function getSitePage(handle: string, fallback?: SitePage): Promise<SitePage> {
  const page = await getSetting<SitePage>(`page:${handle}`);

  if (page) {
    return page;
  }

  if (fallback) {
    return fallback;
  }

  return {
    id: handle,
    title: handle,
    body: "",
    seo: {
      title: handle,
      description: "",
    },
  };
}

export async function getBlogArticles(): Promise<BlogArticle[]> {
  const articles = await getSetting<BlogArticle[]>("blogArticles");
  return Array.isArray(articles) ? articles : [];
}

export async function getBlogArticle(blogHandle: string, articleHandle: string) {
  const articles = await getBlogArticles();
  return (
    articles.find(
      (article) =>
        article.blogHandle === blogHandle && article.handle === articleHandle,
    ) ?? null
  );
}

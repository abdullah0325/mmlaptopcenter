import { Metadata } from "next";
import { getCollectionList } from "./service";
import { CollectionsPageContent } from "./_components/collections-page-content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Collections | MM Laptop Center - Gaming Gear, Laptops Lamps & Herbal Products",
  description:
    "Explore all MM Laptop Center collections including Gaming Gear, Premium laptops lamps, edible salt, bath salts, wellness products, and decorative laptops pieces.",
  keywords: [
    "MM Laptop Center collections",
    "gaming gear collection",
    "premium laptops products",
    "laptops lamps",
    "salt lamp collection",
    "edible laptops",
    "bath salts",
    "salt decoration",
    "decorative laptops",
    "natural wellness products",
    "Pakistan laptops supplier",
  ],
  alternates: {
    canonical: "https://mmlaptopcenter.com/collections",
  },
  openGraph: {
    title: "Collections | MM Laptop Center - Gaming Gear, Laptops & Wellness",
    description:
      "Discover MM Laptop Center's complete range of Gaming Gear, Premium laptops collections for health, home, and lifestyle.",
    url: "https://mmlaptopcenter.com/collections",
    siteName: "MM Laptop Center",
    type: "website",
    images: [
      {
        url: "https://mmlaptopcenter.com/og/collections.jpg",
        width: 1200,
        height: 630,
        alt: "MM Laptop Center Premium Laptops Collections",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Collections | MM Laptop Center - Laptops & Gaming Gear",
    description:
      "Browse all MM Laptop Center collections: Gaming Gear, Premium laptops, salt lamps, and wellness products.",
    images: ["https://mmlaptopcenter.com/og/collections.jpg"],
  },
};

export default async function Page() {
  let data: Awaited<ReturnType<typeof getCollectionList>> = {
    pageInfo: { hasNextPage: false },
    edges: [],
  };

  try {
    data = await getCollectionList();
  } catch (error) {
    console.error("Failed to load collections:", error);
  }

  return <CollectionsPageContent data={data} />;
}


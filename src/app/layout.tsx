import { ReactNode, Suspense } from "react";
import Providers from "../components/providers/providers";
import "./globals.css";
import type { Metadata } from "next";
import InstallPrompt from "@/components/core/install-prompt";
import ServiceWorkerRegistration from "@/components/core/service-worker-registration";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import { MetaPixel } from "@/components/integrations/meta-pixel";

export const metadata: Metadata = {
  title: "MM Laptop Center – Premium Laptops & Tech",
  description:
    "MM Laptop Center – Shop premium laptops, gaming gear and accessories",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MM Laptop Center",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MM Laptop Center" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#d8a928" />
        <meta name="description" content="MM Laptop Center – Shop premium laptops, gaming gear and accessories" />
      </head>
      <body suppressHydrationWarning>
        <Script
          id="performance-measure-guard"
          strategy="beforeInteractive"
          src="/performance-measure-guard.js"
        />
        <Suspense fallback={null}>
          <MetaPixel />
        </Suspense>
        <Providers>
          {children}
          <SpeedInsights />
          <Analytics />
        </Providers>
        <InstallPrompt />
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}

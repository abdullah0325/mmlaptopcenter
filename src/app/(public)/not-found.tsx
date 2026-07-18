"use client";

import Link from "next/link";
import Head from "next/head";
import { motion } from "framer-motion";
import { Button } from "@esmate/shadcn/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@esmate/shadcn/components/ui/card";
import { Home, PackageSearch } from "@esmate/shadcn/pkgs/lucide-react";

export default function NotFound() {
  return (
    <>
      <Head>
        <title>404 Not Found – MM Laptop Center</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://mmlaptopcenter.com/404" />
        <link
          rel="icon"
          type="image/png"
          href="//mobarakfoods.com/cdn/shop/files/mubarak_foods_logo-removebg-preview.png?crop=center&height=32&v=1764223344&width=32"
        />

        <meta property="og:site_name" content="MM Laptop Center" />
        <meta property="og:url" content="https://mmlaptopcenter.com/404" />
        <meta property="og:title" content="404 Not Found" />
        <meta
          property="og:description"
          content="The page you’re looking for could not be found."
        />
        <meta
          property="og:image"
          content="https://mobarakfoods.com/cdn/shop/files/mubarak_foods_logo-removebg-preview.png?height=628&width=1200"
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className="relative mb-10 mt-10 min-h-screen bg-[#fcf5e8] overflow-hidden flex items-center justify-center px-4">
        <div className="absolute inset-0 flex items-center justify-center"></div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative w-full max-w-xl"
        >
          <Card className="bg-white/90 mb-2 border border-[#d8a928]/40 rounded-2xl">
            <CardHeader className="pt-10 px-6 sm:px-10 text-center space-y-6">
              <div className="mx-auto flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-[#fcf5e8] shadow-inner">
                <PackageSearch className="h-10 w-10 sm:h-12 sm:w-12 text-[#f6a45d]" />
              </div>

              <div className="space-y-2">
                <CardTitle className="text-5xl sm:text-6xl font-bold text-[#0a0a0a]">
                  404
                </CardTitle>
                <CardDescription className="text-base sm:text-lg text-[#5A5E55]">
                  This page could not be found
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="px-6 sm:px-10 pt-6 pb-8 text-center">
              <p className="text-sm sm:text-base text-[#5A5E55] leading-relaxed">
                The page you’re looking for no longer exists or may have moved.
                Our premium laptops and accessories are still here and ready for you.
              </p>

              <div className="mt-8 flex justify-center">
                <div className="h-1 w-28 sm:w-32 rounded-full bg-linear-to-r from-[#d8a928] to-[#f6a45d]" />
              </div>
            </CardContent>

            <CardFooter className="pb-10 flex justify-center">
              <Button
                asChild
                className="bg-[#f6a45d] hover:bg-[#d8861f] text-[#fcf5e8] px-8 py-6 text-sm sm:text-base shadow-xl rounded-full"
              >
                <Link href="/">
                  <Home className="mr-2 h-5 w-5" />
                  Back to MM Laptop Center
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </>
  );
}


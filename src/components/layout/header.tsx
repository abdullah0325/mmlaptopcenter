"use client";

import { useCart } from "@/lib/commerce";
import { Badge } from "@esmate/shadcn/components/ui/badge";
import { Button } from "@esmate/shadcn/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@esmate/shadcn/components/ui/sheet";
import {
  ChevronDown,
  Menu,
  Phone,
  Search,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "@esmate/shadcn/pkgs/lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CartDrawer } from "@/components/features/cart/cart-drawer";
import { searchProducts } from "@/components/search/actions";
import { search as trackSearch } from "@/lib/pixel";

const mainMenuItems = [
  { text: "Home", href: "/" },
  { text: "All Products", href: "/products" },
  { text: "Laptops", href: "/products" },
  { text: "Accessories", href: "/category/accessories" },
  { text: "Deals", href: "/collections/hot-deals" },
  { text: "About", href: "/about-us" },
  { text: "Contact", href: "/contact" },
];

const topBarLeft = [
  { icon: Truck, text: "Free Shipping on Orders Over $150" },
  { icon: ShieldCheck, text: "100% Secure Checkout" },
];

const topBarRight = [
  { text: "About", href: "/about-us" },
  { text: "Reviews", href: "/reviews" },
  { text: "Store Locator", href: "/store-locator" },
  { text: "FAQs", href: "/faqs" },
];

const logoSrc = "/logo/mmlaptop.png";

async function getShopCategories() {
  const res = await fetch("/api/categories", { next: { revalidate: 60 } });
  const data = await res.json();
  return data.categories || [];
}

export function Header() {
  const pathname = usePathname();
  const { totalQuantity } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Awaited<ReturnType<typeof searchProducts>>>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const lastTrackedQuery = useRef("");
  const [cartOpen, setCartOpen] = useState(false);
  const [shopCategories, setShopCategories] = useState<
    { id: string; name: string; slug: string; image: string | null }[]
  >([]);

  useEffect(() => {
    getShopCategories().then(setShopCategories);
  }, []);

  const isActive = (href: string) => pathname.startsWith(href);

  useEffect(() => {
    async function performSearch() {
      const validQuery = searchQuery.trim();
      if (validQuery.length < 3) {
        setSearchResults([]);
        return;
      }

      setSearchLoading(true);
      try {
        const products = await searchProducts(validQuery);
        setSearchResults(products);
        if (lastTrackedQuery.current !== validQuery) {
          trackSearch(validQuery);
          lastTrackedQuery.current = validQuery;
        }
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }

    const timeout = setTimeout(performSearch, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  return (
    <header className="sticky top-0 z-40 border-b border-[#d8a928]/45 bg-[#f4f1e8] shadow-sm">
      {/* ───────── top announcement bar ───────── */}
      <div className="hidden bg-[#1a1308] text-white lg:block">
        <div className="flex h-10 w-full items-center justify-between px-4 text-xs sm:px-6">
          <div className="flex items-center gap-6">
            {topBarLeft.map((item) => (
              <span key={item.text} className="flex items-center gap-2 font-medium">
                <item.icon className="h-3.5 w-3.5 text-[#f6a45d]" />
                {item.text}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-6">
            {topBarRight.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-medium text-white/85 transition-colors hover:text-[#f6a45d]"
              >
                {item.text}
              </Link>
            ))}
            <Link
              href="/contact"
              className="flex items-center gap-1.5 font-medium text-white/85 transition-colors hover:text-[#f6a45d]"
            >
              <Phone className="h-3.5 w-3.5" />
              Contact
            </Link>
          </div>
        </div>
      </div>

      {/* ───────── main nav ───────── */}
      <nav className="flex h-16 w-full items-center gap-4 px-3 sm:px-4 lg:h-20 lg:gap-6 lg:px-6">
        <div className="lg:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-[#1a1308] hover:text-[#b57910]"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="w-[320px] border-r border-[#d8a928]/45 bg-[#fff7df] p-0"
            >
              <SheetTitle className="sr-only">Mobile menu</SheetTitle>
              <div className="flex h-full flex-col">
                <div className="p-6">
                  <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                    <div className="relative h-14 w-[130px]">
                      <Image
                        src={logoSrc}
                        alt="MM Laptop Center"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </Link>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-1">
                    <Link
                      href="/"
                      className={`flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        pathname === "/"
                          ? "bg-[#d8a928]/20 text-[#8a5b00]"
                          : "text-[#1a1308] hover:bg-[#d8a928]/12"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Home
                    </Link>

                    <div className="mt-4">
                      <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-[#7a6333]">
                        Shop Categories
                      </div>

                      <div className="space-y-1">
                        {shopCategories.map((item) => (
                          <Link
                            key={item.id}
                            href={`/category/${item.slug}`}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                              isActive(`/category/${item.slug}`)
                                ? "bg-[#d8a928]/20 text-[#8a5b00]"
                                : "text-[#1a1308] hover:bg-[#d8a928]/12"
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <div className="relative h-8 w-8 overflow-hidden rounded border border-[#d8a928]/25">
                              <Image
                                src={item.image || logoSrc}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span className="font-medium">{item.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 border-t border-[#d8a928]/25 pt-4">
                      {mainMenuItems
                        .filter((i) => i.text !== "Home")
                        .map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                              isActive(item.href)
                                ? "bg-[#d8a928]/20 text-[#8a5b00]"
                                : "text-[#1a1308] hover:bg-[#d8a928]/12"
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item.text}
                          </Link>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#d8a928]/25 p-6">
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 text-[#1a1308] hover:text-[#b57910]"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setSearchOpen(true);
                      }}
                    >
                      <Search className="h-5 w-5" />
                    </Button>

                    <button
                      className="relative text-[#1a1308] transition-colors hover:text-[#b57910]"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setCartOpen(true);
                      }}
                    >
                      <ShoppingCart className="h-6 w-6" />
                      {!!totalQuantity && (
                        <Badge className="absolute -right-2 -top-2 h-5 min-w-5 rounded-full bg-[#b57910] p-0 text-xs text-white">
                          {totalQuantity}
                        </Badge>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* ───────── logo — kept tight to the left edge ───────── */}
        <Link href="/" className="flex shrink-0 items-center">
          <div className="relative h-10 w-[120px] lg:h-12 lg:w-[140px]">
            <Image
              src={logoSrc}
              alt="MM Laptop Center"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        <div className="flex items-center gap-2 lg:hidden ml-auto">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-[#1a1308] hover:text-[#b57910]"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative h-10 w-10 text-[#1a1308] hover:text-[#b57910]"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart className="h-5 w-5" />
            {!!totalQuantity && (
              <Badge className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full border-2 border-white bg-[#b57910] p-0 text-xs text-white">
                {totalQuantity > 99 ? "99+" : totalQuantity}
              </Badge>
            )}
          </Button>
        </div>

        {/* ───────── nav links ───────── */}
        <div className="hidden items-center gap-5 lg:flex">
          <Link
            href="/"
            className={`flex items-center gap-1.5 text-sm font-semibold transition-colors hover:text-[#b57910] ${
              pathname === "/" ? "text-[#8a5b00]" : "text-[#1a1308]"
            }`}
          >
            Home
          </Link>

          <div className="relative">
            <div className="group">
              <div className="flex cursor-pointer items-center gap-1">
                <Link
                  href="/products"
                  className={`text-sm font-semibold transition-colors hover:text-[#b57910] ${
                    isActive("/products") || isActive("/category")
                      ? "text-[#8a5b00]"
                      : "text-[#1a1308]"
                  }`}
                >
                  Categories
                </Link>
                <ChevronDown className="h-4 w-4 text-[#7a6333] transition-transform duration-200 group-hover:rotate-180" />
              </div>

              <div className="absolute left-1/2 top-full h-4 w-32 -translate-x-1/2" />

              <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-4 w-[560px] -translate-x-1/2 scale-95 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100">
                <div className="overflow-hidden rounded-xl border border-[#d8a928]/25 bg-white p-2 shadow-2xl">
                  <div className="grid grid-cols-4 gap-0.5 p-0.5">
                    {shopCategories.slice(0, 8).map((item) => (
                      <Link
                        key={item.id}
                        href={`/category/${item.slug}`}
                        className={`group relative m-1 flex flex-col items-center rounded-lg p-3 transition-all hover:bg-[#f6a45d]/5 hover:shadow-sm ${
                          isActive(`/category/${item.slug}`)
                            ? "bg-[#f6a45d]/5"
                            : ""
                        }`}
                      >
                        <div className="relative mb-2 h-14 w-14 overflow-hidden rounded-lg">
                          <Image
                            src={item.image || logoSrc}
                            alt={item.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                            sizes="56px"
                          />
                        </div>

                        <p
                          className={`text-center text-xs font-semibold leading-tight ${
                            isActive(`/category/${item.slug}`)
                              ? "text-[#f6a45d]"
                              : "text-[#1a1308]"
                          }`}
                        >
                          {item.name}
                        </p>

                        <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-transparent transition-all group-hover:ring-[#f6a45d]/20" />
                      </Link>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 bg-white p-3">
                    <Link
                      href="/products"
                      className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#5A5E55] transition-colors hover:text-[#f6a45d]"
                    >
                      View all products
                      <ChevronDown className="h-3 w-3 rotate-[-90deg]" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <Link
              href="/products"
              className={`text-sm font-semibold transition-colors hover:text-[#b57910] ${
                isActive("/products") ? "text-[#8a5b00]" : "text-[#1a1308]"
              }`}
            >
              All Products
            </Link>
          </div>

          <div className="relative">
            <Link
              href="/about-us"
              className={`text-sm font-semibold transition-colors hover:text-[#b57910] ${
                isActive("/about-us") ? "text-[#8a5b00]" : "text-[#1a1308]"
              }`}
            >
              About
            </Link>
          </div>

          <div className="relative">
            <Link
              href="/contact"
              className={`text-sm font-semibold transition-colors hover:text-[#b57910] ${
                isActive("/contact") ? "text-[#8a5b00]" : "text-[#1a1308]"
              }`}
            >
              Contact
            </Link>
          </div>

          <div className="relative">
            <Link
              href="/collections/new-arrivals"
              className="text-sm font-semibold text-[#1a1308] transition-colors hover:text-[#b57910]"
            >
              New Arrivals
            </Link>
            <span className="absolute -right-3 -top-2.5 rounded-full bg-emerald-500 px-1.5 py-[1px] text-[8px] font-bold uppercase leading-tight tracking-wide text-white shadow-sm">
              New
            </span>
          </div>

          <div className="relative">
            <Link
              href="/videos"
              className={`text-sm font-semibold transition-colors hover:text-[#b57910] ${
                isActive("/videos") ? "text-[#8a5b00]" : "text-[#1a1308]"
              }`}
            >
              Videos
            </Link>
          </div>
        </div>

        {/* ───────── search + icons ───────── */}
        <div className="hidden flex-1 items-center justify-end gap-3 lg:flex">
          <div className="relative w-full max-w-xs">
            <div className="flex items-center overflow-hidden rounded-full border border-[#d8a928]/30 bg-white shadow-sm">
              <Search className="ml-4 h-4 w-4 shrink-0 text-[#5A5E55]" />
              <input
                type="search"
                placeholder="Search for laptops..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
                className="flex-1 bg-transparent px-3 py-2.5 text-sm text-[#0a0a0a] outline-none placeholder:text-[#5A5E55]/60"
              />
              <button
                onClick={() => setSearchOpen(true)}
                className="m-1 shrink-0 rounded-full bg-gradient-to-r from-[#f6a45d] to-[#d8a928] px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
              >
                Search
              </button>
            </div>

            {searchOpen && searchQuery && (
              <div className="absolute right-0 top-full z-50 mt-2 max-h-80 w-80 overflow-hidden overflow-y-auto rounded-lg border border-[#d8a928]/20 bg-white shadow-lg">
                {searchLoading ? (
                  <div className="flex items-center justify-center py-8 text-sm text-[#5A5E55]">
                    Searching...
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <Link
                      key={product.handle}
                      href={`/products/${product.handle}`}
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                      className="flex items-center gap-3 border-b border-[#d8a928]/10 p-3 last:border-b-0 hover:bg-[#fcf5e8]"
                    >
                      <div className="relative h-10 w-10 overflow-hidden rounded-md border border-[#d8a928]/20">
                        {product.featuredImage && (
                          <Image
                            src={product.featuredImage.url}
                            alt={product.featuredImage.altText || ""}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-[#0a0a0a]">
                          {product.title}
                        </p>
                        <p className="text-xs text-[#5A5E55]">
                          {product.priceRange.minVariantPrice.amount}{" "}
                          {product.priceRange.minVariantPrice.currencyCode}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="flex items-center justify-center py-8 text-sm text-[#5A5E55]">
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="relative h-10 w-10 text-[#1a1308] hover:text-[#b57910]"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart className="h-5 w-5" />
            {!!totalQuantity && (
              <Badge className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full border-2 border-white bg-[#b57910] p-0 text-xs text-white">
                {totalQuantity > 99 ? "99+" : totalQuantity}
              </Badge>
            )}
          </Button>


        </div>
      </nav>

      {searchOpen && (
        <div className="absolute left-0 right-0 top-16 z-30 border-b border-[#d8a928]/20 bg-[#fcf5e8] shadow-lg lg:hidden">
          <div className="px-4 py-3">
            <div className="flex items-center overflow-hidden rounded-lg border-2 border-[#d8a928]/30 bg-white">
              <Search className="ml-3 h-4 w-4 shrink-0 text-[#5A5E55]" />
              <input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() => {
                  setTimeout(() => setSearchOpen(false), 150);
                }}
                onFocus={() => setSearchOpen(true)}
                className="flex-1 bg-transparent px-3 py-2.5 text-sm text-[#0a0a0a] outline-none placeholder:text-[#5A5E55]/60"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  className="shrink-0 px-2 text-[#5A5E55] hover:text-[#0a0a0a]"
                >
                  <Search className="h-4 w-4 rotate-90" />
                </button>
              )}
              <button
                onClick={() => setSearchOpen(false)}
                className="border-l border-[#d8a928]/20 px-3 text-[#5A5E55] hover:text-[#0a0a0a]"
              >
                Cancel
              </button>
            </div>

            {searchQuery && (
              <div className="mt-2 max-h-80 overflow-hidden overflow-y-auto rounded-lg border border-[#d8a928]/20 bg-white shadow-lg">
                {searchLoading ? (
                  <div className="flex items-center justify-center py-6 text-sm text-[#5A5E55]">
                    Searching...
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <Link
                      key={product.handle}
                      href={`/products/${product.handle}`}
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                      className="flex items-center gap-3 border-b border-[#d8a928]/10 p-3 last:border-b-0 hover:bg-[#fcf5e8]"
                    >
                      <div className="relative h-10 w-10 overflow-hidden rounded-md border border-[#d8a928]/20">
                        {product.featuredImage && (
                          <Image
                            src={product.featuredImage.url}
                            alt={product.featuredImage.altText || ""}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-[#0a0a0a]">
                          {product.title}
                        </p>
                        <p className="text-xs text-[#5A5E55]">
                          {product.priceRange.minVariantPrice.amount}{" "}
                          {product.priceRange.minVariantPrice.currencyCode}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="flex items-center justify-center py-6 text-sm text-[#5A5E55]">
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </header>
  );
}

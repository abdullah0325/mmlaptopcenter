"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid3X3, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { BsChatDots } from "react-icons/bs";
import { contact as trackContact } from "@/lib/pixel";

const PHONE_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923048928282";

export function MobileBottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const openChat = () =>
    window.dispatchEvent(new CustomEvent("open-mobile-chat"));

  const homeActive = isActive("/");
  const productsActive = isActive("/products");

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-[#1a1308] border-t border-white/10">
        <div className="flex justify-around py-1.5">
          {/* AI Chat */}
          <button
            onClick={openChat}
            aria-label="Open AI chat"
            className="flex items-center justify-center px-4 py-2.5 transition-colors"
          >
            <BsChatDots className="h-5 w-5 text-[#d8a928]" />
          </button>

          {/* Home */}
          <Link
            href="/"
            className={`flex items-center justify-center px-4 py-2.5 transition-colors ${
              homeActive ? "text-[#d8a928]" : "text-gray-400"
            }`}
          >
            <Home className="h-5 w-5" />
          </Link>

          {/* Products */}
          <Link
            href="/products"
            className={`flex items-center justify-center px-4 py-2.5 transition-colors ${
              productsActive ? "text-[#d8a928]" : "text-gray-400"
            }`}
          >
            <Grid3X3 className="h-5 w-5" />
          </Link>

          {/* Phone */}
          <a
            href={`tel:+${PHONE_NUMBER}`}
            aria-label="Call us"
            className="flex items-center justify-center px-4 py-2.5 transition-colors text-gray-400"
          >
            <Phone className="h-5 w-5" />
          </a>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${PHONE_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            onClick={() => trackContact("WhatsApp mobile navigation")}
            className="flex items-center justify-center px-4 py-2.5 transition-colors text-gray-400"
          >
            <FaWhatsapp className="h-5 w-5" />
          </a>
        </div>
      </div>
    </nav>
  );
}

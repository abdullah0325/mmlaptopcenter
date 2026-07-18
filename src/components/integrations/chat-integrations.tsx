"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { FaWhatsapp } from "react-icons/fa";
import { ChatButton } from "@/components/chatbot/chat-button";
import { ChatPopup } from "@/components/chatbot/chat-popup";
import { contact as trackContact } from "@/lib/pixel";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
const TAWK_ID = process.env.NEXT_PUBLIC_TAWK_ID;
const TAWK_WIDGET_ID = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID;


export function ChatIntegrations() {
  const [loadTawk, setLoadTawk] = useState(false);
  const [openChat, setOpenChat] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setLoadTawk(true);
      window.removeEventListener("scroll", onScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    const handleOpenMobileChat = () => setOpenChat(true);
    window.addEventListener("open-mobile-chat", handleOpenMobileChat);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("open-mobile-chat", handleOpenMobileChat);
    };
  }, []);

  return (
    <>
      <ChatButton open={openChat} onClick={() => setOpenChat((prev) => !prev)} />
      <ChatPopup open={openChat} onClose={() => setOpenChat(false)} />

      {/* WhatsApp Floating Button - Only on Desktop */}
      <Link
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-28 md:bottom-28 right-5 z-50 hidden lg:flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 lg:bottom-6 lg:right-6 lg:h-14 lg:w-14"
        aria-label="Chat on WhatsApp"
        onClick={() => trackContact("WhatsApp floating button")}
      >
        <FaWhatsapp className="h-5 w-5 lg:h-8 lg:w-8" />
      </Link>

      {/* Load Tawk.to only after scroll */}
      {loadTawk && (
        <Script id="tawk-to-script" strategy="afterInteractive">
          {`
            var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
            (function () {
              var s1 = document.createElement("script"),
                s0 = document.getElementsByTagName("script")[0];
              s1.async = true;
              s1.src = 'https://embed.tawk.to/${TAWK_ID}/${TAWK_WIDGET_ID}';
              s1.charset = 'UTF-8';
              s1.setAttribute('crossorigin', '*');
              s0.parentNode.insertBefore(s1, s0);
            })();
          `}
        </Script>
      )}
    </>
  );
}

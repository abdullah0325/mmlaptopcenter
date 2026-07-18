import { ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ChatIntegrations } from "@/components/integrations/chat-integrations";
import { SiteLoader } from "@/components/core/site-loader";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="public-site flex min-h-screen flex-col">
      <Header />
      <SiteLoader />
      <main className="flex-grow bg-[#f5f5f5] pb-16 md:pb-0">{children}</main>
      <Footer />
      <MobileBottomNav />
      <ChatIntegrations />
    </div>
  );
}


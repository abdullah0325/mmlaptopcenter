import type { Metadata } from "next";
import { CartPageContent } from "./_components/cart-page-content";

export const metadata: Metadata = {
  title: "Cart",
  description: "Your shopping cart",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[#fcf5e8]">
      <CartPageContent />
    </main>
  );
}


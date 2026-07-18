"use client";

import DOMPurify from "dompurify";
import { useCart } from "@/lib/commerce";
import { toast } from "sonner";

export function MessageBubble({
  role,
  text,
  html,
}: {
  role: "user" | "assistant";
  text: string;
  html?: string;
}) {
  const user = role === "user";
  const safeHtml = html ? DOMPurify.sanitize(html) : "";
  const { linesAdd } = useCart();

  const handleClick = async (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "BUTTON" && target.getAttribute("data-add-to-cart")) {
      e.preventDefault();
      const variantId = target.getAttribute("data-variant-id") || "";
      const title = target.getAttribute("data-title") || "";
      const priceAmount = target.getAttribute("data-price") || "0";
      const imageUrl = target.getAttribute("data-image") || "";

      if (!variantId) return;

      try {
        await linesAdd([
          {
            merchandiseId: variantId,
            quantity: 1,
            title,
            price: { amount: priceAmount, currencyCode: "PKR" },
            imageUrl,
          },
        ]);
        toast.success("Added to cart", { description: title });
      } catch {
        toast.error("Failed to add to cart");
      }
    }
  };

  return (
    <div className={`flex ${user ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
          user ? "bg-[#f6a45d] text-white" : "bg-white text-[#0a0a0a] border border-[#d8a928]/20"
        }`}
        onClick={handleClick}
      >
        {html && !user ? (
          <div
            className="prose prose-sm max-w-none prose-headings:mb-2 prose-p:my-1 prose-ul:my-1"
            dangerouslySetInnerHTML={{ __html: safeHtml }}
          />
        ) : (
          text
        )}
      </div>
    </div>
  );
}


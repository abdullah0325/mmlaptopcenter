"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CartCost,
  CartLineProvider,
  CartLineQuantity,
  CartLineQuantityAdjustButton,
  Money,
  useCart,
} from "@/lib/commerce";
import { contact as trackContact, initiateCheckout } from "@/lib/pixel";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@esmate/shadcn/components/ui/card";
import { Button } from "@esmate/shadcn/components/ui/button";
import { Separator } from "@esmate/shadcn/components/ui/separator";
import { Badge } from "@esmate/shadcn/components/ui/badge";
import { FaWhatsapp } from "react-icons/fa";
import { Star } from "lucide-react";

const WHATSAPP_NUMBER = "923234567890";

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  distribution: { 1: number; 2: number; 3: number; 4: number; 5: number };
}

function buildWhatsAppMessage(cart: any) {
  const items = cart.lines
    .map((line: any) => {
      const title = line?.merchandise?.product?.title || "Product";
      const qty = line?.quantity || 1;
      const price = Number(line?.cost?.totalAmount?.amount || 0).toLocaleString();
      return `• ${title} x${qty} - Rs. ${price}`;
    })
    .join("%0A");

  const subtotal = cart.lines
    .reduce((sum: number, line: any) => sum + Number(line.cost?.totalAmount?.amount || 0), 0)
    .toLocaleString();

  return `Hi MM Laptop Center,%0A%0AI would like to order:%0A${items}%0A%0ATotal: Rs. ${subtotal}%0A%0APlease confirm my order. Thank you!`;
}

async function fetchReviewStats(productHandle: string): Promise<ReviewStats | null> {
  try {
    const res = await fetch(`/api/reviews?productHandle=${productHandle}&limit=1`);
    const data = await res.json();
    if (data.statistics) {
      return data.statistics;
    }
  } catch (error) {
    console.error("Failed to fetch review stats:", error);
  }
  return null;
}

function CartItemReviews({ productHandle }: { productHandle: string }) {
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productHandle) {
      fetchReviewStats(productHandle).then((data) => {
        setStats(data);
        setLoading(false);
      });
    }
  }, [productHandle]);

  if (loading || !stats || stats.totalReviews === 0) {
    return <div className="text-[10px] text-[#5A5E55]">No reviews yet</div>;
  }

  return (
    <div className="flex items-center gap-1.5 mt-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => {
          const fillPercent = Math.max(0, Math.min(100, (stats.averageRating - star + 1) * 100));
          return (
            <div key={star} className="relative">
              <Star className="h-2.5 w-2.5 text-gray-300" />
              {fillPercent > 0 && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${fillPercent}%` }}
                >
                  <Star className="h-2.5 w-2.5 fill-[#d8a928] text-[#d8a928]" />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <span className="text-[10px] font-medium text-[#0a0a0a]">
        {stats.averageRating.toFixed(1)}
      </span>
      <span className="text-[10px] text-[#5A5E55]">
        ({stats.totalReviews})
      </span>
    </div>
  );
}

export function Cart() {
  const router = useRouter();
  const cart = useCart();
  const isCartEmpty = (cart?.totalQuantity ?? 0) === 0;

  const handleCheckout = () => {
    // Track InitiateCheckout event
    const subtotal = cart.lines.reduce(
      (sum, line) => sum + Number(line.cost?.totalAmount?.amount || 0),
      0,
    );
    initiateCheckout({
      content_ids: cart.lines.map((line) => line.merchandise.product.id || line.merchandise.id.replace(/-simple$/, "")),
      contents: cart.lines.map((line) => ({ id: line.merchandise.product.id || line.merchandise.id.replace(/-simple$/, ""), quantity: line.quantity, item_price: Number(line.merchandise.price.amount), variant: line.merchandise.selectedOptions.map((option) => `${option.name}: ${option.value}`).join(", ") || undefined })),
      content_type: "product", value: subtotal, currency: "PKR", num_items: cart.totalQuantity,
    });
    router.push("/checkout");
  };

  return (
    <section className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[720px]">
        <Card className="overflow-hidden rounded-3xl border border-[#d8a928]/20 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
          <CardHeader className="border-b border-[#d8a928]/15 bg-[#fcf5e8]/60 px-5 py-4 sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-xl font-semibold text-[#0a0a0a]">
                Your Cart
              </CardTitle>

              <Badge className="rounded-full bg-[#f6a45d] px-3 py-1 text-xs font-medium text-[#fcf5e8] hover:bg-[#f6a45d]">
                {cart?.totalQuantity ?? 0} item
                {(cart?.totalQuantity ?? 0) !== 1 ? "s" : ""}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="max-h-[65vh] space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
            {cart.lines?.map((line) => (
              <CartLineProvider key={line?.id} line={line!}>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-[#fcf5e8] ring-1 ring-[#d8a928]/20">
                      <Image
                        src={line?.merchandise?.image?.url as string}
                        alt={line?.merchandise?.image?.altText || ""}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col gap-3">
                      <div className="flex items-start justify-between gap-3">
                        <Link
                          href={`/products/${line?.merchandise?.product?.handle}`}
                          className="line-clamp-2 text-sm font-semibold leading-6 text-[#0a0a0a] transition hover:text-[#f6a45d]"
                        >
                          {line?.merchandise?.product?.title}
                        </Link>

                        <Money
                          data={line?.cost?.totalAmount}
                          className="shrink-0 text-sm font-semibold text-[#0a0a0a]"
                        />
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {line?.merchandise?.selectedOptions?.map((option) => (
                          <Badge
                            key={option?.name}
                            variant="secondary"
                            className="rounded-full border border-[#d8a928]/20 bg-[#fcf5e8] px-2.5 py-1 text-[11px] font-medium text-[#0a0a0a]"
                          >
                            {option?.name}: {option?.value}
                          </Badge>
                        ))}
                      </div>

                      {/* Reviews Section */}
                      {line?.merchandise?.product?.handle && (
                        <CartItemReviews productHandle={line.merchandise.product.handle} />
                      )}

                      <div className="flex items-center justify-between gap-3">
                        <div className="rounded-full bg-[#fcf5e8] px-3 py-1.5 text-xs font-medium text-[#5A5E55]">
                          Qty <CartLineQuantity />
                        </div>

                        <CartLineQuantityAdjustButton
                          adjust="remove"
                          className="inline-flex h-9 items-center justify-center rounded-full border border-[#d8a928]/25 px-4 text-xs font-semibold text-[#5A5E55] transition hover:bg-[#fcf5e8] hover:text-[#0a0a0a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6a45d] disabled:pointer-events-none disabled:opacity-50"
                        >
                          Remove
                        </CartLineQuantityAdjustButton>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-[#d8a928]/15" />
                </div>
              </CartLineProvider>
            ))}

            {isCartEmpty && (
              <div className="rounded-2xl bg-[#fcf5e8] px-5 py-10 text-center">
                <p className="text-sm text-[#5A5E55]">Your cart is empty.</p>

                <Button
                  asChild
                  className="mt-4 rounded-full bg-[#f6a45d] px-6 text-[#fcf5e8] hover:bg-[#d8861f]"
                >
                  <Link href="/products">Start Shopping</Link>
                </Button>
              </div>
            )}
          </CardContent>

          <CardFooter className="border-t border-[#d8a928]/15 bg-white px-5 py-5 sm:px-6 mb-16 lg:mb-0">
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between text-sm font-medium text-[#0a0a0a]">
                <span>Subtotal</span>
                <CartCost amountType="subtotal" />
              </div>

              <p className="text-xs leading-5 text-[#5A5E55]">
                Shipping and taxes calculated at checkout.
              </p>

              <button
                onClick={handleCheckout}
                disabled={isCartEmpty}
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#f6a45d] text-sm font-semibold text-[#fcf5e8] transition hover:bg-[#d8861f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6a45d] disabled:pointer-events-none disabled:opacity-50"
              >
                Checkout
              </button>

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMessage(cart)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackContact("WhatsApp cart order")}
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#25D366] text-sm font-semibold text-white transition hover:bg-[#128C7E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
              >
                <FaWhatsapp className="mr-2 h-5 w-5" />
                Order on WhatsApp
              </a>

              <Button
                variant="link"
                asChild
                className="h-auto w-full px-0 text-sm font-medium text-[#f6a45d] hover:text-[#d8861f]"
              >
                <Link href="/products">Continue shopping →</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}


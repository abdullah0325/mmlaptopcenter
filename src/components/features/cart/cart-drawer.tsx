"use client";

import { useCart } from "@/lib/commerce";
import Link from "next/link";
import Image from "next/image";
import {
  CartCheckoutButton,
  CartCost,
  CartLineProvider,
  CartLineQuantity,
  Money,
} from "@/lib/commerce";
import { Button } from "@esmate/shadcn/components/ui/button";
import { Separator } from "@esmate/shadcn/components/ui/separator";
import { Badge } from "@esmate/shadcn/components/ui/badge";
import { ShoppingBag, X, Minus, Plus, Trash2, ArrowRight } from "@esmate/shadcn/pkgs/lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const cart = useCart();
  const isCartEmpty = (cart?.totalQuantity ?? 0) === 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-[60] flex h-full w-[85%] max-w-xs flex-col border-l border-[#d8a928]/20 bg-white/95 shadow-xl sm:w-full sm:max-w-md"
          >
             <div className="flex items-center justify-between border-b border-[#d8a928]/15 bg-gradient-to-r from-[#fcf5e8]/80 to-white/80 px-3 py-3 backdrop-blur-sm sm:px-5 sm:py-4">
               <div className="flex items-center gap-2">
                 <div className="rounded-full bg-[#f6a45d]/10 p-1.5">
                   <ShoppingBag className="h-4 w-4 text-[#f6a45d] sm:h-5 sm:w-5" />
                 </div>
                 <h2 className="text-lg font-semibold text-[#0a0a0a] sm:text-xl">Your Cart</h2>
               </div>
               <Badge className="rounded-full bg-gradient-to-r from-[#f6a45d] to-[#d8861f] px-2.5 py-0.5 text-[10px] font-medium text-[#fcf5e8] shadow-sm sm:px-3 sm:py-1 sm:text-xs">
                 {cart?.totalQuantity ?? 0} {(cart?.totalQuantity ?? 0) !== 1 ? "items" : "item"}
               </Badge>
               <button
                 onClick={() => onOpenChange(false)}
                 className="rounded-full p-1.5 text-[#5A5E55] transition-all hover:bg-[#d8a928]/10 hover:text-[#0a0a0a] hover:scale-110 active:scale-95 sm:p-2"
               >
                 <X className="h-4 w-4 sm:h-5 sm:w-5" />
               </button>
             </div>

             <div className="flex-1 overflow-y-auto px-3 py-3 sm:px-5 sm:py-5">
              {isCartEmpty ? (
                 <div className="flex flex-col items-center justify-center h-full text-center px-4">
                   <div className="rounded-full bg-[#fcf5e8] p-4 mb-4">
                     <ShoppingBag className="h-12 w-12 text-[#d8a928]/40 sm:h-16 sm:w-16" />
                   </div>
                   <p className="text-base font-medium text-[#0a0a0a] sm:text-lg">Your cart is empty</p>
                   <p className="text-xs text-[#5A5E55] mt-1 sm:text-sm">Add some items to get started</p>
                   <Button
                     asChild
                     className="mt-4 rounded-full bg-gradient-to-r from-[#f6a45d] to-[#d8861f] px-6 py-2 text-[#fcf5e8] shadow-md transition-all hover:shadow-lg hover:scale-105 active:scale-95 sm:mt-6 sm:px-8"
                     onClick={() => onOpenChange(false)}
                   >
                     <Link href="/products">Start Shopping</Link>
                   </Button>
                 </div>
               ) : (
                 <div className="space-y-3 sm:space-y-5 pb-2">
                   {cart.lines?.map((line, index) => (
                    <CartLineProvider key={line?.id} line={line!}>
                         <motion.div 
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: index * 0.05 }}
                           className="space-y-2 sm:space-y-4"
                         >
                        <div className="flex items-start gap-2 sm:gap-3">
                           <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#fcf5e8] ring-1 ring-[#d8a928]/20 shadow-sm transition-all hover:shadow-md sm:h-20 sm:w-20 sm:rounded-xl">
                            <Image
                              src={line?.merchandise?.image?.url as string}
                              alt={line?.merchandise?.image?.altText || ""}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>

                          <div className="flex min-w-0 flex-1 flex-col gap-2">
                            <div className="flex items-start justify-between gap-2">
                               <Link
                                 href={`/products/${line?.merchandise?.product?.handle}`}
                                 onClick={() => onOpenChange(false)}
                                 className="line-clamp-2 text-xs font-semibold leading-4 text-[#0a0a0a] transition hover:text-[#f6a45d] sm:text-sm sm:leading-5"
                               >
                                 {line?.merchandise?.product?.title}
                               </Link>
                              <button
                                onClick={() => line?.id && cart.removeLine(line.id)}
                                className="shrink-0 rounded-full p-1 text-[#5A5E55] transition-all hover:bg-red-50 hover:text-red-500 hover:scale-110 active:scale-95"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>

                             <div className="flex flex-wrap gap-1">
                               {line?.merchandise?.selectedOptions?.map((option) => (
                                 <Badge
                                   key={option?.name}
                                   variant="secondary"
                                   className="rounded-full border border-[#d8a928]/20 bg-[#fcf5e8] px-1.5 py-0 text-[9px] font-medium text-[#0a0a0a] sm:px-2 sm:py-0.5 sm:text-[10px]"
                                 >
                                   {option?.value}
                                 </Badge>
                               ))}
                             </div>

                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1 sm:gap-2">
                                <button
                                  onClick={() => line?.id && cart.updateQuantity(line.id, line.quantity - 1)}
                                  className="h-5 w-5 rounded-full border-2 border-[#d8a928]/30 flex items-center justify-center text-[#5A5E55] transition-all hover:border-[#f6a45d] hover:bg-[#f6a45d] hover:text-white hover:scale-110 active:scale-95 text-[10px] sm:h-6 sm:w-6 sm:text-xs"
                                >
                                  <Minus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                </button>
                                <span className="min-w-[20px] text-center text-xs font-semibold sm:min-w-[24px] sm:text-sm">
                                  <CartLineQuantity />
                                </span>
                                <button
                                  onClick={() => line?.id && cart.updateQuantity(line.id, line.quantity + 1)}
                                  className="h-5 w-5 rounded-full border-2 border-[#d8a928]/30 flex items-center justify-center text-[#5A5E55] transition-all hover:border-[#f6a45d] hover:bg-[#f6a45d] hover:text-white hover:scale-110 active:scale-95 text-[10px] sm:h-6 sm:w-6 sm:text-xs"
                                >
                                  <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                </button>
                              </div>

                              <Money
                                data={line?.cost?.totalAmount}
                                className="shrink-0 text-xs font-bold text-[#0a0a0a] sm:text-sm"
                              />
                            </div>
                          </div>
                        </div>

                         <Separator className="bg-gradient-to-r from-[#d8a928]/15 via-[#d8a928]/5 to-transparent my-1 sm:my-0" />
                      </motion.div>
                    </CartLineProvider>
                  ))}
                </div>
              )}
            </div>

            {!isCartEmpty && (
              <div className="border-t border-[#d8a928]/15 bg-gradient-to-b from-white to-[#fcf5e8]/30 px-3 pb-20 pt-5 backdrop-blur-sm lg:px-5 lg:pb-5">
                 <div className="space-y-3 sm:space-y-4">
                   <div className="flex items-center justify-between">
                     <span className="text-sm font-medium text-[#5A5E55] sm:text-base">Subtotal</span>
                     <span className="text-lg font-bold text-[#0a0a0a] sm:text-xl">
                       <CartCost amountType="subtotal" />
                     </span>
                   </div>

                   <p className="text-[10px] leading-4 text-[#5A5E55] sm:text-xs sm:leading-5">
                     Shipping and taxes calculated at checkout
                   </p>

                   <div className="flex gap-2 sm:gap-3 pt-1">
                     <CartCheckoutButton
                       className="flex-1 inline-flex h-10 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f6a45d] to-[#d8861f] text-sm font-semibold text-[#fcf5e8] shadow-md transition-all hover:shadow-lg hover:scale-[1.02] active:scale-98 sm:h-11 sm:text-base"
                     >
                       Checkout
                       <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                     </CartCheckoutButton>

                     <Button
                       variant="outline"
                       className="flex-1 h-10 rounded-full border-2 border-[#d8a928]/30 text-sm font-semibold text-[#0a0a0a] transition-all hover:border-[#d8a928] hover:bg-[#fcf5e8] hover:shadow-md hover:scale-[1.02] active:scale-98 sm:h-11 sm:text-base"
                       onClick={() => onOpenChange(false)}
                     >
                       Continue
                     </Button>
                   </div>
                 </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
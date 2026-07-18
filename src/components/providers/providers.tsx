"use client";

import { CartProvider } from "@/lib/commerce";
import { ReactNode } from "react";
import { Toaster } from "sonner";

interface Props {
  children: ReactNode;
}

export default function Layout(props: Props) {
  return (
    <>
      <CartProvider>{props.children}</CartProvider>
      <Toaster />
    </>
  );
}

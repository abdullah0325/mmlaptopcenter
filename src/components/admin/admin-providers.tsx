"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { Toaster } from "sonner";

interface Props {
  children: ReactNode;
}

export default function AdminProviders(props: Props) {
  return (
    <SessionProvider>
      {props.children}
      <Toaster position="top-right" />
    </SessionProvider>
  );
}
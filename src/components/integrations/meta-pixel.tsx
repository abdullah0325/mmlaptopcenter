"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { META_PIXEL_ID, pageView } from "@/lib/pixel";

let lastTrackedLocation: string | null = null;

export function MetaPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pixelReady, setPixelReady] = useState(false);

  const query = searchParams.toString();
  const location = query ? `${pathname}?${query}` : pathname;

  useEffect(() => {
    if (!pixelReady || lastTrackedLocation === location) return;
    pageView();
    lastTrackedLocation = location;
  }, [location, pixelReady]);

  if (!META_PIXEL_ID) return null;

  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        onReady={() => setPixelReady(true)}
      >
        {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',${JSON.stringify(META_PIXEL_ID)});`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${encodeURIComponent(META_PIXEL_ID)}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

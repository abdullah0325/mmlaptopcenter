"use client";

import { useState, useEffect, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  const isAlreadyInstalled = useCallback(() => {
    return window.matchMedia("(display-mode: standalone)").matches ||
           (window.navigator as any).standalone === true;
  }, []);

  const checkInstallStatus = useCallback(() => {
    if (isAlreadyInstalled()) {
      setIsInstalled(true);
      return false;
    }
    return true;
  }, [isAlreadyInstalled]);

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream);

    if (!checkInstallStatus()) {
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 3000);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [checkInstallStatus]);

  const installApp = useCallback(async () => {
    if (isIOS) {
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      if (isSafari) {
        alert("To install MM Laptop Center app:\n\n1. Tap the Share button\n2. Tap 'Add to Home Screen'\n3. Tap 'Add'");
      }
      return;
    }

    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  }, [deferredPrompt, isIOS]);

  const dismissPrompt = useCallback(() => {
    setShowInstallPrompt(false);
    localStorage.setItem("pwa-install-dismissed", "true");
  }, []);

  useEffect(() => {
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed) {
      setShowInstallPrompt(false);
    }
  }, []);

  return {
    deferredPrompt,
    isInstalled,
    isIOS,
    showInstallPrompt,
    installApp,
    dismissPrompt,
  };
}

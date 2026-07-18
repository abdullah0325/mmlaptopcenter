"use client";

import { usePWAInstall } from "@/hooks/use-pwa-install";
import { useState, useEffect } from "react";
import { FiX, FiDownload, FiSmartphone } from "react-icons/fi";

export default function InstallPrompt() {
  const { showInstallPrompt, installApp, dismissPrompt, isIOS, isInstalled } = usePWAInstall();
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isInstalled && showInstallPrompt && mounted) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [showInstallPrompt, isInstalled, mounted]);

  if (!mounted || isInstalled || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <div className="bg-[#1a1308] text-white rounded-xl shadow-2xl overflow-hidden">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-[#d8a928] rounded-lg flex items-center justify-center">
              <FiSmartphone className="w-5 h-5 text-[#0a0a0a]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm">Install MM Laptop Center</h3>
              <p className="text-xs text-gray-300 mt-1">
                {isIOS
                  ? "Add to Home Screen for quick access"
                  : "Get the app for faster, offline access"}
              </p>
            </div>
            <button
              onClick={dismissPrompt}
              className="flex-shrink-0 p-1 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Dismiss"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="px-4 pb-4">
          <button
            onClick={installApp}
            className="w-full bg-[#d8a928] hover:bg-[#b8923f] text-[#0a0a0a] font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
          >
            <FiDownload className="w-4 h-4" />
            {isIOS ? "Add to Home Screen" : "Install App"}
          </button>
        </div>
      </div>
    </div>
  );
}

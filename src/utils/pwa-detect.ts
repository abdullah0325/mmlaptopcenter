export function isPWA(): boolean {
  if (typeof window === "undefined") return false;
  
  return window.matchMedia("(display-mode: standalone)").matches ||
         (window.navigator as any).standalone === true ||
         window.matchMedia("(display-mode: fullscreen)").matches ||
         window.matchMedia("(display-mode: minimal-ui)").matches;
}

export function isRunningAsPWA(): boolean {
  return isPWA();
}

export function isIOS(): boolean {
  if (typeof window === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}

export function isAndroid(): boolean {
  if (typeof window === "undefined") return false;
  return /android/i.test(navigator.userAgent);
}

export function isMobile(): boolean {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

export function isSafari(): boolean {
  if (typeof window === "undefined") return false;
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

export function getPWAStatus(): {
  isPWA: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
  isSafari: boolean;
} {
  return {
    isPWA: isPWA(),
    isIOS: isIOS(),
    isAndroid: isAndroid(),
    isMobile: isMobile(),
    isSafari: isSafari(),
  };
}

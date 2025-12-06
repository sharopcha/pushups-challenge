export function isStandalonePWA() {
  if (typeof window === "undefined") return false;

  const isStandaloneDisplay =
    window.matchMedia?.("(display-mode: standalone)").matches ||
    // iOS Safari
    (window.navigator as any).standalone === true;

  return isStandaloneDisplay;
}
// ==========================================
// Hook: useMediaQuery
// Centralized media query hook based on window.matchMedia
// Follows single-DOM responsive principle without window.innerWidth resize listeners
// ==========================================

import { useState, useEffect } from "react";

/**
 * Custom hook to track matches for a given CSS media query.
 * @param {string} query - CSS media query string (e.g., '(min-width: 768px)')
 * @returns {boolean} Whether the media query currently matches
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    const mediaQueryList = window.matchMedia(query);
    setMatches(mediaQueryList.matches);

    const handler = (event) => {
      setMatches(event.matches);
    };

    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener("change", handler);
    } else {
      mediaQueryList.addListener(handler);
    }

    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener("change", handler);
      } else {
        mediaQueryList.removeListener(handler);
      }
    };
  }, [query]);

  return matches;
}

/**
 * Shortcut hook for mobile view (< 768px)
 * @returns {boolean}
 */
export function useIsMobile() {
  return useMediaQuery("(max-width: 767px)");
}

/**
 * Shortcut hook for tablet view (768px - 1023px)
 * @returns {boolean}
 */
export function useIsTablet() {
  return useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
}

/**
 * Shortcut hook for desktop view (>= 1024px)
 * @returns {boolean}
 */
export function useIsDesktop() {
  return useMediaQuery("(min-width: 1024px)");
}

export default useMediaQuery;

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop component:
 * Listens to location changes (pathname, search, hash) and automatically scrolls
 * the window/document to the topmost position instantly on navigation.
 */
export function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // If a hash exists (e.g. #section), try to scroll to that element
    if (hash) {
      const element = document.getElementById(hash.replace("#", ""));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    // Otherwise, scroll the viewport directly to the top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" as ScrollBehavior,
    });

    // Also reset document elements in case body or root has scroll offset
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }
  }, [pathname, search, hash]);

  return null;
}

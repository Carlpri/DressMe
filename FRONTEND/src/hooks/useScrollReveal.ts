import { useEffect, useRef } from "react";

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  staggerMs?: number;
  delayMs?: number;
}

/**
 * Lightweight, high-performance scroll reveal hook using native IntersectionObserver.
 * Triggers a subtle 12-16px slide + fade in, with optional staggered children.
 * Respects `prefers-reduced-motion` immediately without transitions.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(options: ScrollRevealOptions = {}) {
  const ref = useRef<T | null>(null);
  const {
    threshold = 0.1,
    rootMargin = "0px 0px -40px 0px",
    staggerMs = 60,
    delayMs = 0,
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      el.classList.add("reveal-visible");
      const children = el.querySelectorAll(".reveal-child");
      children.forEach((child) => child.classList.add("reveal-visible"));
      return;
    }

    el.classList.add("reveal-init");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              el.classList.add("reveal-visible");

              // Handle staggered children if present
              const children = el.querySelectorAll<HTMLElement>(".reveal-child");
              children.forEach((child, index) => {
                child.classList.add("reveal-init");
                child.style.transitionDelay = `${index * staggerMs}ms`;
                // Trigger visibility in next microtask
                requestAnimationFrame(() => {
                  child.classList.add("reveal-visible");
                });
              });
            }, delayMs);

            observer.unobserve(el);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, staggerMs, delayMs]);

  return ref;
}

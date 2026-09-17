"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Lenis smooth scroll. The base layer the rest of the motion sits on.
 *
 * Note the distinction that matters: this EASES the scroll, it does not TAKE
 * scroll away from the user. No scroll-jacking. Wheel, trackpad, keyboard and
 * scrollbar all still behave normally.
 *
 * Disabled entirely under prefers-reduced-motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Make in-page anchor links (#work, #about…) route through Lenis so they
    // ease instead of jumping.
    const onClick = (e: MouseEvent) => {
      // The logo: already on the home page, so the Link doesn't navigate and
      // nothing scrolls. Send it back to the top through Lenis.
      const toTop = (e.target as HTMLElement)?.closest?.("[data-scroll-top]");
      if (toTop) {
        e.preventDefault();
        lenis.scrollTo(0);
        return;
      }

      const anchor = (e.target as HTMLElement)?.closest?.(
        'a[href^="#"]'
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      // No offset. Sections are a full viewport tall and centre their own
      // content, so nudging down by the header height would push their last
      // 64px below the fold. The header floats over the section's padding.
      lenis.scrollTo(el as HTMLElement);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}

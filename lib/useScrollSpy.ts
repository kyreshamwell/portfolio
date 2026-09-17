"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll-spy.
 *
 * This is the piece people forget on a one-page site: the nav indicator has no
 * route to react to, so "active" has to come from scroll position.
 *
 * Two things it has to get right, and the naive version gets both wrong:
 *
 *   1. It must CLEAR. An observer that only sets the active id on intersection
 *      leaves the last section highlighted forever. Jump back to the top and
 *      the underline is still sitting under Contact.
 *   2. It must start empty, not at ids[0]. The hero isn't a tracked section,
 *      so there is no correct default; anything else lights up a nav item
 *      before you've scrolled.
 *
 * So we keep every section's current visibility ratio and recompute the winner
 * on each callback. When nothing is on screen, the winner is "" and the nav
 * goes quiet.
 */
export function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState("");
  const ratios = useRef<Record<string, number>>({});

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length) {
      setActive("");
      return;
    }

    ratios.current = {};

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.current[entry.target.id] = entry.isIntersecting
            ? entry.intersectionRatio
            : 0;
        }

        let best = "";
        let bestRatio = 0;
        for (const [id, ratio] of Object.entries(ratios.current)) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        }
        setActive(best);
      },
      {
        // Band across the middle of the viewport, so a section becomes active
        // when it actually occupies the screen. Not when its first pixel
        // appears.
        rootMargin: "-25% 0px -25% 0px",
        threshold: [0, 0.15, 0.35, 0.6, 0.85, 1],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

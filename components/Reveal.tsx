"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * THE reveal primitive.
 *
 * Roughly 90% of what reads as "designed" on a modern site is this one move:
 * start 20px low and transparent, slide up and fade in on entry, staggered.
 * Use it EVERYWHERE. Consistency is what looks intentional.
 *
 * Built on IntersectionObserver + a CSS transition rather than a JS animation
 * library, deliberately:
 *
 *   1. FAIL VISIBLE. Text must never be permanently invisible because an
 *      animation didn't run. If the observer never fires, or the element is
 *      already on screen at mount, we show the content immediately. An
 *      invisible About section is a far worse bug than a missing fade.
 *   2. CSS transitions are driven by the compositor, not requestAnimationFrame,
 *      so they still resolve in a background tab. JS-driven animation loops
 *      freeze when rAF is suspended, which leaves elements stuck at their
 *      starting opacity.
 */
export function Reveal({
  children,
  delay = 0,
  y = 20,
  className,
}: {
  children: ReactNode;
  /** Seconds. Stagger siblings with delay={i * 0.08}. */
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    // Already on screen at mount (above the fold). Show now, don't wait.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -80px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : `translateY(${y}px)`,
        transition: `opacity 600ms cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 600ms cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

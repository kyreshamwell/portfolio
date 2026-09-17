"use client";

import { useEffect, useState } from "react";

/**
 * Loading overlay. A curtain.
 *
 * Two panels meeting at the centre line, which part and slide off to the left
 * and right to reveal the page.
 *
 * It has to be two elements: a single element with `clip-path: inset(0 50% 0
 * 50%)` collapses TOWARD the centre, which is a curtain closing, not opening.
 * Splitting it means each half can travel outward independently.
 *
 * The panels invert automatically. They paint `bg-fg` over a `bg-bg` page,
 * and both tokens flip with the theme, so it's a light curtain on the dark
 * theme and a dark one on the light theme with no conditional logic.
 *
 * Rules it follows deliberately:
 *   - Plays on EVERY page load, not once per session.
 *   - Waits on real work (fonts), with a hard ceiling. No fake percentage
 *     counter crawling to 100.
 *   - Skipped entirely under prefers-reduced-motion.
 *
 * Built on CSS transitions and timeouts rather than a JS animation loop. This
 * is the one component where a stalled animation would be catastrophic. A
 * full-screen panel that never exits hides the entire site. Timeouts fire in
 * background tabs; requestAnimationFrame does not.
 */

const MIN_MS = 700; // floor, so it doesn't flash on a warm cache
const MAX_MS = 1500; // ceiling. Never let this grow.
const EXIT_MS = 900; // the curtain travel. The part worth watching

export function Loader() {
  const [mounted, setMounted] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setGone(true);
      return;
    }

    setMounted(true);
    document.body.style.overflow = "hidden";

    const started = Date.now();
    let exitTimer: ReturnType<typeof setTimeout>;
    let doneTimer: ReturnType<typeof setTimeout>;

    const finish = () => {
      const remaining = Math.max(0, MIN_MS - (Date.now() - started));
      exitTimer = setTimeout(() => {
        setExiting(true);
        doneTimer = setTimeout(() => {
          setGone(true);
          document.body.style.overflow = "";
        }, EXIT_MS);
      }, remaining);
    };

    const ceiling = setTimeout(finish, MAX_MS);
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    Promise.resolve(fonts?.ready).then(finish).catch(finish);

    return () => {
      clearTimeout(ceiling);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (gone) return null;

  const panel = `absolute top-0 h-full w-1/2 bg-fg`;
  const ease = "cubic-bezier(0.76, 0, 0.24, 1)"; // slow start, fast middle

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden" aria-hidden>
      <div
        className={`${panel} left-0`}
        style={{
          transform: exiting ? "translateX(-100%)" : "translateX(0)",
          transition: `transform ${EXIT_MS}ms ${ease}`,
        }}
      />
      <div
        className={`${panel} right-0`}
        style={{
          transform: exiting ? "translateX(100%)" : "translateX(0)",
          transition: `transform ${EXIT_MS}ms ${ease}`,
        }}
      />

      {/* Progress hairline, in the page colour so it reads against the
          curtain. Fades as the panels part so it doesn't linger over the
          revealed page. */}
      <div className="absolute bottom-0 left-0 h-px w-full bg-bg/20">
        <div
          className="h-full bg-bg"
          style={{
            transform: mounted ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: "left",
            opacity: exiting ? 0 : 1,
            transition: `transform ${MAX_MS}ms linear, opacity 250ms ease-out`,
          }}
        />
      </div>
    </div>
  );
}

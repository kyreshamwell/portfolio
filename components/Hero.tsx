"use client";

import { useEffect, useState } from "react";
import { Typewriter } from "@/components/Typewriter";
import { site } from "@/lib/site";

/**
 * Hero.
 *
 * The greeting types across two lines — "Hi," lands, then the name follows
 * underneath — and only once that finishes do the tagline and buttons fade up.
 * Sequenced so it reads as one gesture rather than three things happening at
 * once.
 *
 * The typing starts ~1.1s in, which is roughly when the loader curtain
 * finishes parting. If you change the loader timings, change LEAD_MS to match.
 */

const LEAD_MS = 1100;

export function Hero() {
  const [line1Done, setLine1Done] = useState(false);
  const [line2Done, setLine2Done] = useState(false);
  const [showRest, setShowRest] = useState(false);

  // Under reduced motion the Typewriter renders its full text immediately and
  // never fires onDone, so nothing downstream would ever unlock. Short-circuit
  // the whole sequence instead.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLine1Done(true);
      setLine2Done(true);
      setShowRest(true);
    }
  }, []);

  useEffect(() => {
    if (!line2Done) return;
    const t = setTimeout(() => setShowRest(true), 150);
    return () => clearTimeout(t);
  }, [line2Done]);

  return (
    <section className="relative flex min-h-[92vh] items-center px-5 sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="max-w-4xl text-4xl font-medium leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
          {/* min-h on each line reserves the row before it's typed, so the
              tagline below doesn't jump when the second line appears. */}
          <span className="block min-h-[1.15em]">
            <Typewriter
              words={site.greeting[0]}
              loop={false}
              startDelayMs={LEAD_MS}
              typeMs={70}
              onDone={() => setLine1Done(true)}
            />
          </span>
          <span className="block min-h-[1.15em]">
            {line1Done && (
              <Typewriter
                words={site.greeting[1]}
                loop={false}
                typeMs={70}
                onDone={() => setLine2Done(true)}
              />
            )}
          </span>
        </h1>

        {/* Rotating line. Waits for the greeting to finish so two carets are
            never blinking at once. min-h reserves the row so the tagline
            below doesn't shift as the text cycles. */}
        <p className="mt-4 min-h-[1.6em] text-lg text-accent sm:text-2xl">
          {line2Done && (
            <Typewriter words={site.roles} typeMs={55} deleteMs={28} />
          )}
        </p>

        <div
          style={{
            opacity: showRest ? 1 : 0,
            transform: showRest ? "none" : "translateY(16px)",
            transition:
              "opacity 700ms cubic-bezier(0.16,1,0.3,1), transform 700ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
            {site.tagline}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#work"
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-soft"
            >
              See the work
            </a>
            <a
              href={`mailto:${site.email}`}
              className="rounded-full border border-border px-5 py-2.5 text-sm text-muted transition-colors hover:border-accent/40 hover:text-fg"
            >
              {site.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

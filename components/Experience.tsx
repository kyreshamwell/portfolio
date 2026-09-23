"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Reveal } from "@/components/Reveal";
import {
  experience,
  formatRange,
  kindLabel,
  type ExperienceEntry,
} from "@/lib/experience";
import { getProject } from "@/lib/projects";

/**
 * Experience. The career timeline, as a row you scroll sideways.
 *
 * The page never gets taken over. Vertical scrolling passes straight through
 * to the page, and the row moves only when you ask it to: a sideways swipe on
 * a trackpad or touchscreen, shift + wheel, the arrow keys once it has focus,
 * or the arrow buttons for a mouse without horizontal scroll.
 *
 * `data-lenis-prevent-horizontal` is what makes the swipe work. Without it,
 * Lenis claims every wheel event on the page, including sideways ones, and
 * the row can't be scrolled with a trackpad at all.
 *
 * The rail fills with the row's scroll progress, which puts the tip of the
 * fill at progress x visible width: it sweeps from the left edge of the row
 * to the right edge as you scroll to the end. Each dot lights up when the tip
 * reaches it.
 *
 * Everything renders from lib/experience.ts.
 */

// Oldest on the left, so scrolling right moves you toward now.
const entries = [...experience].reverse();

// Lines the first entry up with the page's content column (max-w-6xl plus its
// padding). The track is padded by it, and the scroller snaps to the same
// offset, so a snapped entry lands exactly where the first one starts.
const TRACK_PAD =
  "px-5 sm:px-[max(2rem,calc((100vw_-_72rem)/2_+_2rem))]";
const SNAP_PAD =
  "scroll-pl-5 sm:scroll-pl-[max(2rem,calc((100vw_-_72rem)/2_+_2rem))]";

export function Experience() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();

  // Where each dot sits along the rail, as a fraction of the track's width.
  // Depends on font size and viewport, so it's measured rather than computed.
  const [stops, setStops] = useState<number[]>([]);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const { scrollX, scrollXProgress } = useScroll({ container: scrollerRef });

  const updateEnds = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };
  useMotionValueEvent(scrollX, "change", updateEnds);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      const width = track.offsetWidth;
      const items = Array.from(track.querySelectorAll<HTMLElement>(":scope > li"));
      // +4.5 is the centre of the 9px dot at the left edge of each entry.
      setStops(items.map((li) => (li.offsetLeft + 4.5) / width));
      updateEnds();
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => ro.disconnect();
  }, []);

  /** One entry's width per click. Snapping squares up any remainder. */
  const step = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    const first = trackRef.current?.querySelector("li");
    if (!el || !first) return;
    el.scrollBy({
      left: dir * first.getBoundingClientRect().width,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  // Fade whichever edge still has more timeline past it.
  const mask = `linear-gradient(to right, ${canPrev ? "transparent" : "black"} 0, black 64px, black calc(100% - 64px), ${canNext ? "transparent" : "black"} 100%)`;

  return (
    <section
      id="experience"
      className="flex min-h-screen flex-col justify-center py-24"
    >
      <div className="mx-auto mb-10 flex w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            Experience
          </p>
        </Reveal>
        <div className="flex gap-2">
          <StepButton dir={-1} disabled={!canPrev} onClick={() => step(-1)} />
          <StepButton dir={1} disabled={!canNext} onClick={() => step(1)} />
        </div>
      </div>

      <div
        ref={scrollerRef}
        data-lenis-prevent-horizontal
        tabIndex={0}
        role="region"
        aria-label="Career timeline. Scroll sideways for more."
        style={{ maskImage: mask, WebkitMaskImage: mask }}
        className={`snap-x snap-mandatory overflow-x-auto pb-2 outline-none [scrollbar-width:none] focus-visible:ring-1 focus-visible:ring-accent/40 [&::-webkit-scrollbar]:hidden ${SNAP_PAD}`}
      >
        <ol ref={trackRef} className={`relative flex w-max ${TRACK_PAD}`}>
          {/* rail, then the accent fill drawn over it */}
          <span
            aria-hidden
            className="absolute inset-x-0 top-[32px] h-px bg-border"
          />
          <motion.span
            aria-hidden
            style={{ scaleX: scrollXProgress }}
            className="absolute inset-x-0 top-[32px] h-px origin-left bg-accent"
          />

          {entries.map((entry, i) => (
            <Entry
              key={`${entry.title}-${entry.end}`}
              entry={entry}
              progress={scrollXProgress}
              at={stops[i]}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}

function Entry({
  entry,
  progress,
  at,
}: {
  entry: ExperienceEntry;
  progress: MotionValue<number>;
  at: number | undefined;
}) {
  const project = entry.project ? getProject(entry.project) : undefined;
  // A project entry with no points of its own borrows the carousel blurb, so
  // the one-liner only has to be written once.
  const points =
    entry.points.length > 0 ? entry.points : project ? [project.blurb] : [];

  return (
    <li className="w-[17rem] shrink-0 snap-start pr-8 sm:w-[21rem] sm:pr-12">
      {/* Fixed-height date row so every dot lands on the rail at top-[32px]:
          16px of date, 12px gap, then the 9px dot centred on 32.5px. */}
      <p className="h-4 text-xs leading-4 tabular-nums text-muted">
        {formatRange(entry.start, entry.end)}
      </p>

      <span className="relative mt-3 block h-[9px] w-[9px]">
        <span className="absolute inset-0 rounded-full border border-border bg-bg" />
        {at !== undefined && <LitDot progress={progress} at={at} />}
      </span>

      <Reveal>
        <p className="mt-6 text-[11px] uppercase tracking-[0.15em] text-muted">
          {kindLabel[entry.kind]}
        </p>
        <h3 className="mt-2 text-lg font-medium tracking-tight">
          {entry.title}
        </h3>
        <p className="mt-1 text-sm text-muted">
          {entry.org}
          {entry.place && <> · {entry.place}</>}
        </p>

        {points.length > 0 && (
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted">
            {points.map((point) => (
              <li
                key={point}
                className="relative pl-4 before:absolute before:left-0 before:top-[0.7em] before:h-1 before:w-1 before:rounded-full before:bg-muted/60"
              >
                {point}
              </li>
            ))}
          </ul>
        )}

        {project?.caseStudy ? (
          <Link
            href={`/work/${project.slug}`}
            className="mt-4 inline-block text-sm text-accent transition-colors hover:text-accent-soft"
          >
            Case study →
          </Link>
        ) : project?.href ? (
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm text-accent transition-colors hover:text-accent-soft"
          >
            Live site ↗
          </a>
        ) : null}
      </Reveal>
    </li>
  );
}

/** The accent fill of a dot, switched on once the rail's fill reaches it. */
function LitDot({ progress, at }: { progress: MotionValue<number>; at: number }) {
  const opacity = useTransform(progress, (v) => (v >= at ? 1 : 0));
  return (
    <motion.span
      style={{ opacity }}
      className="absolute inset-0 rounded-full border border-accent bg-accent transition-opacity duration-300"
    />
  );
}

/** Same look as the carousel's arrows, sitting inline instead of floating. */
function StepButton({
  dir,
  disabled,
  onClick,
}: {
  dir: 1 | -1;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === -1 ? "Earlier" : "Later"}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-bg/70 text-muted backdrop-blur transition-[color,border-color,opacity] hover:border-accent/40 hover:text-fg disabled:pointer-events-none disabled:opacity-30"
    >
      {dir === -1 ? "←" : "→"}
    </button>
  );
}

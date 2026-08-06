"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { projects, statusLabel, type Project } from "@/lib/projects";

/**
 * THE SHOWPIECE.
 *
 * An infinite-looping 3D carousel. The centre card is live: its screen
 * recording autoplays (muted, looping) while it's active and pauses the moment
 * it isn't, so only one video is ever decoding. Side cards sit back in Z,
 * dimmed and slightly blurred.
 *
 * Interaction, in priority order:
 *   - drag / swipe          (works on trackpad and touch)
 *   - arrow buttons
 *   - the tab strip underneath (same sliding-underline language as the header)
 *   - ← / → keys when the carousel is on screen
 *   - autoplay, which pauses on hover, on focus, and when the tab is hidden
 *
 * If a project has no video, its poster image is used. Ship with posters, add
 * video later — nothing breaks.
 */

const AUTOPLAY_MS = 7000;

/** Shortest signed distance from `index` to `i` on a ring of length `n`. */
function signedOffset(i: number, index: number, n: number) {
  let d = i - index;
  if (d > n / 2) d -= n;
  if (d < -n / 2) d += n;
  return d;
}

export function ProjectCarousel() {
  const n = projects.length;
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + n) % n),
    [n]
  );

  /* --- autoplay: only while visible, unpaused, and motion is welcome ----- */
  useEffect(() => {
    if (paused || reduce || !inView) return;
    const t = setTimeout(() => go(1), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [index, paused, reduce, inView, go]);

  /* --- pause when the tab is backgrounded ------------------------------- */
  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  /* --- only animate/autoplay while on screen ---------------------------- */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* --- keyboard ---------------------------------------------------------- */
  useEffect(() => {
    if (!inView) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inView, go]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* ---- stage ---- */}
      <div
        className="relative mx-auto w-full select-none"
        style={{ perspective: "2000px" }}
      >
        {/* SIZER — the only card in normal flow. It's invisible, and it exists
            purely to give the stage the exact height of the ACTIVE card at the
            current breakpoint. The alternative (hardcoded stage heights) breaks
            the moment the card's meta block wraps to two lines or stacks on
            mobile, and the card silently overflows into the tab strip below. */}
        <div
          aria-hidden
          className="pointer-events-none invisible mx-auto w-[88%] max-w-3xl sm:w-[72%]"
        >
          <Card project={projects[index]} isActive onSelect={() => {}} sizer />
        </div>

        <motion.div
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d" }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60) go(1);
            else if (info.offset.x > 60) go(-1);
          }}
        >
          {projects.map((project, i) => {
            const d = signedOffset(i, index, n);
            const isActive = d === 0;
            return (
              <motion.article
                key={project.slug}
                className="absolute left-1/2 top-1/2 w-[88%] max-w-3xl sm:w-[72%]"
                style={{ zIndex: 10 - Math.abs(d) }}
                // Snap to the layout on mount rather than animating into it —
                // without this the cards visibly drop into place on first
                // paint, because y:-50% would animate up from zero.
                initial={false}
                animate={{
                  // Plain percentage rather than calc(). translateX % is
                  // relative to the element's own width, so the -50 centring
                  // term folds straight into the offset — and Motion
                  // interpolates a bare percentage far more reliably than a
                  // calc() expression.
                  x: `${d * 58 - 50}%`,
                  y: "-50%",
                  scale: isActive ? 1 : 0.82,
                  rotateY: reduce ? 0 : d * -12,
                  opacity: Math.abs(d) > 1 ? 0 : isActive ? 1 : 0.4,
                  filter: isActive ? "blur(0px)" : "blur(3px)",
                }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 220, damping: 32, mass: 0.9 }
                }
              >
                <Card
                  project={project}
                  isActive={isActive}
                  onSelect={() => !isActive && setIndex(i)}
                />
              </motion.article>
            );
          })}
        </motion.div>

        {/* ---- arrows ---- */}
        <Arrow side="left" onClick={() => go(-1)} />
        <Arrow side="right" onClick={() => go(1)} />
      </div>

      {/* ---- tab strip: same sliding-underline language as the header ---- */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-1">
        {projects.map((p, i) => (
          <button
            key={p.slug}
            onClick={() => setIndex(i)}
            className="relative px-3 py-1.5 text-xs sm:text-sm"
            aria-current={i === index}
          >
            <span
              className={
                i === index
                  ? "font-medium text-accent"
                  : "text-muted hover:text-fg/80"
              }
            >
              {p.title}
            </span>
            {i === index && (
              <motion.span
                layoutId="carousel-indicator"
                className="absolute inset-x-3 -bottom-0.5 h-px bg-accent"
                transition={
                  reduce
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 400, damping: 35 }
                }
              />
            )}
          </button>
        ))}
      </div>

      {/* ---- autoplay progress hairline ---- */}
      <div className="mx-auto mt-4 h-px w-40 overflow-hidden bg-border">
        {!reduce && !paused && inView && (
          <motion.div
            key={index}
            className="h-full w-full origin-left bg-accent/60"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
          />
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
 * Card
 * ========================================================================*/

function Card({
  project,
  isActive,
  onSelect,
  sizer = false,
}: {
  project: Project;
  isActive: boolean;
  onSelect: () => void;
  /** Rendered only to establish the stage height — skips media loading. */
  sizer?: boolean;
}) {
  return (
    <div
      onClick={onSelect}
      className={`overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-black/60 ${
        isActive ? "" : "cursor-pointer"
      }`}
    >
      {/* media */}
      {/* max-h caps the media on short viewports so the card's title, blurb
          and buttons stay above the fold — the actions are the point of the
          card, and a 16:10 still can push them off screen on a laptop. */}
      <div className="relative aspect-[16/10] max-h-[40vh] w-full overflow-hidden bg-surface-2">
        {!sizer && <Media project={project} isActive={isActive} />}

        {/* status chip */}
        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-border bg-bg/70 px-3 py-1 text-[11px] backdrop-blur">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              project.status === "live"
                ? "bg-accent"
                : project.status === "in-review"
                ? "bg-amber-400"
                : "bg-muted"
            }`}
          />
          <span className="text-muted">{statusLabel[project.status]}</span>
        </div>

        {/* bottom fade so text always reads over the video */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface to-transparent" />
      </div>

      {/* meta */}
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
        <div className="min-w-0">
          <h3 className="text-lg font-medium tracking-tight sm:text-xl">
            {project.title}
          </h3>
          <p className="mt-1 max-w-xl text-sm text-muted">{project.blurb}</p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {project.stack.map((s) => (
              <li
                key={s}
                className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Actions are only reachable on the active card — inactive cards are
            scaled down and blurred, so their buttons shouldn't be tab stops. */}
        <div
          className={`flex shrink-0 items-center gap-2 ${
            isActive ? "" : "pointer-events-none opacity-0"
          }`}
        >
          {project.caseStudy && (
            <Link
              href={`/work/${project.slug}`}
              tabIndex={isActive ? 0 : -1}
              className="rounded-full bg-accent px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-accent-soft"
            >
              Case study
            </Link>
          )}
          {project.href && (
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={isActive ? 0 : -1}
              className="rounded-full border border-border px-4 py-2 text-xs text-muted transition-colors hover:border-accent/40 hover:text-fg"
            >
              Live ↗
            </a>
          )}
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={isActive ? 0 : -1}
              className="rounded-full border border-border px-4 py-2 text-xs text-muted transition-colors hover:border-accent/40 hover:text-fg"
            >
              Code ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
 * Media — video when active, poster otherwise.
 * Only one video is ever playing, which keeps this cheap.
 * ========================================================================*/

function Media({ project, isActive }: { project: Project; isActive: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  // A poster path that 404s (i.e. every project until you add artwork) would
  // otherwise render as a broken-image icon with alt text next to it. Fall
  // back to the hatched placeholder instead.
  const [posterFailed, setPosterFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // The onError prop alone isn't enough: the image is server-rendered, so a
  // 404 usually fires while the HTML is still parsing — before React attaches
  // the handler. Re-check the decoded state on mount to catch those.
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth === 0) setPosterFailed(true);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive && !reduce) {
      v.play().catch(() => {
        /* autoplay blocked — poster stays up, no harm */
      });
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [isActive, reduce]);

  if (!project.video) {
    return project.poster && !posterFailed ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        ref={imgRef}
        src={project.poster}
        alt={`${project.title} preview`}
        className="h-full w-full object-cover"
        draggable={false}
        onError={() => setPosterFailed(true)}
      />
    ) : (
      <Placeholder title={project.title} />
    );
  }

  return (
    <video
      ref={videoRef}
      src={project.video}
      poster={project.poster || undefined}
      muted
      loop
      playsInline
      preload="metadata"
      className="h-full w-full object-cover"
      // Videos are decoration here; the card text carries the meaning.
      aria-hidden
    />
  );
}

/** Shown until you drop real media in public/media/. */
function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.02)_10px,rgba(255,255,255,0.02)_20px)]">
      <p className="px-6 text-center text-xs text-muted">
        Add <code className="text-fg">public/media/</code> artwork for {title}
      </p>
    </div>
  );
}

/* ==========================================================================
 * Arrows
 * ========================================================================*/

function Arrow({
  side,
  onClick,
}: {
  side: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={side === "left" ? "Previous project" : "Next project"}
      className={`absolute top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-bg/70 text-muted backdrop-blur transition-colors hover:border-accent/40 hover:text-fg ${
        side === "left" ? "left-2 sm:left-6" : "right-2 sm:right-6"
      }`}
    >
      {side === "left" ? "←" : "→"}
    </button>
  );
}

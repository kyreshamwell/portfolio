"use client";

import { useEffect, useState } from "react";

/**
 * Typewriter.
 *
 * Two modes:
 *   - one string  → types it once and stops (used for the name)
 *   - an array    → types, pauses, deletes, moves on, loops (used for roles)
 *
 * Driven by setTimeout rather than a rAF loop so it behaves in background
 * tabs, and it renders the FULL text immediately under prefers-reduced-motion.
 *
 * The reserved-height trick below matters: without it the line's height
 * changes as characters are added and the whole page jitters while typing.
 */
export function Typewriter({
  words,
  className,
  cursorClassName,
  typeMs = 65,
  deleteMs = 32,
  holdMs = 1800,
  startDelayMs = 0,
  loop = true,
  onDone,
}: {
  words: string | string[];
  className?: string;
  cursorClassName?: string;
  typeMs?: number;
  deleteMs?: number;
  holdMs?: number;
  startDelayMs?: number;
  loop?: boolean;
  onDone?: () => void;
}) {
  const list = Array.isArray(words) ? words : [words];
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [started, setStarted] = useState(startDelayMs === 0);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (startDelayMs === 0) return;
    const t = setTimeout(() => setStarted(true), startDelayMs);
    return () => clearTimeout(t);
  }, [startDelayMs]);

  useEffect(() => {
    if (reduce || !started || done) return;

    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const word = list[wordIndex];

      if (!deleting) {
        charIndex++;
        setText(word.slice(0, charIndex));

        if (charIndex === word.length) {
          // Single word, no loop — stop here.
          if (list.length === 1 && !loop) {
            setDone(true);
            onDone?.();
            return;
          }
          deleting = true;
          timer = setTimeout(tick, holdMs);
          return;
        }
        timer = setTimeout(tick, typeMs);
        return;
      }

      charIndex--;
      setText(word.slice(0, charIndex));
      if (charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % list.length;
      }
      timer = setTimeout(tick, deleting ? deleteMs : typeMs);
    };

    timer = setTimeout(tick, typeMs);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, started, done]);

  if (reduce) {
    return <span className={className}>{list[0]}</span>;
  }

  return (
    <span className={className}>
      {/* Zero-width sizer reserves the width of the longest string so the
          layout doesn't reflow as the text cycles. Only worth it when the
          text actually rotates — for a single word it just duplicates the
          string into the element's text content for no benefit. */}
      {list.length > 1 && (
        <span
          aria-hidden
          className="pointer-events-none inline-block h-0 w-0 overflow-hidden opacity-0"
        >
          {list.reduce((a, b) => (a.length > b.length ? a : b), "")}
        </span>
      )}
      <span>{text}</span>
      {!done && (
        <span
          aria-hidden
          className={cursorClassName ?? "ml-0.5 inline-block w-[0.06em] animate-caret bg-accent align-baseline"}
          style={{ height: "0.95em" }}
        />
      )}
    </span>
  );
}

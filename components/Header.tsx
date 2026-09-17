"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { site } from "@/lib/site";
import { useScrollSpy } from "@/lib/useScrollSpy";
import { ThemeToggle } from "@/components/ThemeToggle";

/**
 * Header. Bare words over the page, no bar.
 *
 * Two halves, as designed:
 *   left/center : plain text nav for INTERNAL navigation, with a 1px accent
 *                 underline that physically slides between items (Motion's
 *                 shared-layout `layoutId`). No pill, no bubble.
 *   right       : icon pills for EXTERNAL links (GitHub, LinkedIn, resume).
 *
 * Transparent at rest. Once you scroll past the hero, a backdrop-blur and a
 * hairline border fade in so the words stay legible over content. That's the
 * fix for a bar-less header. Invisible when you want it invisible, readable
 * when it matters.
 */

const SECTIONS = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);

  const ids = useMemo(() => SECTIONS.map((s) => s.id), []);
  const active = useScrollSpy(isHome ? ids : []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500 ${
        scrolled
          ? "border-b border-border bg-bg/60 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        {/* ---- left: identity + section nav ---- */}
        <div className="flex items-center gap-6 sm:gap-8">
          <Link
            href="/"
            // On the home page this doesn't navigate, so SmoothScroll picks up
            // the attribute and eases back to the top instead of doing nothing.
            data-scroll-top={isHome ? "" : undefined}
            className="text-sm font-medium tracking-tight text-fg transition-colors hover:text-accent-soft"
          >
            {site.name}
          </Link>

          {isHome ? (
            <ul className="hidden items-center gap-1 sm:flex">
              {SECTIONS.map((s) => {
                const isActive = active === s.id;
                return (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="relative block px-3 py-1 text-sm transition-colors"
                    >
                      {/* Active item goes fully accent, not just white with a
                          hairline under it. The whole word carries the
                          highlight, which reads at a glance without needing a
                          pill or a bar behind it. */}
                      <span
                        className={
                          isActive
                            ? "font-medium text-accent"
                            : "text-muted hover:text-fg/80"
                        }
                      >
                        {s.label}
                      </span>
                      {isActive && (
                        <motion.span
                          layoutId="nav-indicator"
                          className="absolute inset-x-3 -bottom-0.5 h-px bg-accent"
                          transition={
                            reduce
                              ? { duration: 0 }
                              : { type: "spring", stiffness: 400, damping: 35 }
                          }
                        />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : (
            <Link
              href="/#work"
              className="text-sm text-muted transition-colors hover:text-fg"
            >
              ← All work
            </Link>
          )}
        </div>

        {/* ---- right: icon pills ---- */}
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <IconPill href={site.links.github} label="GitHub">
            <GitHubIcon />
          </IconPill>
          <IconPill href={site.links.linkedin} label="LinkedIn">
            <LinkedInIcon />
          </IconPill>
          <a
            href={site.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent/40 hover:text-fg"
          >
            Résumé
          </a>
        </div>
      </nav>

      {/* Mobile: the section nav collapses to nothing clever. Recruiters are
          on mobile. This is not the place to experiment. */}
      {isHome && (
        <div className="flex items-center justify-center gap-1 pb-2 sm:hidden">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`px-3 py-1 text-xs ${
                active === s.id ? "font-medium text-accent" : "text-muted"
              }`}
            >
              {s.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

function IconPill({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface/60 text-muted transition-colors hover:border-accent/40 hover:text-fg"
    >
      {children}
    </a>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.4 7.4 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M3.6 5.3H.9V15h2.7V5.3ZM2.25 1a1.57 1.57 0 1 0 0 3.13 1.57 1.57 0 0 0 0-3.13ZM15.1 9.5c0-2.6-1.39-3.81-3.24-3.81-1.5 0-2.17.82-2.54 1.4V5.3H6.62c.04.76 0 9.7 0 9.7h2.7V9.6c0-.24.02-.49.09-.66.2-.49.64-.99 1.4-.99.98 0 1.38.75 1.38 1.85V15h2.7V9.5Z" />
    </svg>
  );
}

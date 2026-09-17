"use client";

import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

/**
 * Light/dark toggle.
 *
 * Writes `data-theme` on <html>, which flips the token block in globals.css 
 * every colour on the site derives from those variables, so nothing else has
 * to know the theme exists.
 *
 * The initial theme is resolved by an inline script in app/layout.tsx BEFORE
 * first paint. Doing it here instead would flash the wrong theme for a frame
 * on every load.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current =
      (document.documentElement.getAttribute("data-theme") as Theme) ?? "dark";
    setTheme(current);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    document.documentElement.style.colorScheme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* private mode. The toggle still works for this session */
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
      className="relative flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface/60 text-muted transition-colors hover:border-accent/40 hover:text-fg"
    >
      {/* Render nothing until mounted so SSR markup can't disagree with the
          resolved theme and trip a hydration mismatch. */}
      {mounted && (theme === "dark" ? <MoonIcon /> : <SunIcon />)}
    </button>
  );
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.1 5.1l1.4 1.4M17.5 17.5l1.4 1.4M18.9 5.1l-1.4 1.4M6.5 17.5l-1.4 1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
    </svg>
  );
}

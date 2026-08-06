import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";

/**
 * About.
 *
 * Deliberately the narrowest section on the page. After a full-bleed hero and
 * a wide carousel, a tight single column is the contrast that makes the page
 * feel composed — same system, different rhythm.
 */
export function About() {
  return (
    // min-h-screen + centred: each section owns a full screen, so clicking a
    // nav link lands on a section that fills the viewport instead of parking
    // you in the padding with the previous section still showing.
    <section
      id="about"
      className="flex min-h-screen items-center px-5 py-24 sm:px-8"
    >
      <div className="mx-auto w-full max-w-2xl">
        <Reveal>
          <p className="mb-10 text-xs uppercase tracking-[0.2em] text-muted">
            About
          </p>
        </Reveal>

        {site.portrait && (
          <Reveal delay={0.05}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={site.portrait}
              alt={site.name}
              className="mb-10 h-28 w-28 rounded-full border border-border object-cover"
            />
          </Reveal>
        )}

        <div className="space-y-6 text-lg leading-relaxed text-muted">
          {site.about.map((paragraph, i) => (
            <Reveal key={i} delay={0.08 * (i + 1)}>
              <p>{paragraph}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

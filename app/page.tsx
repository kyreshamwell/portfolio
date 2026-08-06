import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Reveal } from "@/components/Reveal";
import { ProjectCarousel } from "@/components/ProjectCarousel";

export default function Home() {
  return (
    <main>
      <Hero />

      {/* ---- WORK ------------------------------------------------------
          Elevation step up from the page background. Barely perceptible on
          its own — that's the point. It creates a section boundary without
          introducing a second colour. */}
      <section
        id="work"
        className="border-y border-border bg-surface/40 px-5 py-24 sm:px-8 sm:py-32"
      >
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-muted">
              Selected work
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mb-16 max-w-2xl text-2xl font-medium tracking-tight sm:text-4xl">
              Three things I built because I wanted them to exist.
            </h2>
          </Reveal>
        </div>

        <div className="mx-auto max-w-6xl">
          <ProjectCarousel />
        </div>
      </section>

      <About />
      <Contact />
    </main>
  );
}

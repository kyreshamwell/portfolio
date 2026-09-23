import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Experience } from "@/components/Experience";
import { Contact } from "@/components/Contact";
import { Reveal } from "@/components/Reveal";
import { ProjectCarousel } from "@/components/ProjectCarousel";

export default function Home() {
  return (
    <main>
      <Hero />

      {/* ---- WORK ------------------------------------------------------
          Elevation step up from the page background. Barely perceptible on
          its own. That's the point. It creates a section boundary without
          introducing a second colour.
          overflow-x-clip: the carousel's side cards sit past the screen edge
          by design. Without the clip, phones widen the whole page to fit
          them, which pushes the header off screen and lets the page pan
          sideways. clip rather than hidden, so the cards' shadows still spill
          vertically. */}
      <section
        id="work"
        className="flex min-h-screen flex-col justify-center overflow-x-clip border-y border-border bg-surface/40 px-5 py-10 sm:px-8 sm:py-12"
      >
        <div className="mx-auto w-full max-w-6xl">
          <Reveal>
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-muted">
              Selected work
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mb-6 max-w-2xl sm:mb-8 text-2xl font-medium tracking-tight sm:text-4xl">
              Three things I built because I wanted them to exist.
            </h2>
          </Reveal>
        </div>

        <div className="mx-auto w-full max-w-6xl">
          <ProjectCarousel />
        </div>
      </section>

      <About />
      <Experience />
      <Contact />
    </main>
  );
}

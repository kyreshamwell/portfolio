import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects, statusLabel } from "@/lib/projects";
import { Reveal } from "@/components/Reveal";

/**
 * Case study page.
 *
 * Deliberately a separate route, not a modal: these need to be linkable,
 * shareable, and indexable. You want to be able to paste this URL into a job
 * application.
 *
 * Everything renders from lib/projects.ts. You write prose there, never here.
 */

export function generateStaticParams() {
  return projects.filter((p) => p.caseStudy).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.title}. Case study`,
    description: project.blurb,
  };
}

export default async function CaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project || !project.caseStudy) notFound();

  return (
    <main className="px-5 pb-32 pt-32 sm:px-8 sm:pt-40">
      <article className="mx-auto max-w-2xl">
        {/* ---- header ---- */}
        <Reveal>
          <div className="flex items-center gap-3 text-xs text-muted">
            <span>{project.year}</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>{statusLabel[project.status]}</span>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h1 className="mt-4 text-4xl font-medium tracking-tight sm:text-5xl">
            {project.title}
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            {project.blurb}
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-8 flex flex-wrap items-center gap-2">
            {project.href && (
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-accent px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-accent-soft"
              >
                Live site ↗
              </a>
            )}
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border px-4 py-2 text-xs text-muted transition-colors hover:border-accent/40 hover:text-fg"
              >
                Code ↗
              </a>
            )}
          </div>
        </Reveal>

        {/* ---- stack ---- */}
        <Reveal delay={0.2}>
          <dl className="mt-12 border-y border-border py-6">
            <dt className="text-[11px] uppercase tracking-[0.15em] text-muted">
              Built with
            </dt>
            <dd className="mt-3 flex flex-wrap gap-1.5">
              {project.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-border px-2.5 py-1 text-xs text-muted"
                >
                  {s}
                </span>
              ))}
            </dd>
          </dl>
        </Reveal>

        {/* ---- body ---- */}
        <div className="mt-16 space-y-16">
          {project.sections.map((section) => (
            <section key={section.heading}>
              <Reveal>
                <h2 className="text-xl font-medium tracking-tight sm:text-2xl">
                  {section.heading}
                </h2>
              </Reveal>
              <div className="mt-5 space-y-5 text-[17px] leading-[1.75] text-muted">
                {section.body.map((paragraph, i) => (
                  <Reveal key={i} delay={0.04 * i}>
                    <p>{paragraph}</p>
                  </Reveal>
                ))}
              </div>
            </section>
          ))}
        </div>

        <Reveal>
          <div className="mt-24 border-t border-border pt-8">
            <Link
              href="/#work"
              className="text-sm text-muted transition-colors hover:text-accent-soft"
            >
              ← Back to all work
            </Link>
          </div>
        </Reveal>
      </article>
    </main>
  );
}

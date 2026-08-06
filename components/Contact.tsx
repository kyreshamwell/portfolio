import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";

/**
 * Contact + footer.
 *
 * A visible mailto address, not a form. Forms add friction and collect spam;
 * a recruiter wants to copy the address straight into their ATS.
 *
 * All four contact points live here AND in the header, on purpose — you don't
 * get to know where someone stops scrolling.
 */

const links = [
  { label: "Email", href: `mailto:${site.email}`, value: site.email },
  { label: "GitHub", href: site.links.github, value: "GitHub ↗" },
  { label: "LinkedIn", href: site.links.linkedin, value: "LinkedIn ↗" },
  { label: "Résumé", href: site.resume, value: "PDF ↗" },
];

export function Contact() {
  return (
    <section
      id="contact"
      className="flex min-h-screen items-center border-t border-border px-5 py-24 sm:px-8"
    >
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <p className="mb-10 text-xs uppercase tracking-[0.2em] text-muted">
            Contact
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <h2 className="max-w-3xl text-3xl font-medium leading-tight tracking-tight sm:text-5xl">
            Building something, hiring for something, or just want to talk about
            it — my inbox is open.
          </h2>
        </Reveal>

        <ul className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
          {links.map((link, i) => (
            <li key={link.label} className="bg-bg">
              <Reveal delay={0.05 * i}>
                <a
                  href={link.href}
                  target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col gap-2 p-5 transition-colors hover:bg-surface"
                >
                  <span className="text-[11px] uppercase tracking-[0.15em] text-muted">
                    {link.label}
                  </span>
                  <span className="truncate text-sm text-fg transition-colors group-hover:text-accent-soft">
                    {link.value}
                  </span>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

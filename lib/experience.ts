/* ============================================================================
 * EXPERIENCE. The career timeline.
 *
 * This is the running record: every job, school, and shipped project, so
 * nothing falls off the site when the carousel moves on to newer work. The
 * carousel is the highlight reel. This is the whole history.
 *
 * Newest first. Add new entries at the TOP. The timeline flips the order
 * when it draws, so the oldest sits on the left and you scroll toward now.
 *
 * When something happens, write it down here while you still remember what
 * you actually did. A bullet is one thing you did and what it changed, not a
 * list of tools.
 * ==========================================================================*/

export type ExperienceKind = "work" | "education" | "project";

export type ExperienceEntry = {
  kind: ExperienceKind;
  /** Role, degree, or project name. */
  title: string;
  /** Company, school, or for projects, what kind of thing it is. */
  org: string;
  /** City and state, or "Remote". Optional. */
  place?: string;
  /** "Jun 2024". Leave out for a single-date entry like a graduation. */
  start?: string;
  /** "Aug 2024", "Summer 2022", or "Present" for something still going. */
  end: string;
  /** What you did there. For a project, leave empty to use its blurb. */
  points: string[];
  /**
   * Slug from lib/projects.ts. Links the entry to the case study (or the live
   * site, if the case study is still off) so the two never drift apart.
   */
  project?: string;
};

export const experience: ExperienceEntry[] = [
  {
    kind: "project",
    title: "Pushed",
    org: "iOS app, free on the App Store",
    start: "Jul 2026", // first commit
    end: "Sep 2026", // App Store launch
    points: [],
    project: "pushed",
  },
  {
    kind: "project",
    title: "Cardstack",
    org: "Web app",
    start: "May 2026", // first commit
    end: "Aug 2026", // last commit so far. Change to "Present" if it's ongoing
    points: [],
    project: "card-stack",
  },
  {
    kind: "education",
    title: "Computer Science graduate",
    org: "North Carolina A&T State University",
    place: "Greensboro, NC",
    end: "May 2025",
    points: [
      "Dean's List and Executive Leadership Council Scholar.",
      "Member of the Association for Computing Machinery (ACM) and the National Society of Black Engineers (NSBE).",
    ],
  },
  {
    kind: "work",
    title: "Software Engineer Intern",
    org: "Collins Aerospace, Avionics",
    place: "Cedar Rapids, IA",
    start: "Jun 2024",
    end: "Aug 2024",
    points: [
      "Migrated legacy Python 2 test code to Python 3 and converted GUI-based tests to run from the command line, logging results to a file, so tests no longer depended on the GUI.",
      "Built an HTML interface, served from a local Python server, that formats and displays test output.",
      "Tested the updated scripts on Airborne Flight Display (AFD) and Fomax devices.",
      "Committed changes to GitLab from a Linux server and documented them in AsciiDoc.",
    ],
  },
  {
    kind: "work",
    title: "Digital Technology Co-op",
    org: "Collins Aerospace, Cloud and Automation",
    place: "Remote",
    start: "Jan 2023",
    end: "Dec 2023",
    points: [
      "Designed, implemented, and supported collaboration tools for 71,000 end users.",
      "Migrated 1,000 file shares to Varonis, a new data security platform.",
      "Worked directly with users every day, 15+ on collaboration tools and 10+ on data security, to figure out what they needed and resolve it.",
    ],
  },
  {
    // PLACEHOLDER. The summer before sophomore year.
    kind: "work",
    title: "TODO: Role",
    org: "TODO: Company",
    end: "Summer 2022",
    points: ["TODO: what you did there."],
  },
  {
    // PLACEHOLDER.
    kind: "education",
    title: "Started college",
    org: "North Carolina A&T State University",
    place: "Greensboro, NC",
    end: "Fall 2021",
    points: ["TODO: what you were studying and what got you into it."],
  },
];

export const kindLabel: Record<ExperienceKind, string> = {
  work: "Work",
  education: "Education",
  project: "Project",
};

/** "Jun - Aug 2024" when both ends share a year, "Jul 2025 - Present" otherwise. */
export function formatRange(start: string | undefined, end: string) {
  if (!start) return end;
  const [startMonth, startYear] = start.split(" ");
  const endYear = end.split(" ")[1];
  if (startYear && startYear === endYear) return `${startMonth} - ${end}`;
  return `${start} - ${end}`;
}

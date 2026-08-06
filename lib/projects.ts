/* ============================================================================
 * PROJECTS — the content engine for the whole site.
 *
 * Each entry drives THREE things:
 *   1. its card in the carousel on the home page
 *   2. its case study page at /work/<slug>
 *   3. its entry in the carousel's tab strip
 *
 * Order matters — the first project is the one people see first. Put your
 * strongest (card-stack) at index 0.
 * ==========================================================================*/

export type ProjectStatus = "live" | "in-review" | "building";

export type CaseStudySection = {
  heading: string;
  /** Each string is a paragraph. */
  body: string[];
};

export type Project = {
  slug: string;
  title: string;
  /** One line, shown on the card. Say what it does, not what it is. */
  blurb: string;
  status: ProjectStatus;
  year: string;
  stack: string[];

  /* ---- MEDIA (the carousel showpiece) ------------------------------------
   * video:  screen recording of the project, muted + looping. This is the
   *         thing you said you wanted — it autoplays when the card is active.
   *         Put files in public/media/. MP4 (h.264) is the safe format.
   *         Keep them SHORT (8–15s) and SMALL (under ~4MB) or the site drags.
   *         Record at 2x then downscale so text stays crisp.
   *         Leave as "" and the poster image is used instead — the carousel
   *         works fine with images only, so ship with posters and add video
   *         later.
   * poster: still image, also the video's poster frame. ALWAYS set this.
   *         1600x1000 or thereabouts. public/media/<slug>.jpg
   * ----------------------------------------------------------------------*/
  video: string;
  poster: string;

  /** Live URL. Empty string hides the button. */
  href: string;
  /** Repo URL. Empty string hides the button. */
  repo: string;

  /** Set false while the case study is still a stub — hides the link. */
  caseStudy: boolean;

  /* ---- CASE STUDY --------------------------------------------------------
   * Only card-stack needs this filled in properly for launch. The outline is
   * pre-seeded below — replace the TODO text with real writing.
   * ----------------------------------------------------------------------*/
  sections: CaseStudySection[];
};

export const projects: Project[] = [
  {
    slug: "card-stack",
    title: "Card Stack",
    blurb:
      "Every credit card balance in one place — with the math on which one to pay first.",
    status: "live",
    year: "2026",
    stack: ["Next.js", "TypeScript", "Supabase", "Motion", "Bklit"],
    video: "", // TODO: "/media/card-stack.mp4"
    poster: "/media/card-stack.jpg", // TODO: add this file
    href: "", // TODO: deployed URL
    repo: "", // TODO: repo URL
    caseStudy: true,
    sections: [
      {
        heading: "The problem",
        body: [
          "TODO: Two sentences, personal and specific. How many cards, how many separate apps, what you couldn't see. Name the actual friction — not 'managing finances is hard' but 'I could see five balances and never the total, and never my utilization.'",
        ],
      },
      {
        heading: "What it does",
        body: [
          "TODO: The thesis. Not a feature list — the point of view. Total utilization across cards, per-card utilization, and payoff priority (avalanche vs. snowball) with real interest math.",
          "TODO: One paragraph on what makes it different from a balance table: it has an opinion about what you should do next.",
        ],
      },
      {
        heading: "Decisions",
        body: [
          "TODO: Decision 1 — Supabase over the alternatives. What you rejected (Firebase? your own Postgres + auth?) and the actual reason. 'Row-level security without running my own backend' is a real reason. 'It was in the tutorial' is not.",
          "TODO: Decision 2 — manual entry vs. bank sync via Plaid. Whichever you chose, say what it cost you. If manual: you traded convenience for zero credential risk. If Plaid: you took on OAuth, webhooks, and messy institution data.",
          "TODO: Decision 3 — the data model. How you modeled cards, balances, and balance history so that utilization-over-time is one query instead of five. This is the one that shows you can think past the first version.",
        ],
      },
      {
        heading: "Security",
        body: [
          "TODO: This is your strongest section — do not skip it. What your RLS policies actually say, in plain language.",
          "TODO: What a bug in the app CANNOT reach. If a query is written wrong, why can user A still never see user B's balances?",
          "TODO: What you'd need before you'd let strangers put real balances in this. Being honest about the gap reads as senior, not as weakness.",
        ],
      },
      {
        heading: "What broke",
        body: [
          "TODO: One real bug. What the symptom was, what you thought it was, what it actually was, how you found it. Specific. This is the section that makes the whole page read as real instead of generated.",
        ],
      },
      {
        heading: "What's next",
        body: ["TODO: Two or three sentences. Honest and short."],
      },
    ],
  },

  {
    slug: "split-screen",
    title: "Split Screen",
    blurb:
      "Windows-style window snapping for macOS — tiling that doesn't fight you.",
    status: "building",
    year: "2026",
    stack: ["Swift", "SwiftUI", "Accessibility API"],
    video: "",
    poster: "/media/split-screen.jpg", // TODO
    href: "",
    repo: "",
    caseStudy: false, // flip to true once there's something to read
    sections: [
      {
        heading: "The problem",
        body: [
          "TODO: macOS window management is manual and repetitive. Say what you actually do twenty times a day that this replaces.",
        ],
      },
      {
        heading: "How it works",
        body: [
          "TODO: The Accessibility API, global hotkey capture, multi-display handling. This is genuine systems work — say enough that a reader understands it isn't a wrapper around a library.",
        ],
      },
    ],
  },

  {
    slug: "ios-app",
    title: "TODO: iOS App Name",
    blurb: "TODO: one line — what it does for the person using it.",
    status: "in-review",
    year: "2026",
    stack: ["Swift", "SwiftUI"],
    video: "",
    poster: "/media/ios-app.jpg", // TODO
    href: "", // App Store URL once approved, TestFlight link until then
    repo: "",
    caseStudy: false,
    sections: [
      {
        heading: "The problem",
        body: ["TODO"],
      },
    ],
  },
];

export const statusLabel: Record<ProjectStatus, string> = {
  live: "Live",
  "in-review": "In review",
  building: "In progress",
};

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

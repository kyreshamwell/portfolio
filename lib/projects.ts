/* ============================================================================
 * PROJECTS. The content engine for the whole site.
 *
 * Each entry drives THREE things:
 *   1. its card in the carousel on the home page
 *   2. its case study page at /work/<slug>
 *   3. its entry in the carousel's tab strip
 *
 * Order matters. The first project is the one people see first. Put your
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
   *         thing you said you wanted. It autoplays when the card is active.
   *         Put files in public/media/. MP4 (h.264) is the safe format.
   *         Keep them SHORT (8-15s) and SMALL (under ~4MB) or the site drags.
   *         Record at 2x then downscale so text stays crisp.
   *         Leave as "" and the poster image is used instead. The carousel
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

  /** Set false while the case study is still a stub. Hides the link. */
  caseStudy: boolean;

  /* ---- CASE STUDY --------------------------------------------------------
   * Only card-stack needs this filled in properly for launch. The outline is
   * pre-seeded below. Replace the TODO text with real writing.
   * ----------------------------------------------------------------------*/
  sections: CaseStudySection[];
};

export const projects: Project[] = [
  {
    slug: "card-stack",
    title: "Cardstack",
    blurb:
      "Every card on one screen: utilization, due dates, and which balance to pay before the statement closes.",
    status: "live",
    year: "2026",
    stack: ["Next.js", "TypeScript", "Supabase", "Clerk", "Plaid", "Motion", "Vercel"],
    video: "", // no video. The dashboard shows everything at once, so a still is stronger
    poster: "/media/card-stack.jpg",
    href: "https://cardstack-bay.vercel.app",
    repo: "https://github.com/kyreshamwell/cardstack",
    caseStudy: true,
    sections: [
      {
        heading: "The problem",
        body: [
          "Every card I had lived in its own app. Answering one simple question meant opening all of them, going back and forth, and still not getting a real answer. I could see each balance on its own but never the total, never my utilization on any single card, and never when each statement closed, which is the date that number actually gets reported.",
        ],
      },
      {
        heading: "What it does",
        body: [
          "Cardstack connects every card in one place and is built around one number: utilization. It shows utilization per card and across all cards at once, alongside balance, credit limit, available credit, minimum payment, statement close date, due date, transactions, and recurring subscriptions. When it is time to pay, it hands you off to the issuer's app to do it.",
          "A balance table gives you rows and leaves the math to you. Cardstack has an opinion about what to do next: which card to pay, how much, and by when. Utilization is reported when a statement closes, not when the payment is due, so the app works out what you would need to pay before each card's close date to be reported at 30%, and shows that as the move (77% to 30%) rather than a number you have to reason about yourself.",
        ],
      },
      {
        heading: "Decisions",
        body: [
          "Supabase over Firebase or my own backend. I wanted Postgres row-level security without running a backend myself. The data is relational (one bank connection has many cards, one card has many transactions), and expressing that as tables with SQL policies is cleaner than documents with Firebase-specific security rules. Running my own Postgres would have meant building sessions, password reset, email verification, and social login before writing any of the actual app. Next.js, Clerk, Plaid, and Vercel came from the same place: I had used them on other projects, so I already knew where they break.",
          "Plaid and manual entry, not one or the other. Plaid does not support every issuer, and the issuers it does support sometimes return null for the credit limit, which makes utilization impossible to calculate on that card. Manual cards live in the same table as Plaid cards with a source column to tell them apart. The cost is two write paths through every mutation, and a sync that has to know not to overwrite what someone typed by hand. The alternative was a dashboard that silently leaves cards out, and a wrong total is worse than no total. The integration runs in Plaid production, so the numbers on my dashboard are my actual balances rather than test data.",
          "Connections separate from cards. One row per Plaid connection (one bank login) and one row per card underneath it, so an issuer with three cards stores the access token once instead of three times, and the transaction cursor sits on the connection because sync happens per connection. What the model does not do yet is history. Balances are updated in place on every sync, so utilization over time is not a query I can run at all. The fix is a dated snapshot row per card per sync.",
          "Design came last, on purpose. I left the interface alone until the data underneath it was correct, then rebuilt it as something minimal, with animation and privacy options like hiding balances on screen.",
        ],
      },
      {
        heading: "Security",
        body: [
          "Every table holding user data has row-level security turned on, with a policy for each operation, and they all say the same thing: only return or accept this row if its user_id matches the user in the session token the request came with. That user ID is the Clerk user ID. Update policies carry both USING and WITH CHECK, so you cannot take a row you own, reassign it to another user, and write it back.",
          "A bug in my code cannot reach another user's data. Queries run as the signed-in user rather than with the service key, so Postgres filters the rows before my code ever sees them. A query I write wrong returns too few rows, not somebody else's. It also fails closed: if the session token is not trusted, the request is treated as anonymous and returns nothing, so you get an empty dashboard instead of a leak. The one exception is the table holding Plaid access tokens, which no policy can protect, because my server and a browser authenticate as the same role there. That table is separated at the key level, and a build-time test fails if the service key is ever pointed anywhere else.",
          "This runs live and I use it with my own cards, so the gaps that are left are ones I have accepted for a deployment of one. Auth still runs on a Clerk development instance, because a production instance needs a custom domain to finish its DNS setup and I have not bought one yet. Access tokens sit in a plaintext column and need real column-level encryption. Deleting a card removes my rows but never calls Plaid's removal endpoint, so the token is never revoked on their side. The API routes have no rate limiting, and there is no audit log. None of it is hard. It is the difference between something I run for myself and something I would ask other people to trust, and I would rather name the list than have someone find it.",
        ],
      },
      {
        heading: "What broke",
        body: [
          "The animated slide between panels did not run on phones or tablets, but it was smooth on my laptop. No error, nothing in the console. The panel just appeared instead of sliding. I assumed Safari, then assumed Motion was skipping touch devices, and I could not prove either one by reading the code.",
          "So I measured the panel's position on every animation frame. A laptop gave me forty positions across the transition. A phone gave me two. The animation had been running the whole time: a transform: none !important rule I had written months earlier for an unrelated layout bug was discarding every frame below the 1280px breakpoint, which is why I never saw it on my own machine. The fix was to release that override only while a panel is moving. An animation that is not running and an animation whose output is discarded look identical from the outside.",
        ],
      },
      {
        heading: "What's next",
        body: [
          "Background sync on a schedule, so balances are current when I open the app instead of shortly after. Then the balance snapshot table, so utilization over time becomes a query instead of something I cannot ask at all. A domain and a production Clerk instance come after that, and they are what gate letting anyone else in.",
          "After that, an iOS version, because a phone is where you actually are when you wonder about this stuff. And real users other than me.",
        ],
      },
    ],
  },

  {
    slug: "split-screen",
    title: "Split Screen",
    blurb:
      "Windows-style window snapping for macOS. Tiling that doesn't fight you.",
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
          "TODO: The Accessibility API, global hotkey capture, multi-display handling. This is genuine systems work, so say enough that a reader understands it isn't a wrapper around a library.",
        ],
      },
    ],
  },

  {
    slug: "ios-app",
    title: "TODO: iOS App Name",
    blurb: "TODO: one line saying what it does for the person using it.",
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

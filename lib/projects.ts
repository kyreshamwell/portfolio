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
    slug: "pushed",
    title: "Pushed",
    blurb:
      "Your GitHub contribution graph as a Home Screen widget. Keep the streak alive without opening GitHub.",
    status: "live",
    year: "2026",
    stack: ["Swift", "SwiftUI", "WidgetKit", "App Intents", "GitHub GraphQL"],
    video: "", // the landing page has the 43s launch demo. Trim 8-15s of it for here
    poster: "/media/pushed.jpg",
    href: "https://pushed-landing.vercel.app", // landing page, which links to the App Store
    repo: "https://github.com/kyreshamwell/git-widget",
    caseStudy: true,
    sections: [
      {
        heading: "Why I built it",
        body: [
          "I wanted to code every day. I saw someone on Reels post their GitHub contribution graph with a green square for every day, and I didn't care much at first, but the idea stuck. If the goal is to build something every day, the graph is the scoreboard, and an app whose only job is to keep that streak in front of me makes the goal a lot harder to quietly drop.",
          "Shipping an iOS app was also one of my goals for the year. I had built plenty for the web, but a different app I tried earlier in the year didn't work out. A widget felt like the right way to start small: something you can finish, and something you see every time you pick up your phone.",
          "It was never only about my own streak. I made a video of it for TikTok and Instagram so other people could set a goal of their own, and I made it free so anyone could use it and so I'd get as much feedback as possible.",
        ],
      },
      {
        heading: "What it does",
        body: [
          "Pushed puts your contribution graph on your Home Screen as a widget in small, medium or large, covering anything from one month to a full year. It refreshes in the background, so where your streak stands is something you see when you unlock your phone rather than something you go and check. Today counts toward the streak once you've pushed, and until then it shows your count through yesterday, so it doesn't drop to zero at breakfast.",
          "Every widget keeps its own look. There are built-in styles like Classic, Terminal and Paper, a layout that leads with a big streak number, and an editor for designing your own. Custom styles work out their text colors from contrast rules, so no combination of colors can make the widget unreadable.",
        ],
      },
      {
        heading: "Decisions",
        body: [
          "No backend. The app talks to GitHub directly with your own read-only token, which lives in the iOS Keychain and is shared with the widget, and the last result is cached so the widget draws instantly instead of waiting on the network. There is no account, no analytics, and no server of mine for your data to pass through. That also means nothing to pay for per user, which is part of how it stays free. The cost is setup: instead of a Sign in with GitHub button, you create a personal access token and paste it in, which is a real ask for a free app. And with no server, nothing can push an update to your phone either. iOS decides when the widget refreshes, and reminders have to be worked out on the phone and handed to iOS ahead of time.",
          "Reminders that only speak when there's a reason. The easy version is a daily alarm, and that's the version people turn off. Pushed decides what to send from your actual graph. If you've pushed today, it stays quiet unless you just hit a milestone. If you pushed yesterday but not today, your streak is on the line, so you get a midday heads-up and an evening warning. If the streak is already gone, the reminders taper off: daily for the first week, then every third day, then weekly, then nothing after two months. An app that nags you every day for a month gets deleted before you ever come back.",
          "Testing is something I've taken up on my own, to make sure things actually work the way I meant them to, and reminders are where that matters most. A wrong one is worse than none. So the rules that decide what to send are kept separate from the code that hands notifications to iOS, which lets them be tested without waiting on a real clock, and more than half of the project's tests are about reminders. Two of those rules keep the numbers honest. Nothing is scheduled past today, because tomorrow's streak depends on whether you push. And a reminder never quotes a number from data more than a day old. Stale data means silence, not a confident wrong number.",
        ],
      },
      {
        heading: "What broke",
        body: [
          "The first version treated every 403 from GitHub as a dead token. GitHub also sends a 403 when it's rate limiting you, so a background refresh that landed at a busy moment would tell you your token had stopped working. Worse, a dead token also switches off the commit reminders, because nagging someone with numbers the app can't verify is worse than saying nothing. One busy hour on GitHub's side could make Pushed go quiet until you replaced a token that was never broken.",
          "The fix was reading the response headers instead of just the status code. A rate limit comes with a retry-after header or a remaining count of zero, and a revoked token has neither. A throttled refresh now keeps your last graph on screen and the reminders running, then tries again on the next refresh. The only way to be told your token is dead is for GitHub to give no sign of throttling at all. The status code said the same thing in both cases. The headers were where the difference was.",
        ],
      },
      {
        heading: "What's next",
        body: [
          "Pushed is free so that people actually try it, and the feedback decides what changes next, or what carries into the next app. The longer-term goal is an app that makes money: something people see as a tool they'd use every day, the way I use this one.",
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
];

export const statusLabel: Record<ProjectStatus, string> = {
  live: "Live",
  "in-review": "In review",
  building: "In progress",
};

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

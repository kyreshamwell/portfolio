/* ============================================================================
 * SITE CONFIG — everything personal lives here.
 * Fill in every TODO below. Nothing else in the codebase hardcodes your info.
 * ==========================================================================*/

export const site = {
  // TODO: your full name, as you want it read.
  name: "Kyre Shamwell",

  // TODO: your positioning line. This is the single most important sentence
  // on the site. Rules:
  //   - Say what you build and the angle you build it from.
  //   - Must be specific enough that it couldn't describe anyone else.
  //   - NOT "passionate developer building beautiful experiences."
  // Example shape: "I build tools for problems I actually have — a credit
  // tracker that tells you which card to pay first, and a window manager for
  // macOS."
  tagline:
    "I build tools for problems I actually have — a credit tracker that does the payoff math, and a window manager for macOS.",

  // The typed hero line, one array entry per line. Typed in sequence, so the
  // second line starts once the first finishes.
  greeting: ["Hi,", "I'm Kyre Shamwell"],

  // Used in the browser tab title and social previews, not shown on the page.
  subline: "Software engineer",

  // The rotating line under the greeting. Two entries cycle cleanly; keep
  // them short, since they loop forever.
  roles: ["Software engineer.", "Computer science graduate."],

  // TODO: real email. Shown in full and used as a mailto: link.
  email: "kmshamwell@gmail.com",

  // TODO: fill these in.
  links: {
    github: "https://github.com/TODO",
    linkedin: "https://linkedin.com/in/TODO",
    // Optional — delete the line and the icon disappears from the header.
    x: "",
  },

  // TODO: drop your PDF at public/kyre-shamwell-resume.pdf
  // Keep the filename professional — people see it in their download bar.
  resume: "/kyre-shamwell-resume.pdf",

  // TODO: 2–4 short paragraphs. Human, not a cover letter. Who you are, how
  // you got here, what you're into. Keep it under ~150 words total.
  about: [
    "TODO: First paragraph. Who you are and what you're doing right now.",
    "TODO: Second paragraph. How you got here — the honest version, not the LinkedIn version.",
    "TODO: Third paragraph, optional. What you're looking for, or what you do when you're not building.",
  ],

  // TODO: drop a photo at public/portrait.jpg (square, at least 600x600).
  // Leave as empty string to hide the photo entirely.
  portrait: "",
};

export type Site = typeof site;

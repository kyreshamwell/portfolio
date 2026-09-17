/* ============================================================================
 * SITE CONFIG. Everything personal lives here.
 * Fill in every TODO below. Nothing else in the codebase hardcodes your info.
 * ==========================================================================*/

export const site = {
  // TODO: your full name, as you want it read.
  name: "Kyre Shamwell",

  // The positioning line, and the single most important sentence on the site.
  // It deliberately names no projects: the carousel below is the evidence, so
  // this says how the work gets picked rather than what it happens to be.
  // If you rewrite it, keep it specific enough that it couldn't describe
  // anyone else.
  tagline:
    "I got into this for the thinking. Hand me a problem I don't know how to solve yet and I'll build my way to the bottom of it, then keep the tool if it turns out to be worth keeping.",

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
    github: "https://github.com/kyreshamwell",
    linkedin: "https://linkedin.com/in/TODO",
    // Optional. Delete the line and the icon disappears from the header.
    x: "",
  },

  // TODO: drop your PDF at public/kyre-shamwell-resume.pdf
  // Keep the filename professional. People see it in their download bar.
  resume: "/kyre-shamwell-resume.pdf",

  // TODO: 2-4 short paragraphs. Human, not a cover letter. Who you are, how
  // you got here, what you're into. Keep it under ~150 words total.
  about: [
    "TODO: First paragraph. Who you are and what you're doing right now.",
    "TODO: Second paragraph. How you got here, the honest version rather than the LinkedIn version.",
    "TODO: Third paragraph, optional. What you're looking for, or what you do when you're not building.",
  ],

  // TODO: drop a photo at public/portrait.jpg (square, at least 600x600).
  // Leave as empty string to hide the photo entirely.
  portrait: "",
};

export type Site = typeof site;

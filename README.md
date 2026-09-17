# Portfolio

Personal portfolio site. A one-page showcase with dedicated case study routes.

**Live:** _TODO: add the deployed URL once it's up._

<!-- TODO: put a screenshot or short GIF right here. It's the first thing
     anyone sees on a repo page, and it does more than the whole README. -->

## Stack

- **Next.js** (App Router). Fully static; every route is prerendered
- **TypeScript**
- **Tailwind CSS v4**. CSS-first config, tokens defined in `app/globals.css`
- **Motion**. The 3D project carousel
- **Lenis**. Smooth scroll

No database, no API routes, no server. It builds to flat files on a CDN.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

```bash
npm run build   # production build
npx tsc --noEmit   # type-check only
```

> **Note:** don't run `npm run build` while `next dev` is running. Both write
> the same `.next` directory and it corrupts into
> `__webpack_modules__ is not a function` 500s. Stop the dev server first, or
> use `npx tsc --noEmit` to check types without touching the build output.

## Where the content lives

All copy and project data is in two files. No need to touch components to
change what the site says.

| File | Holds |
|---|---|
| `lib/site.ts` | Name, hero greeting, rotating roles, tagline, email, social links, résumé path, About paragraphs |
| `lib/projects.ts` | Every project: card copy, status, stack, media paths, links, and the case study body |

Project media goes in `public/media/`. See the README there for formats and
sizing. Until artwork exists, the carousel shows a placeholder rather than a
broken image.

## Structure

```
app/
  layout.tsx           root layout + pre-paint theme script
  page.tsx             the one-page site
  globals.css          design tokens (light + dark), reduced-motion rules
  work/[slug]/         case study route, generated from lib/projects.ts
components/
  Hero.tsx             two-line typed greeting + rotating role line
  ProjectCarousel.tsx  3D looping carousel with video/poster media
  Header.tsx           bare nav with sliding indicator + theme toggle
  Loader.tsx           curtain intro overlay
  Reveal.tsx           the scroll-reveal primitive used site-wide
  Typewriter.tsx       typing effect
  SmoothScroll.tsx     Lenis setup
  ThemeToggle.tsx      light/dark switch
lib/
  site.ts, projects.ts, useScrollSpy.ts
```

## Design notes

- **One accent colour.** Change `--color-accent` in `app/globals.css` and the
  whole site re-skins; nothing else hardcodes a colour.
- **Two themes.** Light and dark are each ~12 lines of token overrides. The
  theme resolves in an inline script before first paint so there's no flash.
- **Reveals fail visible.** `Reveal` uses IntersectionObserver and CSS
  transitions, and shows its content immediately if the observer never fires
  or the element is already on screen. Text should never be invisible because
  an animation didn't run.
- **Reduced motion** is respected in both JS and CSS. The loader, typewriter,
  carousel, and reveals all check it.

# Erik Freimann — Portfolio

Personal portfolio and case-study site. Next.js (App Router) + TypeScript + Tailwind CSS,
with GSAP for the reveals and Lenis for smooth scroll.

The page opens on the **Vallée Blanche** — a photograph turned into a 1000 × 263 character
plate. Scrolling flies into the sun at the top right until the picture burns out to flat
paper, and the site's first line arrives out of that light.

---

## The hero

`public/ascii/vallee-blanche.txt` is the plate. The renderer
([`src/lib/ascii/renderer.ts`](src/lib/ascii/renderer.ts)) is kept deliberately faithful to
the standalone `ascii-hero.html` it came from: same cover framing, same centre anchor, same
one-`fillText`-per-row. Four things there are load-bearing, and all four were paid for:

- **`PLATE_FONT` must never contain a CSS custom property.** `ctx.font` is parsed without an
  element context, so `var(--f-mono)` makes the whole declaration invalid — it is silently
  dropped and the context stays on its default `10px sans-serif`. Measured advance goes from
  0.586 to 0.083, every glyph is drawn ~12× wider than its cell, and the plate overlaps
  itself into a grey slab. It fails without an error.
- **The cell width comes from the font, not the other way round.** A row is one `fillText`,
  so the grid's column pitch is whatever advance the font actually uses — and that is
  quantised, drifting a few thousandths of a pixel per glyph. Across the ~790 columns on
  screen at the wide shot it accumulated to 4.57 px and reset to zero at certain sizes, so
  the right-hand side stretched away and snapped back as the zoom swept. Measuring the
  advance and treating *that* as the pitch takes it to 0.0001 px.
- **The zoom is eased, not exponential.** A plain exponential changes scale at a constant
  relative rate, so at the wide shot — where a cell is under 2 px — a single frame's motion
  is several cells and the stipple reshuffles instead of gliding. `t^1.55` equalises it to
  about 0.09 cells per scroll pixel at the wide end against 0.10 at the close end.
- **There is no pre-rendered bitmap, on purpose.** Not for speed: a full live-text redraw
  holds 60 fps at every zoom on a 1920 × 1080 @dpr 2 viewport, measured. A bitmap would move
  smoother (it interpolates rather than re-snapping 2 px glyphs to the pixel grid), but the
  supersampled version comes back a touch heavier in the sky, and matching the original
  exactly won. The renderer carries a note on how to switch it back on.

Landscape screens get the plate full-bleed. A phone gets a **band**: covering a phone with a
2 : 1 plate throws away 77% of the width and the sun with it, fitting the whole width gives a
190 px ribbon, and extending the sky upward to make it portrait-shaped would take 891
invented rows against 263 real ones. So a narrow screen shows a slice wide enough to keep the
sun in frame, laid on paper with hard edges.

## Colour

Three values, no more. `paper` and `ink` are lifted straight out of the plate, so the hero
canvas and the page are literally the same two colours. `green` is the only accent.

| Token | Value | |
| --- | --- | --- |
| `paper` | `#faf8f3` | the ground |
| `ink` | `#1a1e26` | 15.7 : 1 on paper |
| `green` | `#2f5d3a` | 7.2 : 1 on paper |
| `muted` | `#6f7174` | ink at 62% — 4.6 : 1, passes AA for body |

## Motion

Two moves for the whole site: type rises out of a mask, and rules draw themselves. That is
the entire vocabulary — everything else is the hero. The only piece of chrome is the green
stripe at the foot of the screen, which draws itself during the flight and leaves with it.

`prefers-reduced-motion` is honoured throughout: the flight is off, Lenis never initialises,
and the sticky column collapses so the plate, the title and the line it hands off to become
three ordinary blocks.

---

## Copy

**Every sentence the visitor reads lives in [`src/config/site.ts`](src/config/site.ts)** —
including section labels, headings and nav. Nothing user-facing is hard-coded in a component.
That is what makes a Swedish version a copy of that one file with the strings translated and
a one-line change to the import, rather than a trawl through JSX.

Plain language is a requirement, not a style: someone running a modelling agency has to
finish a sentence and know what they would be buying. Where a technical word is unavoidable,
the sentence around it explains itself.

Project copy is written from the repos — README, architecture notes and commit history — not
from memory. Years are first-commit years.

## Run it

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. For a phone on the same Wi-Fi, `npm run dev -- -H 0.0.0.0`.

## Deploy

**GitHub Pages** — [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)
already does it. Set repo **Settings → Pages → Source → "GitHub Actions"** once; after that
every push to `main` publishes to <https://frei22.github.io/ErikFreimann/>. The site is
entirely static content from this repo, so there is no scheduled rebuild — nothing changes
between pushes.

**Vercel** — import the repo, accept every default. No environment variables.

Moving to a custom domain or a `frei22.github.io` repo? Set `NEXT_PUBLIC_BASE_PATH` to `""`
in the workflow — it exists because a project site is served from `/<repo>`, not the root —
and update `site.url` so link previews resolve.

## Layout of the code

```
src/
  app/                     routes, metadata, global CSS + design tokens
  components/ascii/        the hero flight, and the plate crops in the work entries
  components/sections/     work, about, contact
  components/site/         nav, flight stripe, the two reveal primitives
  config/site.ts           every word on the site, and everything personal
  lib/ascii/               plate loader + renderer
  lib/                     GSAP setup, Lenis, base-path helper
public/ascii/              the 1000 × 263 plate (~75 KB gzipped)
```

## Scripts

```bash
npm run shots            # frames of the whole page → /mockups (server on :3100)
npm run og               # regenerate public/og.png after a copy or palette change
npm run build:export     # static export → ./out
npm run verify:export    # serve ./out under /ErikFreimann and smoke-test it
```

`verify:export` is the one that matters before a deploy — it serves the export from a
sub-path the way Pages does, walks the whole page, and fails on a 404, a JS error, an
unpainted hero, or a reveal that never fired.

## Still to do

1. Both featured repos are private, so the work entries say *Private repo — walkthrough on
   request* instead of linking. Paste a URL into `href` in `src/config/site.ts` if either
   goes public.
2. Swedish version: duplicate `src/config/site.ts`, translate the strings, swap the import.
3. Lighthouse pass on a real mid-range phone.

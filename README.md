# Erik Freimann — Portfolio

Personal portfolio and case-study site. Next.js (App Router) + TypeScript + Tailwind CSS,
with GSAP for the reveals and Lenis for smooth scroll.

The page is one run down the **Vallée Blanche** — 3842 m at the top of the ASCII plate,
1035 m in Chamonix at the footer. The altimeter bottom-left reads out where you are on it.

---

## The hero

`public/ascii/vallee-blanche.txt` is a 1000 × 263 character plate — a photograph of the
Vallée Blanche turned into ASCII. Scrolling flies into the sun at the top right until the
picture burns out to flat paper, and the site's first line arrives out of that light.

The renderer ([`src/lib/ascii/renderer.ts`](src/lib/ascii/renderer.ts)) draws it twice,
because the two ends of the zoom want opposite things:

- **A raster.** The whole plate rendered once into an offscreen canvas, then scaled. Flat
  cost. Drawing 263 000 glyphs with `fillText` every frame is tens of milliseconds, and at
  2 px a glyph is texture, not a character.
- **Live text**, culled to the visible window — so its cost *falls* as the zoom rises, and
  the close approach is nearly free.

Between 7 and 14 device pixels per cell the text fades in over the raster. Both derive
their geometry from the same cell size, so they land on each other and the crossfade reads
as a lens pulling focus.

Two details worth knowing before you change anything there:

- `RASTER_WEIGHT` exists because a glyph stem cannot be thinner than one pixel. At the ~9 px
  font the raster uses, every stroke is fatter in proportion than the same glyph drawn
  large, and the plate comes out a flat grey mass. Pulling the ink back fixes it — and
  lines the raster up tonally with the live text that replaces it.
- The plate is 2 : 1. On a wide screen it is laid on the paper *whole*, high in the frame,
  because filling a landscape viewport means cropping a fifth off each side and throwing
  away the sky. A phone gets the opposite treatment — full bleed, with the resting anchor
  already shifted toward the sun so it is on screen before you start.

Regenerate the plate with `build_hero.py` in the source folder, or drop in any grid of the
same shape and update `SUN` in [`src/lib/ascii/grid.ts`](src/lib/ascii/grid.ts).

## Colour

Three values, no more. `paper` and `ink` are lifted straight out of the plate, so the hero
canvas and the page it sits on are literally the same two colours. `green` is the only
accent. Everything else — muted text, hairlines, panel grounds — is those three mixed, and
the mixes are precomputed in [`src/app/globals.css`](src/app/globals.css) so they stay exact.

| Token | Value | |
| --- | --- | --- |
| `paper` | `#faf8f3` | the ground |
| `ink` | `#1a1e26` | 15.7 : 1 on paper |
| `green` | `#2f5d3a` | 7.2 : 1 on paper |
| `muted` | `#6f7174` | ink at 62% — 4.6 : 1, passes AA for body |

## Motion

Two moves for the whole site: type rises out of a mask, and rules draw themselves. That is
the entire vocabulary — everything else is the hero.

`prefers-reduced-motion` is honoured throughout: the flight is off, Lenis never
initialises, and the sticky column collapses so the plate, the title and the line it hands
off to become three ordinary blocks. Same content, no motion.

---

## Run it

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. For a phone on the same Wi-Fi, `npm run dev -- -H 0.0.0.0`,
then open `http://<your-local-ip>:3000`.

## Deploy

Both shapes come out of one config.

**GitHub Pages** — [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)
already does it. Set repo **Settings → Pages → Source → "GitHub Actions"** once; after that
every push to `main` publishes to <https://frei22.github.io/ErikFreimann/>, and a nightly
run refreshes the repo feed (a static export bakes it in at build time).

**Vercel** — import the repo, accept every default. No environment variables. The repo feed
refetches hourly on its own.

Moving to a custom domain or a `frei22.github.io` repo? Set `NEXT_PUBLIC_BASE_PATH` to `""`
in the workflow — it exists because a project site is served from `/<repo>`, not the root —
and update `site.url` so link previews resolve.

## Configuration

Everything personal lives in [`src/config/site.ts`](src/config/site.ts). Edit that file and
the whole site follows: the descent's section list, the altitudes, the statement the
whiteout hands you, the projects, and which patch of the plate backs each project's panel.

## The GitHub feed

[`src/lib/github.ts`](src/lib/github.ts) fetches public repos, drops forks, archived repos,
anything in `hiddenRepos`, and the featured repos, then sorts by stars and recency. It runs
on the server — hourly on Vercel, at build time for a static export — so no key ships to
the browser. It never throws: if GitHub is unreachable or rate-limited, the section shows a
link to the profile rather than an empty grid.

## Layout of the code

```
src/
  app/                     routes, metadata, global CSS + design tokens
  components/ascii/        the hero flight, and the plate crops in the work panel
  components/sections/     work, case study, repos, about, contact
  components/site/         nav, altimeter, the two reveal primitives
  config/site.ts           everything personal
  lib/ascii/               plate loader + the two-path renderer
  lib/                     GSAP setup, Lenis, GitHub fetch, base-path helper
public/ascii/              the 1000 × 263 plate (~75 KB gzipped)
```

## Scripts

```bash
npm run shots            # frames of the whole descent → /mockups (server on :3100)
npm run og               # regenerate public/og.png after a name/palette change
npm run build:export     # static export → ./out
npm run verify:export    # serve ./out under /ErikFreimann and smoke-test it
```

`verify:export` is the one that matters before a Pages deploy — it serves the export from a
sub-path the way Pages does, walks the whole page, and fails on a 404, a JS error, an
unpainted hero, or a reveal that never fired.

## Still to do

1. **Make a repo public, or the work index stays unlinked.** Every featured project —
   StiLU, RoamBetter, mat_ai, Indiska-grytan — is private, so those rows deliberately
   render as plain entries marked *Private repo* rather than links to a 404. Paste a URL
   into `href` in `src/config/site.ts` and the row becomes a link.
2. **Add descriptions to `ErikFreimann` and `SkaneWakePark` on GitHub** — they are the only
   two public repos, and the feed shows `—` where the description would be.
3. Fill in the LinkedIn URL in `socials` (blank socials are skipped).
4. Verify the case-study copy against the repos — it is still drafted from conversation,
   not read from the source.
5. Lighthouse pass on a real mid-range phone.

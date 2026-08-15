# Erik Freimann — Portfolio

Personal portfolio and case-study site. Next.js (App Router) + TypeScript + Tailwind CSS,
with GSAP (ScrollTrigger + SplitText) and Lenis for motion.

**Status: direction chosen — "Cinema".** The page is built out full length (hero,
camera-move scene, pinned work gallery, scrubbed case study, project grid, about,
contact) in three variants of that direction. Copy is drafted and imagery is
placeholder; both get replaced before launch.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

- `/` — index of everything below
- `/d/c` — **Cinema / Ivory** — the chosen direction, built out full length
- `/d/c2` — **Cinema / Night** — ink ground, ember accent, hero centred
- `/d/c3` — **Cinema / Press** — bright paper, deep green, hero split across a rule
- `/d/a`, `/d/b` — the two directions not taken, kept for reference

All three Cinema pages render the same sections from the same components
(`src/components/cinema/`). A variant is a `CinemaTheme` — ground, accent and
hero composition — so choosing one is a one-line change, and unused variants
can simply be deleted.

## Configuration

Everything personal lives in [`src/config/site.ts`](src/config/site.ts) — name, tagline,
location, email, GitHub username, featured/hidden repos, and the project list. Edit that
file and the whole site follows.

Values still marked `TODO` in that file were inferred and need confirming: the contact
email, the GitHub username (`frei22`, taken from the repo owner), the exact repo slugs to
feature, and the list of repos to hide.

## Screenshots

`scripts/capture.sh` builds the site, serves it on a free port, and drives Playwright over
it, writing frames to `/mockups`:

```bash
PORT=3100 ./scripts/capture.sh          # everything
PORT=3100 ./scripts/capture.sh c,c2,c3  # just the Cinema pages
```

Frames are viewport-sized rather than full-page on purpose — these pages use pinned and
sticky scenes that a full-page capture flattens into nonsense. `scripts/screenshot.mjs`
holds the per-direction capture steps (which scroll positions and hover targets to shoot).

The Chromium path is pinned for this container; override with `CHROMIUM_PATH` elsewhere.

## Placeholder artwork

`public/art/*.svg` is generated abstract poster art standing in for real project
screenshots — regenerate with `node scripts/generate-art.mjs`. Replace these with actual
screenshots of ALPINA, RoamBetter, the food tracker and Indiska Grytan before launch.

## Motion

- Lenis smooth scroll is driven off the GSAP ticker, so Lenis and ScrollTrigger share one
  rAF loop and one layout pass per frame.
- Animations are transform/opacity only. Pointer-driven effects use `gsap.quickTo` rather
  than per-frame loops of our own.
- `prefers-reduced-motion` is honoured everywhere: the intro timelines are skipped and the
  final state is shown, Lenis never initialises, the custom cursor and marquees stay put,
  and pinned/scrubbed scenes collapse into ordinary stacked content (see the reduced-motion
  block in `src/app/globals.css`). Content is never hidden behind an animation that did not
  run — `.js-anim` only hides elements once JS has confirmed it will animate them.

## Deployment

### Vercel (primary)

Push the repo and import it at [vercel.com/new](https://vercel.com/new). The defaults are
correct — build `next build`, no environment variables needed. Every push to the default
branch deploys.

### Firebase Hosting (alternative)

Next.js needs `output: "export"` in `next.config.ts` for a purely static host. Every page
here is already static (no server rendering, no API routes), so the export is clean:

```bash
npm i -g firebase-tools
firebase login
firebase init hosting        # public dir: out, single-page app: no
```

Add `output: "export"` to `next.config.ts`, then:

```bash
npm run build                # writes ./out
firebase deploy --only hosting
```

Note that `next/image` optimisation is unavailable on static export; the site uses plain
`<img>` with explicit dimensions, so nothing breaks.

## Still to do

1. Settle on a Cinema variant (ivory / night / press).
2. Read each featured repo's README and write the case studies from what is actually
   there — problem, build, stack, and the technically interesting parts.
3. Pull the remaining public repos from the GitHub REST API into the "All projects" grid,
   skipping `hiddenRepos` (it renders from `sampleRepos` for now).
4. Real project screenshots in place of the generated art.
5. Open Graph image, sitemap, and a Lighthouse pass on a real mid-range phone.

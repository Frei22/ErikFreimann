# Erik Freimann — Portfolio

Personal portfolio and case-study site. Next.js (App Router) + TypeScript + Tailwind CSS,
with GSAP (ScrollTrigger + SplitText) and Lenis for motion.

- `/` — the site: warm paper ground, deep green accent
- `/preview/night` — the same page on a dark ground, to compare (not indexed)

---

## Run it on your machine

```bash
git clone https://github.com/Frei22/ErikFreimann.git
cd ErikFreimann
npm install
npm run dev
```

Open <http://localhost:3000>.

### View it on your phone

Same Wi-Fi as your computer, then bind the dev server to your network:

```bash
npm run dev -- -H 0.0.0.0
```

Find your computer's local IP — `ipconfig` on Windows, `ipconfig getifaddr en0` on macOS,
`hostname -I` on Linux — and open `http://<that-ip>:3000` on the phone. It looks like
`http://192.168.1.42:3000`.

---

## Put it online

### Option A — Vercel (recommended)

1. Go to [vercel.com/new](https://vercel.com/new) and import `Frei22/ErikFreimann`.
2. Accept every default and deploy. No environment variables needed.

You get a URL like `erikfreimann.vercel.app`, and every push to `main` redeploys. The
GitHub repo feed refreshes hourly on its own.

### Option B — GitHub Pages (no other account needed)

The workflow in [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)
is already set up. Two steps:

1. Merge this branch into `main`.
2. Repo **Settings → Pages → Source → "GitHub Actions"**.

The site publishes to `https://frei22.github.io/ErikFreimann/` on every push to `main`,
and rebuilds nightly to pick up new repos. (A static export bakes the GitHub data in at
build time, hence the nightly run.)

Using a custom domain or a `frei22.github.io` repo later? Set `NEXT_PUBLIC_BASE_PATH` to
`""` in the workflow — it exists because a project site is served from `/<repo>`, not the
domain root.

Set `site.url` in the config to whichever URL you end up on, so link previews resolve.

---

## Configuration

Everything personal lives in [`src/config/site.ts`](src/config/site.ts). Edit that file and
the whole site follows.

**Please check these — I inferred them and could not verify them from my sandbox:**

| Field | Current value | Why it matters |
| --- | --- | --- |
| `githubUsername` | `frei22` | Wrong value = the "All projects" grid renders its fallback |
| `email` | `erik1.freimann2@gmail.com` | It's the main call to action, in the hero and the footer |
| `featuredRepos` | guessed slugs | These are excluded from the grid so they don't duplicate the case studies |
| `hiddenRepos` | empty | Anything listed here never appears |
| `socials` | LinkedIn is blank | Blank socials are skipped in the footer |

Project copy in the same file (`projects`, `featuredCase`, `about`) is drafted from what
you told me — it has **not** been checked against the repo READMEs yet.

## The GitHub feed

[`src/lib/github.ts`](src/lib/github.ts) fetches public repos for `githubUsername`, drops
forks, archived repos, anything in `hiddenRepos`, and the featured repos, then sorts by
stars and recency. It runs on the server — hourly on Vercel, at build time for a static
export — so no API key ships to the browser.

It never throws: if GitHub is unreachable or rate-limited, the section shows a link to your
profile instead of an empty grid. Anonymous requests are limited to 60/hour; CI passes
`GITHUB_TOKEN` automatically to lift that.

## Layout of the code

```
src/
  app/                     routes, metadata, global CSS
  components/cinema/       the page — hero, scenes, sections, theme
  components/              reusable bits (marquee, rolling text, magnetic, cursor, grain)
  config/site.ts           everything personal
  lib/                     motion setup, Lenis, GitHub fetch, asset paths
public/art/                generated placeholder posters (node scripts/generate-art.mjs)
```

Switching the ground is one line in `src/app/page.tsx`: swap `PAPER` for `NIGHT`. Themes
live in [`src/components/cinema/theme.ts`](src/components/cinema/theme.ts).

## Motion

- Lenis smooth scroll runs off the GSAP ticker, so both share one rAF loop and one layout
  pass per frame.
- Everything animates transform/opacity only; pointer effects use `gsap.quickTo`.
- `prefers-reduced-motion` is honoured throughout: intro timelines are skipped with the
  final state shown, Lenis never initialises, the custom cursor and marquees stay put, and
  pinned/scrubbed scenes collapse into ordinary stacked content.

## Screenshots

`scripts/capture.sh` builds, serves on a free port, and drives Playwright over the site,
writing frames to `/mockups`:

```bash
PORT=3100 ./scripts/capture.sh          # both pages
PORT=3100 ./scripts/capture.sh home     # just the site
```

`node scripts/og.mjs` regenerates `public/og.png` (the link-preview card) after any change
to the name, tagline or palette.

## Still to do

1. Confirm the config values in the table above.
2. Read each featured repo's README and rewrite the case studies from what's actually
   there — the copy is currently from our conversation, not the source.
3. Replace `public/art/*.svg` with real screenshots of ALPINA, RoamBetter, the food
   tracker and Indiska Grytan.
4. Lighthouse pass on a real mid-range phone.

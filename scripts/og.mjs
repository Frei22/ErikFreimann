/**
 * Renders the Open Graph card to public/og.png (1200×630) so links preview
 * properly. Run after changing the name, tagline or palette:
 *   node scripts/og.mjs
 *
 * The card is backed by the same ASCII plate the hero flies through — the
 * crop around the sun — so a shared link looks like the page it opens.
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const OUT = fileURLToPath(new URL("../public/og.png", import.meta.url));
const PLATE = fileURLToPath(new URL("../public/ascii/vallee-blanche.txt", import.meta.url));

/** The sun, top right of the plate. Sized to bleed off the top of the card. */
const CROP = { col: 786, row: 6, cols: 208, rows: 48 };

const escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const plate = (await readFile(PLATE, "utf8")).split("\n");
const art = escape(
  plate
    .slice(CROP.row, CROP.row + CROP.rows)
    .map((row) => row.padEnd(CROP.col + CROP.cols).slice(CROP.col, CROP.col + CROP.cols))
    .join("\n"),
);

const html = `<!doctype html>
<html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;1,9..144,400&family=Space+Mono:wght@400&display=swap" rel="stylesheet">
<style>
  * { margin: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; background: #faf8f3; color: #1a1e26;
    font-family: Fraunces, Georgia, serif; padding: 72px;
    display: flex; flex-direction: column; justify-content: space-between;
    position: relative; overflow: hidden;
  }
  .plate {
    position: absolute; top: -40px; right: -60px; margin: 0;
    font-family: 'Space Mono', monospace;
    font-size: 9px; line-height: 11px; letter-spacing: 0;
    white-space: pre; color: #1a1e26; opacity: .3;
  }
  .wash {
    position: absolute; inset: 0;
    background: linear-gradient(105deg, #faf8f3 34%, rgba(250,248,243,.55) 68%, rgba(250,248,243,.9) 100%);
  }
  .layer { position: relative; }
  .label { font-family: 'Space Mono', monospace; font-size: 18px; letter-spacing: .16em; text-transform: uppercase; color: #6f7174; }
  h1 { font-size: 132px; line-height: .88; letter-spacing: -.035em; font-weight: 400; }
  .accent { color: #2f5d3a; font-style: italic; }
  .row { display: flex; justify-content: space-between; align-items: flex-end; }
  .rule { height: 1px; background: #dfdedb; margin-bottom: 28px; }
  .dot { display: inline-block; width: 10px; height: 10px; border-radius: 99px; background: #2f5d3a; margin-right: 12px; }
</style></head>
<body>
  <pre class="plate">${art}</pre>
  <div class="wash"></div>

  <div class="layer label"><span class="dot"></span>Available for freelance work</div>
  <div class="layer">
    <h1>Erik<br><span class="accent">Freimann</span></h1>
  </div>
  <div class="layer">
    <div class="rule"></div>
    <div class="row">
      <div class="label">Full-stack developer — React · Next.js · Flutter · Firebase</div>
      <div class="label">Malmö / Luleå</div>
    </div>
  </div>
</body></html>`;

// Use Playwright's own browser unless a path is pinned (CI images do that).
const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: OUT });
await browser.close();
console.log(`wrote ${OUT}`);

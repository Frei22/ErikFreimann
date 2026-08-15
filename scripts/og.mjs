/**
 * Renders the Open Graph card to public/og.png (1200×630) so links preview
 * properly. Run after changing the name, tagline or palette:
 *   node scripts/og.mjs
 */
import { chromium } from "@playwright/test";

const OUT = new URL("../public/og.png", import.meta.url).pathname;
const EXECUTABLE =
  process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

const html = `<!doctype html>
<html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;1,9..144,400&family=Space+Mono:wght@400&display=swap" rel="stylesheet">
<style>
  * { margin: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; background: #efebe1; color: #14150f;
    font-family: Fraunces, Georgia, serif; padding: 72px;
    display: flex; flex-direction: column; justify-content: space-between;
    position: relative; overflow: hidden;
  }
  .label { font-family: 'Space Mono', monospace; font-size: 18px; letter-spacing: .16em; text-transform: uppercase; color: #6e7266; }
  h1 { font-size: 132px; line-height: .88; letter-spacing: -.03em; font-weight: 400; }
  .accent { color: #2f5d3a; font-style: italic; }
  .row { display: flex; justify-content: space-between; align-items: flex-end; }
  .rule { height: 1px; background: #d5d3c4; margin-bottom: 28px; }
  .dot { display: inline-block; width: 10px; height: 10px; border-radius: 99px; background: #2f5d3a; margin-right: 12px; }
</style></head>
<body>
  <div class="label"><span class="dot"></span>Available for freelance work</div>
  <div>
    <h1>Erik<br><span class="accent">Freimann</span></h1>
  </div>
  <div>
    <div class="rule"></div>
    <div class="row">
      <div class="label">Full-stack developer — React · Next.js · Flutter · Firebase</div>
      <div class="label">Malmö / Luleå</div>
    </div>
  </div>
</body></html>`;

const browser = await chromium.launch({ executablePath: EXECUTABLE });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: OUT });
await browser.close();
console.log(`wrote ${OUT}`);

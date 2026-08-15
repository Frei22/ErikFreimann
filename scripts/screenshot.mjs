/**
 * Captures each direction at the moments that actually matter — the hero, the
 * signature interaction, and a hover state — at desktop and mobile widths.
 * Frames are viewport-sized on purpose: these pages use pinned and sticky
 * scenes, which a full-page capture would flatten into nonsense.
 *
 * Usage: node scripts/screenshot.mjs [baseUrl]
 */
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const BASE = process.argv[2] ?? "http://127.0.0.1:3100";
const OUT = new URL("../mockups/", import.meta.url).pathname;
const EXECUTABLE =
  process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/** Wheel-scroll to an absolute Y, letting Lenis ease into place. */
async function scrollTo(page, targetY) {
  for (let i = 0; i < 60; i++) {
    const current = await page.evaluate(() => window.scrollY);
    const delta = targetY - current;
    if (Math.abs(delta) < 24) break;
    await page.mouse.wheel(0, Math.max(-900, Math.min(900, delta)));
    await wait(140);
  }
  await wait(900);
}

/** Absolute document Y of a marked element, offset by a fraction of viewport. */
async function anchorY(page, selector, offsetVh = 0) {
  return page.evaluate(
    ([sel, off]) => {
      const el = document.querySelector(sel);
      if (!el) return 0;
      return window.scrollY + el.getBoundingClientRect().top + window.innerHeight * off;
    },
    [selector, offsetVh],
  );
}

/**
 * `to: [selector, offsetVh]` scrolls until that element's top sits offsetVh
 * viewports above the fold — positive numbers go deeper into the section.
 */
const SHOTS = {
  a: [
    { name: "1-hero" },
    { name: "2-work-hover", to: ['[data-shot="work"]', 0.15], hover: '[data-shot="row"]' },
    { name: "3-rows", to: ['[data-shot="work"]', 0.6] },
  ],
  b: [
    { name: "1-hero" },
    { name: "2-deck", to: ['[data-shot="deck"]', 0.45] },
    { name: "3-deck-stacked", to: ['[data-shot="deck"]', 2.1] },
  ],
  c: [
    { name: "1-hero" },
    { name: "2-camera-open", to: ["[data-expand-scene]", 0.75] },
    { name: "3-gallery", to: ["[data-gallery-scene]", 1.6] },
  ],
};

async function shoot(browser, id, vp) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.dsf,
    isMobile: Boolean(vp.mobile),
    hasTouch: Boolean(vp.mobile),
  });
  const page = await context.newPage();
  await page.goto(`${BASE}/d/${id}`, { waitUntil: "networkidle" });

  await page
    .waitForFunction(() => document.documentElement.dataset.animDone === "true", null, {
      timeout: 20000,
    })
    .catch(() => console.warn(`  ! ${id}/${vp.label}: intro did not report done`));
  await wait(800);

  const steps = vp.mobile ? SHOTS[id].slice(0, 2) : SHOTS[id];

  for (const step of steps) {
    if (step.to) await scrollTo(page, await anchorY(page, step.to[0], step.to[1]));
    if (step.hover && !vp.mobile) {
      const box = await page.locator(step.hover).boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width * 0.35, box.y + box.height / 2, { steps: 12 });
        await wait(900);
      }
    }
    await page.screenshot({ path: `${OUT}${id}-${vp.label}-${step.name}.png` });
  }

  console.log(`  ✓ ${id} ${vp.label}`);
  await context.close();
}

const VIEWPORTS = [
  { label: "desktop", width: 1440, height: 900, dsf: 2 },
  { label: "mobile", width: 390, height: 844, dsf: 3, mobile: true },
];

const browser = await chromium.launch({ executablePath: EXECUTABLE });
await mkdir(OUT, { recursive: true });
for (const id of Object.keys(SHOTS)) {
  for (const vp of VIEWPORTS) await shoot(browser, id, vp);
}
await browser.close();
console.log(`\nSaved to ${OUT}`);

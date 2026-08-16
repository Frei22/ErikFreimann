/**
 * Captures the descent at the moments that matter, desktop and mobile.
 * Frames are viewport-sized on purpose: the hero is a sticky canvas, which a
 * full-page capture would flatten into nonsense.
 *
 * Usage:  node scripts/screenshot.mjs [baseUrl]
 *
 * `flight` steps are given as hero progress 0 → 1 and converted to an
 * absolute scroll position; `to` steps scroll to a selector.
 */
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const BASE = process.argv[2] ?? "http://127.0.0.1:3100";
const OUT = fileURLToPath(new URL("../mockups/", import.meta.url));

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/** Land exactly, via Lenis, then let the hero's follow lerp settle. */
async function scrollTo(page, y) {
  await page.evaluate((target) => {
    const lenis = window.__lenis;
    if (lenis) lenis.scrollTo(target, { immediate: true, force: true });
    else window.scrollTo(0, target);
  }, y);
  await wait(1100);
}

async function flightY(page, progress) {
  return page.evaluate((p) => {
    const shell = document.querySelector(".hero-shell");
    const stick = document.querySelector(".hero-stick");
    if (!shell || !stick) return 0;
    return (shell.offsetHeight - stick.offsetHeight) * p;
  }, progress);
}

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

const STEPS = [
  { name: "01-hero" },
  { name: "02-flight-early", flight: 0.22 },
  { name: "03-flight-mid", flight: 0.46 },
  { name: "04-flight-close", flight: 0.66 },
  { name: "05-whiteout", flight: 0.79 },
  { name: "06-statement", flight: 0.93 },
  { name: "07-work", to: ["#work", 0.06] },
  { name: "08-work-first", to: ["#work", 0.9] },
  { name: "09-work-first-deep", to: ["#work", 1.7] },
  { name: "10-work-second", to: ["#work", 3.1] },
  { name: "11-work-second-deep", to: ["#work", 3.9] },
  { name: "12-about", to: ["#about", 0.06] },
  { name: "13-contact", to: ["#contact", 0.2] },
];

const VIEWPORTS = [
  { label: "desktop", width: 1440, height: 900, dsf: 2 },
  { label: "mobile", width: 390, height: 844, dsf: 3, mobile: true },
];

async function shoot(browser, vp) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.dsf,
    isMobile: Boolean(vp.mobile),
    hasTouch: Boolean(vp.mobile),
  });
  const page = await context.newPage();

  const problems = [];
  page.on("pageerror", (e) => problems.push(`JS ${e.message.slice(0, 160)}`));
  page.on("response", (r) => {
    if (r.status() >= 400) problems.push(`${r.status()} ${r.url()}`);
  });

  await page.goto(BASE, { waitUntil: "networkidle" });
  await wait(1400); // plate fetch + rasterise

  for (const step of STEPS) {
    if (step.flight !== undefined) await scrollTo(page, await flightY(page, step.flight));
    if (step.to) await scrollTo(page, await anchorY(page, step.to[0], step.to[1]));
    if (step.hover) {
      if (vp.mobile) continue;
      const box = await page.locator(step.hover).boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width * 0.3, box.y + box.height / 2, { steps: 10 });
        await wait(900);
      }
    }
    await page.screenshot({ path: `${OUT}${vp.label}-${step.name}.png` });
  }

  console.log(`  ${vp.label}: ${problems.length ? problems.slice(0, 6).join(" | ") : "clean"}`);
  await context.close();
  return problems.length;
}

const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);
await mkdir(OUT, { recursive: true });

let failures = 0;
for (const vp of VIEWPORTS) failures += await shoot(browser, vp);
await browser.close();

console.log(`\nSaved to ${OUT}`);
if (failures) process.exitCode = 1;

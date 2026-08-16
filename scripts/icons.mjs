/**
 * Renders public/favicon.svg out to the raster sizes browsers still want:
 *
 *   favicon-32.png      fallback for anything that will not take an SVG icon
 *   apple-touch-icon.png  180×180, used when the site is saved to a home screen
 *
 * Run after changing the mark:
 *   node scripts/icons.mjs
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const SVG = fileURLToPath(new URL("../public/favicon.svg", import.meta.url));
const OUT = (name) => fileURLToPath(new URL(`../public/${name}`, import.meta.url));

const svg = await readFile(SVG, "utf8");

const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);

for (const [name, size] of [
  ["favicon-32.png", 32],
  ["apple-touch-icon.png", 180],
]) {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  // The mark is drawn edge to edge; the page must not add any of its own.
  await page.setContent(
    `<style>*{margin:0;padding:0}html,body{width:${size}px;height:${size}px;overflow:hidden}
     svg{display:block;width:${size}px;height:${size}px}</style>${svg}`,
    { waitUntil: "load" },
  );
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: OUT(name), omitBackground: true });
  await page.close();
  console.log(`wrote ${name} (${size}×${size})`);
}

await browser.close();

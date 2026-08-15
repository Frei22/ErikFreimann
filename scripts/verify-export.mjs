/**
 * Smoke-tests a static export served from a sub-path, the way GitHub Pages
 * serves a project site. Catches base-path mistakes before they ship.
 *
 *   NEXT_OUTPUT=export NEXT_PUBLIC_BASE_PATH=/ErikFreimann npm run build
 *   mkdir -p /tmp/pagesroot && cp -r out /tmp/pagesroot/ErikFreimann
 *   (cd /tmp/pagesroot && python3 -m http.server 3200) &
 *   node scripts/verify-export.mjs
 */
import { chromium } from "@playwright/test";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const bad = [];
p.on("response", r => { if (r.status() >= 400) bad.push(`${r.status()} ${r.url()}`); });
p.on("pageerror", e => bad.push("JS ERROR " + e.message.slice(0, 160)));
await p.goto("http://127.0.0.1:3200/ErikFreimann/", { waitUntil: "networkidle" });
await p.waitForFunction(() => document.documentElement.dataset.animDone === "true", null, { timeout: 15000 }).catch(() => bad.push("intro never completed"));
await new Promise(r => setTimeout(r, 1500));
const state = await p.evaluate(() => ({
  imagesLoaded: [...document.images].filter(i => i.complete && i.naturalWidth > 0).length,
  imagesTotal: document.images.length,
  hiddenAnims: [...document.querySelectorAll(".js-anim")].filter(e => getComputedStyle(e).visibility === "hidden").length,
  fontsOk: document.fonts.status,
  title: document.title,
}));
await p.screenshot({ path: "mockups/pages-build-check.png" });
// also the preview route
await p.goto("http://127.0.0.1:3200/ErikFreimann/preview/night/", { waitUntil: "networkidle" });
await new Promise(r => setTimeout(r, 1200));
console.log("state:", JSON.stringify(state));
console.log("failures:", bad.length ? bad.slice(0, 8) : "none");
await b.close();
if (bad.length) process.exitCode = 1;

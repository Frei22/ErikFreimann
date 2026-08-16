/**
 * Smoke-tests the static export the way GitHub Pages serves it — from a
 * sub-path, not the domain root. Catches base-path mistakes before they ship:
 * a wrong prefix 404s the plate, and the hero silently falls back to type.
 *
 *   NEXT_OUTPUT=export NEXT_PUBLIC_BASE_PATH=/ErikFreimann npm run build
 *   node scripts/verify-export.mjs
 *
 * Serves ./out under /ErikFreimann/ itself, so there is nothing to set up.
 */
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "/ErikFreimann";
const ROOT = fileURLToPath(new URL("../out/", import.meta.url));
const PORT = Number(process.env.PORT ?? 3200);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
};

if (!existsSync(ROOT)) {
  console.error("No ./out — run the export build first.");
  process.exit(1);
}

const server = createServer((req, res) => {
  let path = decodeURIComponent(new URL(req.url, "http://x").pathname);

  if (!path.startsWith(`${BASE_PATH}/`) && path !== BASE_PATH) {
    res.writeHead(404).end("outside base path");
    return;
  }
  path = path.slice(BASE_PATH.length) || "/";

  // normalize() collapses any ../ before it can escape the export.
  let file = join(ROOT, normalize(path));
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  if (!file.startsWith(ROOT) || !existsSync(file)) {
    res.writeHead(404).end("not found");
    return;
  }

  res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(res);
});

await new Promise((resolve) => server.listen(PORT, "127.0.0.1", resolve));

const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const failures = [];
page.on("response", (r) => {
  if (r.status() >= 400) failures.push(`${r.status()} ${r.url()}`);
});
page.on("pageerror", (e) => failures.push(`JS ERROR ${e.message.slice(0, 160)}`));

await page.goto(`http://127.0.0.1:${PORT}${BASE_PATH}/`, { waitUntil: "networkidle" });
await new Promise((r) => setTimeout(r, 2500));

const heroPainted = await page.evaluate(() => {
  const canvas = document.querySelector(".hero-canvas");
  const ctx = canvas?.getContext("2d");
  // Sample across the plate: all-paper means the fetch or the raster failed
  // and the hero is an empty box.
  if (!ctx || !canvas.width) return false;
  const { data } = ctx.getImageData(0, Math.round(canvas.height * 0.35), canvas.width, 1);
  let inked = 0;
  for (let i = 0; i < data.length; i += 4) if (data[i] < 230) inked++;
  return inked > 40;
});

// Walk the whole page so every reveal has had its trigger, then check that
// nothing stayed hidden — a reveal that never fires is invisible content.
for (let i = 1; i <= 24; i++) {
  await page.evaluate((f) => {
    const y = (document.body.scrollHeight - window.innerHeight) * f;
    window.__lenis?.scrollTo(y, { immediate: true, force: true }) ?? window.scrollTo(0, y);
  }, i / 24);
  await new Promise((r) => setTimeout(r, 250));
}
await new Promise((r) => setTimeout(r, 1200));

const state = await page.evaluate(() => {
  return {
    title: document.title,
    hiddenAnims: [...document.querySelectorAll(".js-anim")].filter(
      (el) => getComputedStyle(el).visibility === "hidden",
    ).length,
    sections: ["top", "work", "case", "repos", "about", "contact"].filter(
      (id) => !document.getElementById(id),
    ),
    fonts: document.fonts.status,
  };
});

if (!heroPainted) failures.push("hero canvas never painted the plate");
if (state.hiddenAnims) failures.push(`${state.hiddenAnims} elements still hidden after a full pass`);
if (state.sections.length) failures.push(`missing sections: ${state.sections.join(", ")}`);

console.log("state:  ", JSON.stringify({ heroPainted, ...state }));
console.log("result: ", failures.length ? failures.slice(0, 8) : "clean");

await browser.close();
server.close();
if (failures.length) process.exitCode = 1;

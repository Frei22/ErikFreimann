/**
 * Generates abstract poster art used as project-image placeholders until real
 * screenshots exist. Deterministic, tiny, and shape-only (no font dependency).
 * Run: node scripts/generate-art.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";

const OUT = new URL("../public/art/", import.meta.url).pathname;
await mkdir(OUT, { recursive: true });

const W = 1200;
const H = 900;

const PALETTES = {
  a: { bg: "#0b0d0e", ink: "#f2f1ec", accent: "#ccff3d", alt: "#1b1f22" },
  b: { bg: "#f5efe3", ink: "#12100e", accent: "#ff4d1c", alt: "#2b4bff" },
  c: { bg: "#e7e0d2", ink: "#16130f", accent: "#b23a2e", alt: "#c2a878" },
  // Cinema variants
  n: { bg: "#141210", ink: "#ede7da", accent: "#e0552f", alt: "#4a4038" },
  p: { bg: "#efece1", ink: "#12140f", accent: "#2f5d3a", alt: "#b9bda8" },
};

/** Mulberry32 — stable pseudo-random so art never changes between runs. */
function rng(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function halftone(id, color, size) {
  return `<pattern id="${id}" width="${size}" height="${size}" patternUnits="userSpaceOnUse">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.17}" fill="${color}"/>
    </pattern>`;
}

function poster(key, index) {
  const p = PALETTES[key];
  const r = rng(index * 7919 + key.charCodeAt(0));
  const shapes = [];

  // Ground
  shapes.push(`<rect width="${W}" height="${H}" fill="${p.bg}"/>`);

  // Big off-grid blocks
  const cols = 4;
  for (let i = 0; i < 5; i++) {
    const cw = W / cols;
    const x = Math.floor(r() * cols) * cw;
    const y = Math.floor(r() * 3) * (H / 3);
    const w = cw * (1 + Math.floor(r() * 2));
    const h = (H / 3) * (1 + Math.floor(r() * 2));
    const fill = [p.accent, p.alt, p.ink][Math.floor(r() * 3)];
    const op = fill === p.ink ? 0.14 : 0.9;
    shapes.push(
      `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" opacity="${op}"/>`,
    );
  }

  // Arc / ring
  const cx = 200 + r() * (W - 400);
  const cy = 180 + r() * (H - 360);
  const rad = 140 + r() * 190;
  shapes.push(
    `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="none" stroke="${p.ink}" stroke-width="${
      2 + Math.floor(r() * 3)
    }" opacity="0.5"/>`,
  );
  shapes.push(
    `<circle cx="${cx + rad * 0.5}" cy="${cy - rad * 0.3}" r="${rad * 0.42}" fill="${p.accent}"/>`,
  );

  // Halftone field
  shapes.push(
    `<rect x="0" y="${H * 0.55}" width="${W}" height="${H * 0.45}" fill="url(#dots${index})"/>`,
  );

  // Hard rules
  for (let i = 0; i < 3; i++) {
    const y = 80 + r() * (H - 160);
    shapes.push(
      `<rect x="0" y="${y}" width="${W}" height="${1 + Math.floor(r() * 3)}" fill="${p.ink}" opacity="0.35"/>`,
    );
  }

  // Chunky bar stack
  const bx = 80 + r() * 200;
  const by = H - 260;
  for (let i = 0; i < 4; i++) {
    shapes.push(
      `<rect x="${bx}" y="${by + i * 34}" width="${120 + r() * 420}" height="18" rx="9" fill="${
        i === 0 ? p.accent : p.ink
      }" opacity="${i === 0 ? 1 : 0.25}"/>`,
    );
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>${halftone(`dots${index}`, p.ink, 26)}</defs>
  ${shapes.join("\n  ")}
</svg>`;
}

for (const key of Object.keys(PALETTES)) {
  for (let i = 1; i <= 4; i++) {
    await writeFile(`${OUT}${key}-0${i}.svg`, poster(key, i));
  }
}
console.log("wrote 12 posters to public/art/");

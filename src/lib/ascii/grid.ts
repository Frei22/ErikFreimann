import { asset } from "@/lib/asset";

/** A rectangular character grid. Every row is padded to `cols`. */
export type AsciiGrid = { cols: number; rows: string[] };

/** Cell height ÷ cell width of the grid at generation time (Consolas 8×15). */
export const GRID_ASPECT = 1.875;

/**
 * The sun, in normalised grid coordinates — the point the hero flies into.
 * Measured off the plate, not guessed: around here the grid goes sparse, so
 * the last stretch of the zoom is a few huge glyphs drifting through light.
 */
export const SUN = { x: 0.877, y: 0.122 };

let pending: Promise<AsciiGrid> | null = null;

/**
 * Loads the plate once per page. ~258 KB of text, ~75 KB over the wire —
 * it is fetched rather than bundled so it never blocks the first paint, and
 * so the JS payload stays small.
 */
export function loadAsciiGrid(): Promise<AsciiGrid> {
  pending ??= fetch(asset("/ascii/vallee-blanche.txt"))
    .then((res) => {
      if (!res.ok) throw new Error(`ascii plate: ${res.status} ${res.statusText}`);
      return res.text();
    })
    .then((text) => {
      const rows = text.split("\n");
      while (rows.length && rows[rows.length - 1].trim() === "") rows.pop();
      const cols = rows.reduce((max, row) => Math.max(max, row.length), 0);
      return { cols, rows: rows.map((row) => row.padEnd(cols, " ")) };
    })
    .catch((error) => {
      // A missing plate must not take the page with it — the hero falls back
      // to type on paper, which is the same two colours anyway.
      console.warn("[ascii] plate unavailable:", error);
      pending = null;
      throw error;
    });

  return pending;
}

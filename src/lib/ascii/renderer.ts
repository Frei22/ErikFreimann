import { GRID_ASPECT, SUN, type AsciiGrid } from "./grid";

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  The hero: a 1000 × 263 character plate you fly into.
 *
 *  This is the draw from Erik's own ascii-hero.html, kept deliberately
 *  faithful — same cover framing, same centre anchor, same exponential
 *  zoom, same one-fillText-per-row. Measured on that page at 1440 × 900
 *  @dpr 2, a full redraw costs 9 ms at the widest shot and falls away fast
 *  (2 ms by a third of the way in, under 1 ms past halfway) because the
 *  cull shrinks as the cells grow. There is no need for a raster, and an
 *  earlier attempt at one was actively harmful: downscaling a pre-rendered
 *  plate averages the ink and turns fine stipple into a flat grey slab.
 *
 *  The one addition is the whiteout at the end — the picture bleaches to
 *  bare paper so the page's first line can arrive out of the light.
 * ─────────────────────────────────────────────────────────────────────────
 */

export type RendererTheme = { ink: string; paper: string };

/**
 * The plate's font stack, exactly as the original page had it.
 *
 * Do NOT put a CSS custom property in here. `ctx.font` is parsed without an
 * element context, so `var(--f-mono)` makes the whole declaration invalid;
 * the assignment is silently dropped and the context stays on its default
 * 10px sans-serif. Measured advance goes from 0.586 to 0.083, glyphs get
 * drawn ~12× wider than their cell, and the plate overlaps itself into mud.
 */
export const PLATE_FONT =
  'ui-monospace, "Cascadia Mono", Consolas, "SF Mono", ' +
  '"DejaVu Sans Mono", "Liberation Mono", monospace';

/**
 * Zoom at progress 1. The original used 12 — "the glyphs are large and fully
 * legible while a whole screenful still reads as picture". Past roughly 20
 * you arrive inside the sun's blank core and the frame empties out, which is
 * exactly where this one is going: the whiteout starts before it empties, so
 * the emptying happens under the light rather than in front of you.
 */
const MAX_ZOOM = 24;

/** Progress window over which the picture bleaches out to flat paper. */
const WHITEOUT_START = 0.72;
const WHITEOUT_END = 0.86;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smoothstep = (t: number) => t * t * (3 - 2 * t);

export class AsciiRenderer {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly grid: AsciiGrid;
  private readonly theme: RendererTheme;

  private vw = 0;
  private vh = 0;
  private dpr = 1;
  /** Glyph advance per 1 px of font-size, measured from the actual font. */
  private advance = 0.6;

  constructor(canvas: HTMLCanvasElement, grid: AsciiGrid, theme: RendererTheme) {
    // Keeping the alpha channel matters: on an opaque canvas Chromium picks
    // LCD subpixel antialiasing, which fringes glyphs this small with colour.
    // With alpha we get grey AA and clean stipple. We paint the paper anyway.
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("2d context unavailable");

    this.canvas = canvas;
    this.ctx = ctx;
    this.grid = grid;
    this.theme = theme;
  }

  resize() {
    // Cap DPR at 2: past that the extra glyph count buys nothing visible and
    // costs fill rate on exactly the phones that can't spare it.
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.vw = this.canvas.clientWidth;
    this.vh = this.canvas.clientHeight;
    if (!this.vw || !this.vh) return;

    this.canvas.width = Math.round(this.vw * this.dpr);
    this.canvas.height = Math.round(this.vh * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    this.ctx.font = `100px ${PLATE_FONT}`;
    this.advance = this.ctx.measureText("M").width / 100 || 0.6;
  }

  /**
   * @param progress 0 = the whole plate, 1 = bare light.
   */
  draw(progress: number) {
    const { ctx, vw, vh, grid } = this;
    if (!vw || !vh) return;

    const t = clamp01(progress);
    const { cols, rows } = grid;
    const nRows = rows.length;

    // Exponential zoom, so a constant scroll rate reads as a constant rate
    // of approach.
    const zoom = Math.exp(t * Math.log(MAX_ZOOM));

    // At zoom 1 the plate covers the viewport; the cell scales from there.
    const cellW = Math.max(vw / cols, vh / (nRows * GRID_ASPECT)) * zoom;
    const cellH = cellW * GRID_ASPECT;

    // The anchor drifts from the middle of the picture to the sun as we go in.
    const e = smoothstep(t);
    const fx = cols / 2 + (SUN.x * cols - cols / 2) * e;
    const fy = nRows / 2 + (SUN.y * nRows - nRows / 2) * e;
    const ox = vw / 2 - fx * cellW;
    const oy = vh / 2 - fy * cellH;

    ctx.globalAlpha = 1;
    ctx.fillStyle = this.theme.paper;
    ctx.fillRect(0, 0, vw, vh);

    // Cull to the visible window, so cost stays flat as we zoom in.
    const c0 = Math.max(0, Math.floor(-ox / cellW));
    const c1 = Math.min(cols, Math.ceil((vw - ox) / cellW));
    const r0 = Math.max(0, Math.floor(-oy / cellH));
    const r1 = Math.min(nRows, Math.ceil((vh - oy) / cellH));

    if (c1 > c0 && r1 > r0) {
      ctx.fillStyle = this.theme.ink;
      ctx.font = `${cellW / this.advance}px ${PLATE_FONT}`;
      ctx.textBaseline = "middle";
      ctx.textAlign = "left";

      const x = ox + c0 * cellW;
      for (let r = r0; r < r1; r++) {
        // One run per row — monospace guarantees it lands on the grid.
        ctx.fillText(rows[r].slice(c0, c1), x, oy + r * cellH + cellH / 2);
      }
    }

    // The whiteout. Laying paper over the top bleaches ink and glyph edges
    // together, so the picture burns out rather than dissolving in patches —
    // and it ends on the exact colour the next section starts on.
    const bleach = clamp01((t - WHITEOUT_START) / (WHITEOUT_END - WHITEOUT_START));
    if (bleach > 0) {
      ctx.globalAlpha = bleach;
      ctx.fillStyle = this.theme.paper;
      ctx.fillRect(0, 0, vw, vh);
      ctx.globalAlpha = 1;
    }
  }
}

export { MAX_ZOOM, WHITEOUT_START, WHITEOUT_END };

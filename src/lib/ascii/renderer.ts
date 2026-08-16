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

/**
 * Ease on the zoom.
 *
 * A plain exponential (the original's `exp(t · ln Z)`) changes scale at a
 * constant *relative* rate, which sounds right and feels wrong. Relative rate
 * constant means the frame edge sweeps a constant number of pixels per frame —
 * but at the wide shot a cell is under 2 px, so those pixels are several cells,
 * and the whole stipple field reshuffles between frames. It boils rather than
 * glides. Measured: a 0.004 step in progress repaints 27% of pixels at the
 * wide end against 8% at the close end.
 *
 * Easing in spends the scroll where the cells are big enough to move smoothly,
 * and crawls through the wide shot — which is also the only part that reads as
 * a picture, so it is the part worth lingering in.
 */
const ZOOM_EASE = 1.55;

/** Progress window over which the picture bleaches out to flat paper. */
const WHITEOUT_START = 0.72;
const WHITEOUT_END = 0.86;

/**
 * Fraction of the plate's width a narrow screen shows.
 *
 * Covering a phone with a 2 : 1 plate means throwing away 77% of the width,
 * which loses the sun the copy tells you to scroll into. Fitting the whole
 * width instead gives a 190 px ribbon with nothing in it. Extending the sky
 * upward to make it portrait-shaped would take 891 invented rows against 263
 * real ones. So a phone gets a slice — wide enough that the sun is in frame,
 * tall enough to carry the screen — laid as a band on paper.
 */
const PHONE_VISIBLE_WIDTH = 0.55;

/**
 * How far the band's own edges dissolve into the paper, in CSS px. The plate's
 * outermost sky rows are dense dither, so a short fade still reads as a ruled
 * edge — this needs to be long enough to actually dissolve them.
 */
const EDGE_FADE = 64;

/**
 * ── Why there is no bitmap here ──────────────────────────────────────────
 *
 * Some of the roughness at the wide shot is inherent: a cell is under 4
 * device px there, so re-rasterising type every frame re-snaps every stem to
 * a slightly different pixel grid and the field shimmers rather than glides.
 * Scaling a pre-rendered bitmap would interpolate instead, and move smoother.
 *
 * It was built and measured, and it is not used, because the supersampled
 * bitmap comes back a touch heavier in the sky than live text does, and
 * matching ascii-hero.html exactly beats a smoothness gain that could not be
 * demonstrated objectively. Performance is not the reason — a full live-text
 * redraw holds 60 fps at every zoom on a 1920 × 1080 @dpr 2 viewport.
 *
 * If the flight ever needs to be smoother than the plate needs to be exact,
 * this is the lever: raster the grid once at the zoom-1 device cell size,
 * blit it 1:1 at rest, and crossfade to live text over roughly 4.5 → 8
 * device px per cell.
 */

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
   * How the plate sits in the frame at rest, and how portrait the viewport is.
   * `k` is 0 on a landscape screen — cover, exactly as the original page — and
   * reaches 1 on a phone, where the plate becomes a band instead.
   */
  private framing() {
    const { cols, rows } = this.grid;
    const cover = Math.max(this.vw / cols, this.vh / (rows.length * GRID_ASPECT));
    const band = this.vw / (cols * PHONE_VISIBLE_WIDTH);
    const k = clamp01((1.45 - this.vw / this.vh) / 0.5);

    return {
      k,
      unit: cover * (1 - k) + band * k,
      // The band is pushed to the right of the plate so the sun is in it from
      // the first frame, and sits high so the title has clean paper beneath.
      restX: cols / 2 + (cols * (1 - PHONE_VISIBLE_WIDTH / 2) - cols / 2) * k,
      restY: 0.5 - 0.1 * k,
    };
  }

  /**
   * Paper laid over one horizontal edge of the plate, fading inward, so the
   * band ends in haze instead of a cut. `inward` is +1 for a top edge, -1 for
   * a bottom one. A no-op when the edge is outside the viewport.
   */
  private fadeEdge(edgeY: number, inward: 1 | -1) {
    const { ctx, vw, vh } = this;
    if (edgeY < -EDGE_FADE || edgeY > vh + EDGE_FADE) return;

    const far = edgeY + inward * EDGE_FADE;
    const gradient = ctx.createLinearGradient(0, edgeY, 0, far);
    gradient.addColorStop(0, this.theme.paper);
    gradient.addColorStop(1, "transparent");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, Math.min(edgeY, far), vw, EDGE_FADE);

    // Beyond the edge there is no picture at all, only paper.
    ctx.fillStyle = this.theme.paper;
    if (inward === 1) ctx.fillRect(0, 0, vw, Math.max(0, edgeY));
    else ctx.fillRect(0, Math.min(vh, edgeY), vw, vh);
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

    const zoom = Math.exp(Math.pow(t, ZOOM_EASE) * Math.log(MAX_ZOOM));

    const { unit, restX, restY } = this.framing();
    const cellW = unit * zoom;
    const cellH = cellW * GRID_ASPECT;

    // The anchor drifts from where the plate rests to the sun as we go in, and
    // the band recentres into the frame as it takes the screen over.
    const e = smoothstep(t);
    const fx = restX + (SUN.x * cols - restX) * e;
    const fy = nRows / 2 + (SUN.y * nRows - nRows / 2) * e;
    const ox = vw / 2 - fx * cellW;
    const oy = vh * (restY + (0.5 - restY) * e) - fy * cellH;

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

    // Where the plate's own edges fall inside the frame — a phone at rest —
    // dissolve them into the paper rather than cutting the picture off with a
    // ruled line. Off-screen edges cost nothing, so a covered viewport skips
    // this entirely.
    this.fadeEdge(oy, 1);
    this.fadeEdge(oy + nRows * cellH, -1);

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

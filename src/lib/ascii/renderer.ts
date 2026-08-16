import { GRID_ASPECT, SUN, type AsciiGrid } from "./grid";

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  The hero renderer: a 1000 × 263 character plate you fly into.
 *
 *  The whole difficulty is that the two ends of the zoom want opposite
 *  things. Zoomed out, all 263 000 glyphs are on screen at ~2 px each —
 *  drawing that with fillText every frame costs tens of milliseconds, and
 *  at 2 px nobody can read a glyph anyway. Zoomed in, only a few hundred
 *  cells are visible, they are enormous, and crisp type is the entire
 *  point.
 *
 *  So it draws twice, from the same geometry:
 *
 *    · a raster — the full plate rendered once into an offscreen canvas,
 *      then scaled. Flat cost, and it is the honest representation while
 *      cells are smaller than a glyph.
 *    · live text — culled to the visible window, so its cost falls as the
 *      zoom rises.
 *
 *  Between TEXT_IN and TEXT_FULL device pixels per cell the text fades in
 *  over the raster. Both paths derive x/y from the same cell size, so they
 *  land on each other and the crossfade reads as a lens pulling focus.
 * ─────────────────────────────────────────────────────────────────────────
 */

export type RendererTheme = { ink: string; paper: string; font: string };

/** Device px per cell: text starts fading in, and where it fully takes over. */
const TEXT_IN = 7;
const TEXT_FULL = 14;

/** Raster resolution, as a multiple of what zoom 1 needs — enough headroom
 *  to stay sharp right up to where live text takes the picture over. */
const RASTER_OVERSAMPLE = 3.4;
const RASTER_CELL_MIN = 2;
const RASTER_CELL_MAX = 5.2;
/** iOS refuses canvases over ~16.7 M px; stay well under on every device. */
const RASTER_MAX_PIXELS = 13.5e6;

/**
 * Ink weight in the raster.
 *
 * A glyph stem cannot be thinner than one pixel, so at the ~9 px font the
 * raster uses, every stroke is fatter in proportion than the same glyph drawn
 * large — the plate comes out a flat grey mass instead of the fine stipple it
 * is. Scaling the ink back takes that bloat out, and it also lines the raster
 * up tonally with the live text that replaces it, whose stems are thin because
 * its glyphs are big. Tuned against 32-final-paper.png.
 */
const RASTER_WEIGHT = 0.58;

/** Rows rasterised per frame. The partial raster is drawn as it grows, so
 *  this doubles as the entrance: the plate paints itself in, sky first. */
const BUILD_ROWS_PER_FRAME = 24;

/** Zoom at progress 1. Far past legibility and into bare light. */
const MAX_ZOOM = 40;

/** Progress window over which the picture bleaches out to flat paper. */
const WHITEOUT_START = 0.7;
const WHITEOUT_END = 0.84;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smoothstep = (t: number) => t * t * (3 - 2 * t);

export class AsciiRenderer {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly grid: AsciiGrid;
  private theme: RendererTheme;

  private raster: HTMLCanvasElement | null = null;
  private rasterCtx: CanvasRenderingContext2D | null = null;
  private rasterCell = 0;
  private builtRows = 0;

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

  get built() {
    return this.builtRows >= this.grid.rows.length;
  }

  /** 0 → 1 as the plate paints itself in. Drives the entrance fade. */
  get buildProgress() {
    return this.grid.rows.length ? this.builtRows / this.grid.rows.length : 1;
  }

  // ── layout ────────────────────────────────────────────────────────────

  resize() {
    // Cap DPR at 2: past that the glyph count per device pixel buys nothing
    // visible and costs fill rate on exactly the phones that can't spare it.
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.vw = this.canvas.clientWidth;
    this.vh = this.canvas.clientHeight;
    if (!this.vw || !this.vh) return;

    this.canvas.width = Math.round(this.vw * this.dpr);
    this.canvas.height = Math.round(this.vh * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    this.ctx.font = `100px ${this.theme.font}`;
    this.advance = this.ctx.measureText("M").width / 100 || 0.6;

    this.prepareRaster();
  }

  /**
   * Cell size at progress 0, and where the picture's centre sits in the frame.
   *
   * The plate is 2.03 : 1. Filling a landscape screen with it means cropping
   * a fifth off each side — which throws away the sky and puts the sun, the
   * thing the whole flight aims at, somewhere in the middle of the mountain.
   * So on a wide screen it is laid on the paper whole, high in the frame,
   * with the title on clean ground beneath it.
   *
   * A phone is the opposite case: the same plate across 390 px is a 190 px
   * ribbon with nothing either side of it. There it fills the screen. `k`
   * carries one framing into the other as the viewport gets narrower.
   */
  private framing() {
    const wide = this.vw / this.grid.cols;
    const tall = this.vh / (this.grid.rows.length * GRID_ASPECT);
    const k = clamp01((1.45 - this.vw / this.vh) / 0.5);

    return {
      k,
      unit: Math.min(wide, tall) * 0.88 * (1 - k) + Math.max(wide, tall) * k,
    };
  }

  private prepareRaster() {
    const { cols, rows } = this.grid;

    let cell = Math.min(
      RASTER_CELL_MAX,
      Math.max(RASTER_CELL_MIN, this.framing().unit * this.dpr * RASTER_OVERSAMPLE),
    );
    const pixels = cols * cell * (rows.length * cell * GRID_ASPECT);
    if (pixels > RASTER_MAX_PIXELS) cell *= Math.sqrt(RASTER_MAX_PIXELS / pixels);

    // Rebuilding is expensive, and a resize rarely changes what's needed by
    // much. Only redo it when the target moved more than a quarter.
    if (this.raster && Math.abs(cell - this.rasterCell) / this.rasterCell < 0.25) return;

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(cols * cell);
    canvas.height = Math.round(rows.length * cell * GRID_ASPECT);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Transparent ground: the raster is only glyphs, composited over the
    // paper the main canvas has already laid down.
    ctx.globalAlpha = RASTER_WEIGHT;
    ctx.fillStyle = this.theme.ink;
    ctx.font = `${cell / this.advance}px ${this.theme.font}`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";

    this.raster = canvas;
    this.rasterCtx = ctx;
    this.rasterCell = cell;
    this.builtRows = 0;
  }

  /** Rasterises the next slice. Call from the ticker until it returns false. */
  buildStep(rowBudget = BUILD_ROWS_PER_FRAME) {
    const ctx = this.rasterCtx;
    if (!ctx || this.built) return false;

    const cellH = this.rasterCell * GRID_ASPECT;
    const end = Math.min(this.grid.rows.length, this.builtRows + rowBudget);
    for (let r = this.builtRows; r < end; r++) {
      ctx.fillText(this.grid.rows[r], 0, r * cellH + cellH / 2);
    }
    this.builtRows = end;
    return true;
  }

  // ── draw ──────────────────────────────────────────────────────────────

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
    // of approach. The small exponent takes the jolt off the first pixel.
    const zoom = Math.exp(Math.pow(t, 1.08) * Math.log(MAX_ZOOM));
    const { unit, k } = this.framing();
    const cellW = unit * zoom;
    const cellH = cellW * GRID_ASPECT;

    // The anchor starts at the middle of the picture and slides to the sun,
    // easing so the drift is invisible early and decisive late.
    //
    // A narrow screen is filled by cropping the sides off a 2 : 1 plate, which
    // would put the sun — the thing the copy tells you to scroll into — off
    // the edge before you have started. So the more a viewport crops, the
    // further the resting anchor already sits toward it.
    const e = smoothstep(t);
    const restX = cols / 2 + (SUN.x * cols - cols / 2) * k * 0.8;
    const fx = restX + (SUN.x * cols - restX) * e;
    const fy = nRows / 2 + (SUN.y * nRows - nRows / 2) * e;

    // The plate sits high in the frame at rest and recentres as it takes the
    // screen over, so the title's ground is only borrowed for the first beat.
    const ox = vw / 2 - fx * cellW;
    const oy = vh * (0.4 + 0.1 * Math.max(k, e)) - fy * cellH;

    ctx.globalAlpha = 1;
    ctx.fillStyle = this.theme.paper;
    ctx.fillRect(0, 0, vw, vh);

    const textAlpha = clamp01((cellW * this.dpr - TEXT_IN) / (TEXT_FULL - TEXT_IN));

    if (textAlpha < 1 && this.raster && this.builtRows > 0) {
      const shown = this.builtRows / nRows;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(
        this.raster,
        0,
        0,
        this.raster.width,
        this.raster.height * shown,
        ox,
        oy,
        cols * cellW,
        this.builtRows * cellH,
      );
    }

    if (textAlpha > 0) {
      // Cull to the visible window: this is what keeps the cost falling as
      // the cells grow, and it is why the close approach is nearly free.
      const c0 = Math.max(0, Math.floor(-ox / cellW));
      const c1 = Math.min(cols, Math.ceil((vw - ox) / cellW));
      const r0 = Math.max(0, Math.floor(-oy / cellH));
      const r1 = Math.min(this.builtRows, Math.ceil((vh - oy) / cellH));

      if (c1 > c0 && r1 > r0) {
        ctx.globalAlpha = textAlpha;
        ctx.fillStyle = this.theme.ink;
        ctx.font = `${cellW / this.advance}px ${this.theme.font}`;
        ctx.textBaseline = "middle";
        ctx.textAlign = "left";

        const x = ox + c0 * cellW;
        for (let r = r0; r < r1; r++) {
          // One run per row — monospace guarantees it lands on the grid.
          ctx.fillText(rows[r].slice(c0, c1), x, oy + r * cellH + cellH / 2);
        }
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
    }

    ctx.globalAlpha = 1;
  }

  destroy() {
    // Free the raster explicitly — a 13 M px backing store is worth releasing
    // rather than waiting for the canvas element to be collected.
    if (this.raster) {
      this.raster.width = 0;
      this.raster.height = 0;
    }
    this.raster = null;
    this.rasterCtx = null;
  }
}

export { MAX_ZOOM, WHITEOUT_START, WHITEOUT_END };

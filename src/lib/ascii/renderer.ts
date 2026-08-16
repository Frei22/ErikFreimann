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

/** Where the plate sits this frame, in CSS px. */
type Geometry = { ox: number; oy: number; cellW: number; cellH: number };

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
 * The band's top and bottom edges are left hard, on purpose. They were hazed
 * into the paper for a while, but the plate's outermost sky rows are dense
 * dither, so the gradient read as a grey smear across the picture rather than
 * as light. A clean edge is better — it looks like a print on a page.
 */

/**
 * ── Why the wide shot is a bitmap ────────────────────────────────────────
 *
 * Not for speed. A full live-text redraw holds 60 fps at every zoom on a
 * 1920 × 1080 @dpr 2 viewport — that was measured.
 *
 * Canvas quantises a glyph's baseline to whole device pixels. Measured: sweep
 * a fillText y through one pixel and the ink lands in exactly two places, not
 * eleven. `textRendering = "geometricPrecision"` does not change it, and
 * neither does drawing at a fixed font size under a scale transform — both
 * still give two.
 *
 * Rows sit a fractional number of pixels apart, so as the zoom sweeps, each
 * row crosses its own snap threshold at its own moment and hops a whole pixel
 * on its own. That is the vibration: not the scroll stuttering, but every row
 * of the picture twitching independently while the page glides underneath.
 *
 * It cannot be fixed within live text. Making the rows hop together needs an
 * integer cell height, which at the wide shot means quantising the zoom in
 * 16–33% steps. A pre-rendered bitmap, scaled, interpolates instead of
 * re-snapping — measured at eleven distinct positions across the same sweep.
 *
 * So the trade is: the plate goes slightly soft either side of RASTER_TARGET
 * in exchange for motion that is actually continuous. Live text takes back
 * over once the cells are large enough that a one-pixel hop is a few per cent
 * of a cell rather than a third of one.
 */

/**
 * Bitmap resolution, as a multiple of the cell size at zoom 1. At exactly this
 * zoom the blit is 1 : 1 and identical to live text; below it the bitmap is
 * supersampled down, above it upscaled. 1.4 puts the exact point just inside
 * the range the bitmap is responsible for, so neither end drifts far.
 */
const RASTER_TARGET = 1.4;
/** iOS refuses canvases much over 16.7 M px; stay well under on every device. */
const RASTER_MAX_PIXELS = 13.5e6;
/** Rows per frame while it builds, so arrival never blocks a frame. */
const BUILD_ROWS_PER_FRAME = 32;

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

  private raster: HTMLCanvasElement | null = null;
  private rasterCtx: CanvasRenderingContext2D | null = null;
  /** Cell width the bitmap was drawn at, in its own pixels. */
  private rasterCell = 0;
  private builtRows = 0;

  private blend: HTMLCanvasElement | null = null;
  private blendCtx: CanvasRenderingContext2D | null = null;

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

    this.prepareRaster();
  }

  /** True once the wide-shot bitmap is complete. */
  get built() {
    return this.builtRows >= this.grid.rows.length;
  }

  private prepareRaster() {
    const { cols, rows } = this.grid;

    let cell = this.framing().unit * this.dpr * RASTER_TARGET;
    const pixels = cols * cell * (rows.length * cell * GRID_ASPECT);
    if (pixels > RASTER_MAX_PIXELS) cell *= Math.sqrt(RASTER_MAX_PIXELS / pixels);

    // Rebuilding is expensive and a resize rarely moves the target far.
    if (this.raster && Math.abs(cell - this.rasterCell) / this.rasterCell < 0.25) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Same rule as the live path: set the font, then take the pitch from the
    // font's own advance, so the bitmap's internal geometry is exact too.
    ctx.font = `${cell / this.advance}px ${PLATE_FONT}`;
    const pitch = ctx.measureText("M").width || cell;

    canvas.width = Math.ceil(cols * pitch);
    canvas.height = Math.ceil(rows.length * pitch * GRID_ASPECT);

    // Setting width/height resets the context, so the font goes back on after.
    ctx.font = `${cell / this.advance}px ${PLATE_FONT}`;
    ctx.fillStyle = this.theme.ink;
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";

    this.raster = canvas;
    this.rasterCtx = ctx;
    this.rasterCell = pitch;
    this.builtRows = 0;
  }

  /** Draws the next slice of the bitmap. Call from the ticker until false. */
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

  /** The viewport-sized scratch canvas the handover mixes through. */
  private layer(): CanvasRenderingContext2D | null {
    if (!this.blendCtx) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      this.blend = canvas;
      this.blendCtx = ctx;
    }

    const w = Math.round(this.vw * this.dpr);
    const h = Math.round(this.vh * this.dpr);
    if (this.blend && (this.blend.width !== w || this.blend.height !== h)) {
      this.blend.width = w;
      this.blend.height = h;
      this.blendCtx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }
    return this.blendCtx;
  }

  private paintPaper(ctx: CanvasRenderingContext2D) {
    ctx.globalAlpha = 1;
    ctx.fillStyle = this.theme.paper;
    ctx.fillRect(0, 0, this.vw, this.vh);
  }

  /** The wide shot, where a snapped baseline is a third of a cell and every
   *  row would twitch on its own. */
  private paintBitmap(ctx: CanvasRenderingContext2D, g: Geometry) {
    if (!this.raster || this.builtRows < 1) return;
    const shown = this.builtRows / this.grid.rows.length;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(
      this.raster,
      0,
      0,
      this.raster.width,
      this.raster.height * shown,
      g.ox,
      g.oy,
      this.grid.cols * g.cellW,
      this.builtRows * g.cellH,
    );
  }

  /** The close approach, where the cells are big and crisp type is the point. */
  private paintText(ctx: CanvasRenderingContext2D, g: Geometry) {
    const { cols, rows } = this.grid;
    const { ox, oy, cellW, cellH } = g;

    // Cull to the visible window, so cost stays flat as we zoom in.
    const c0 = Math.max(0, Math.floor(-ox / cellW));
    const c1 = Math.min(cols, Math.ceil((this.vw - ox) / cellW));
    const r0 = Math.max(0, Math.floor(-oy / cellH));
    const r1 = Math.min(rows.length, Math.ceil((this.vh - oy) / cellH));
    if (c1 <= c0 || r1 <= r0) return;

    ctx.globalAlpha = 1;
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

    // Set the font first, then take the cell size *from the font* rather than
    // the other way round.
    //
    // A row is one fillText, so the grid's column pitch is whatever advance
    // the font actually uses — and that is quantised, drifting from the size
    // we asked for by a few thousandths of a pixel per glyph. Over the ~790
    // columns on screen at the wide shot that accumulates to about 4 px, and
    // it resets to zero at certain sizes, so the right-hand side of the
    // picture stretches away and snaps back as the zoom sweeps: a small
    // horizontal shuffle, worst where the cells are smallest.
    //
    // Measuring the advance and treating *that* as the cell width makes the
    // run exact by construction. The scale error it introduces is under a
    // hundredth of a pixel per cell, which is invisible; the shuffle is not.
    ctx.font = `${(unit * zoom) / this.advance}px ${PLATE_FONT}`;
    const cellW = ctx.measureText("M").width || unit * zoom;
    const cellH = cellW * GRID_ASPECT;

    // The anchor drifts from where the plate rests to the sun as we go in, and
    // the band recentres into the frame as it takes the screen over.
    const e = smoothstep(t);
    const fx = restX + (SUN.x * cols - restX) * e;
    const fy = nRows / 2 + (SUN.y * nRows - nRows / 2) * e;
    const ox = vw / 2 - fx * cellW;
    const oy = vh * (restY + (0.5 - restY) * e) - fy * cellH;

    const geom = { ox, oy, cellW, cellH };

    /**
     * How much of the picture is live text rather than the bitmap.
     *
     * Both thresholds come off the bitmap's own resolution, not fixed numbers.
     * The handover starts exactly where the blit is 1 : 1 — the one point where
     * the two are the same rasterisation and so the same weight — and finishes
     * three times further in, by which point a snapped baseline is about 3% of
     * a row rather than a third of one. Below 1 : 1 the bitmap is supersampled
     * down, which is if anything finer than live text, so there is no reason to
     * start earlier.
     */
    const blend = clamp01(
      (cellW * this.dpr - this.rasterCell) / (this.rasterCell * 3 - this.rasterCell),
    );

    if (blend >= 1) {
      this.paintPaper(ctx);
      this.paintText(ctx, geom);
    } else if (blend <= 0) {
      this.paintPaper(ctx);
      this.paintBitmap(ctx, geom);
    } else {
      // Cross-fading two layers by drawing one over the other at partial alpha
      // does not average them — where both are solid ink the result comes out
      // lighter than either, so the picture dips in weight halfway through the
      // handover and reads as a flicker. Compositing the finished text frame
      // over the finished bitmap frame is a true linear mix, so the weight
      // holds and only the sharpness changes.
      const layer = this.layer();
      if (layer) {
        this.paintPaper(ctx);
        this.paintBitmap(ctx, geom);

        this.paintPaper(layer);
        this.paintText(layer, geom);

        ctx.globalAlpha = blend;
        ctx.drawImage(layer.canvas, 0, 0, vw, vh);
        ctx.globalAlpha = 1;
      } else {
        this.paintPaper(ctx);
        this.paintText(ctx, geom);
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

  destroy() {
    // Free the backing stores rather than waiting for collection — between
    // them they are the largest allocation on the page.
    for (const canvas of [this.raster, this.blend]) {
      if (canvas) {
        canvas.width = 0;
        canvas.height = 0;
      }
    }
    this.raster = null;
    this.rasterCtx = null;
    this.blend = null;
    this.blendCtx = null;
  }
}

export { MAX_ZOOM, WHITEOUT_START, WHITEOUT_END };

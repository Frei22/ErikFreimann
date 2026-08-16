"use client";

import { useRef } from "react";
import { GRID_ASPECT, loadAsciiGrid } from "@/lib/ascii/grid";
import { useIsomorphicLayoutEffect } from "@/lib/motion";

/**
 * A crop of the same plate the hero flies through, drawn at a size where the
 * characters are characters again. The coordinates are real offsets into
 * /public/ascii/vallee-blanche.txt — each project gets a different patch of
 * the mountain, and the grid file is already in cache by the time these mount.
 */
export type Crop = { col: number; row: number; cols: number; rows: number };

const MONO_FONT =
  'var(--f-mono), ui-monospace, "Cascadia Mono", Consolas, "SF Mono", "DejaVu Sans Mono", monospace';

export function AsciiPlate({ crop, className = "" }: { crop: Crop; className?: string }) {
  const canvasEl = useRef<HTMLCanvasElement>(null);

  useIsomorphicLayoutEffect(() => {
    const canvas = canvasEl.current;
    if (!canvas) return;

    let disposed = false;
    let draw = () => {};

    loadAsciiGrid()
      .then((grid) => {
        if (disposed) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        draw = () => {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          const w = canvas.clientWidth;
          const h = canvas.clientHeight;
          if (!w || !h) return;

          canvas.width = Math.round(w * dpr);
          canvas.height = Math.round(h * dpr);
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

          ctx.font = `100px ${MONO_FONT}`;
          const advance = ctx.measureText("M").width / 100 || 0.6;

          // Contain, so the crop is never cut off by an odd container ratio.
          const cellW = Math.min(w / crop.cols, h / (crop.rows * GRID_ASPECT));
          const cellH = cellW * GRID_ASPECT;
          const ox = (w - crop.cols * cellW) / 2;
          const oy = (h - crop.rows * cellH) / 2;

          ctx.clearRect(0, 0, w, h);
          // Same stem-bloat compensation the hero's raster uses: at a few
          // pixels per cell every stroke is a full pixel wide, and without
          // pulling the ink back the crop reads as a solid block rather than
          // as a piece of the picture.
          ctx.globalAlpha = 0.6;
          ctx.fillStyle = "#1a1e26";
          ctx.font = `${cellW / advance}px ${MONO_FONT}`;
          ctx.textBaseline = "middle";
          ctx.textAlign = "left";

          for (let r = 0; r < crop.rows; r++) {
            const row = grid.rows[crop.row + r];
            if (!row) break;
            ctx.fillText(
              row.slice(crop.col, crop.col + crop.cols),
              ox,
              oy + r * cellH + cellH / 2,
            );
          }
        };

        draw();
        window.addEventListener("resize", draw);
      })
      .catch(() => {
        /* No plate, no inset. The panel reads fine without it. */
      });

    return () => {
      disposed = true;
      window.removeEventListener("resize", draw);
    };
  }, [crop]);

  return (
    <canvas
      ref={canvasEl}
      aria-hidden
      className={`block h-full w-full opacity-70 ${className}`}
    />
  );
}

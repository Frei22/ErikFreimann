"use client";

import { useRef } from "react";
import { onHeroProgress } from "@/lib/heroProgress";
import { WHITEOUT_END } from "@/lib/ascii/renderer";
import { prefersReducedMotion, useIsomorphicLayoutEffect } from "@/lib/motion";

const RADIUS = 17;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * The flight's only instrument: a ring that closes as the plate comes toward
 * you, and is gone by the time the light hands you the first line.
 *
 * It belongs to the hero and nothing else — it appears once the title has
 * cleared the frame and leaves with the whiteout, so the rest of the page is
 * never carrying a progress meter it has no use for.
 */
export function FlightRing() {
  const root = useRef<HTMLDivElement>(null);
  const arc = useRef<SVGCircleElement>(null);

  useIsomorphicLayoutEffect(() => {
    // With no flight there is nothing to meter.
    if (prefersReducedMotion()) return;

    return onHeroProgress((p) => {
      const el = root.current;
      if (!el) return;

      const shown =
        Math.min(1, Math.max(0, (p - 0.02) / 0.07)) *
        (1 - Math.min(1, Math.max(0, (p - WHITEOUT_END) / 0.07)));

      el.style.opacity = String(shown);

      if (arc.current) {
        const filled = Math.min(1, Math.max(0, p / WHITEOUT_END));
        arc.current.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - filled));
      }
    });
  }, []);

  return (
    <div
      ref={root}
      aria-hidden
      className="pointer-events-none fixed bottom-6 left-1/2 z-40 -translate-x-1/2 opacity-0 select-none md:bottom-9"
    >
      <svg viewBox="0 0 44 44" className="size-11 md:size-12">
        {/* A breath of paper under it. A 1px ring over the plate's stipple is
            invisible; a hard disc would read as a sticker, so it fades out. */}
        <defs>
          <radialGradient id="flight-ring-ground">
            <stop offset="55%" stopColor="var(--color-paper)" stopOpacity="0.92" />
            <stop offset="100%" stopColor="var(--color-paper)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="22" cy="22" r="22" fill="url(#flight-ring-ground)" />

        <circle cx="22" cy="22" r={RADIUS} fill="none" stroke="var(--color-line)" strokeWidth="1" />
        <circle
          ref={arc}
          cx="22"
          cy="22"
          r={RADIUS}
          fill="none"
          stroke="var(--color-green)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
          transform="rotate(-90 22 22)"
        />
      </svg>
    </div>
  );
}

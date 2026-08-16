"use client";

import { useRef } from "react";
import { WHITEOUT_END } from "@/lib/ascii/renderer";
import { onHeroProgress } from "@/lib/heroProgress";
import { prefersReducedMotion, useIsomorphicLayoutEffect } from "@/lib/motion";

/**
 * The flight's only instrument: a green stripe across the foot of the screen
 * that draws itself as the plate comes toward you, and is gone by the time the
 * light hands you the first line.
 *
 * It belongs to the hero and nothing else — past the whiteout the page carries
 * no progress meter at all.
 */
export function FlightStripe() {
  const root = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

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

      if (bar.current) {
        const filled = Math.min(1, Math.max(0, p / WHITEOUT_END));
        bar.current.style.transform = `scaleX(${filled})`;
      }
    });
  }, []);

  return (
    <div
      ref={root}
      aria-hidden
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 h-0.5 opacity-0 select-none"
    >
      <span
        ref={bar}
        className="block h-full w-full origin-left scale-x-0 bg-green will-change-transform"
      />
    </div>
  );
}

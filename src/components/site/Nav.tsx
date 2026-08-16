"use client";

import { useRef } from "react";
import { site } from "@/config/site";
import { onHeroProgress } from "@/lib/heroProgress";
import { prefersReducedMotion, useIsomorphicLayoutEffect } from "@/lib/motion";

const LINKS = [
  ["Work", "#work"],
  ["About", "#about"],
  ["Contact", "#contact"],
] as const;

/**
 * The bar steps aside for the flight and comes back with the light: it is
 * gone by the time the plate fills the screen, and returns as the whiteout
 * finishes. Nothing else about it moves.
 */
export function Nav() {
  const bar = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    return onHeroProgress((p) => {
      const el = bar.current;
      if (!el) return;
      const gone = Math.min(1, Math.max(0, (p - 0.01) / 0.05));
      const back = Math.min(1, Math.max(0, (p - 0.86) / 0.09));
      const shown = Math.max(1 - gone, back);
      el.style.opacity = String(shown);
      el.style.transform = `translate3d(0, ${(1 - shown) * -18}px, 0)`;
      el.style.pointerEvents = shown > 0.5 ? "auto" : "none";
    });
  }, []);

  return (
    <header
      ref={bar}
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-5 font-mono text-[11px] tracking-[0.18em] uppercase mix-blend-normal will-change-[transform,opacity] md:px-10"
    >
      <a href="#top" className="wipe">
        {site.name}
      </a>

      <nav className="flex items-center gap-5 sm:gap-8">
        {LINKS.map(([label, href]) => (
          <a key={label} href={href} className="wipe text-muted transition-colors hover:text-ink">
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}

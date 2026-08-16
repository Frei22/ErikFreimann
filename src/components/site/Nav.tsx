"use client";

import { useRef } from "react";
import { useCopy } from "@/components/CopyProvider";
import { LangSwitch } from "@/components/site/LangSwitch";
import { site } from "@/config/site";
import { onHeroProgress } from "@/lib/heroProgress";
import { prefersReducedMotion, useIsomorphicLayoutEffect } from "@/lib/motion";

/**
 * The bar steps aside for the flight and comes back with the light: it is
 * gone by the time the plate fills the screen, and returns as the whiteout
 * finishes. Past the hero it takes a paper ground, because the work section's
 * sticky column scrolls up underneath it.
 */
export function Nav() {
  const bar = useRef<HTMLElement>(null);
  const copy = useCopy();

  useIsomorphicLayoutEffect(() => {
    // With no flight the bar never hides, so it needs its ground from the off.
    if (prefersReducedMotion()) {
      bar.current?.classList.add("is-solid");
      return;
    }

    return onHeroProgress((p) => {
      const el = bar.current;
      if (!el) return;
      const gone = Math.min(1, Math.max(0, (p - 0.01) / 0.05));
      const back = Math.min(1, Math.max(0, (p - 0.86) / 0.09));
      const shown = Math.max(1 - gone, back);
      el.style.opacity = String(shown);
      el.style.transform = `translate3d(0, ${(1 - shown) * -18}px, 0)`;
      el.style.pointerEvents = shown > 0.5 ? "auto" : "none";
      el.classList.toggle("is-solid", p > 0.98);
    });
  }, []);

  return (
    <header
      ref={bar}
      className="site-nav fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-4 px-5 py-5 font-mono text-[9.5px] tracking-[0.14em] uppercase will-change-[transform,opacity] sm:text-[11px] sm:tracking-[0.18em] md:px-10"
    >
      <a href="#top" className="wipe shrink-0">
        {site.name}
      </a>

      {/* Tight on a 390px screen once the language switch is in, so the gaps
          and the type scale down rather than the links being hidden. */}
      <nav className="flex items-center gap-3 sm:gap-5 md:gap-7">
        {copy.nav.map(({ label, href }) => (
          <a key={href} href={href} className="wipe text-muted transition-colors hover:text-ink">
            {label}
          </a>
        ))}
        <LangSwitch />
      </nav>
    </header>
  );
}

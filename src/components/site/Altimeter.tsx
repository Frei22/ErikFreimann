"use client";

import { useRef } from "react";
import { altitude, descent } from "@/config/site";
import { onHeroProgress } from "@/lib/heroProgress";
import {
  ScrollTrigger,
  prefersReducedMotion,
  registerGsap,
  useIsomorphicLayoutEffect,
} from "@/lib/motion";

/**
 * The instrument. It reads out where you are on the descent — 3842 m at the
 * top of the plate, 1035 m in Chamonix at the bottom of the page — and which
 * section you are standing in.
 *
 * Altitude comes from document scroll, not from the sections: monotonic, so
 * the number only ever falls. The label comes from whichever section is
 * across the middle of the screen.
 *
 * It switches on once the hero's title has cleared, so the two never share
 * the bottom-left corner.
 */
export function Altimeter() {
  const root = useRef<HTMLDivElement>(null);
  const metres = useRef<HTMLSpanElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const index = useRef<HTMLSpanElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    const reduced = prefersReducedMotion();

    // Two things can hide it: the hero's title owns the corner at the start,
    // and the footer's own bottom row owns it at the end.
    let arrived = reduced ? 1 : 0;
    let landed = 0;
    const apply = () => {
      if (root.current) root.current.style.opacity = String(arrived * (1 - landed));
    };
    apply();

    const unsubscribe = reduced
      ? () => {}
      : onHeroProgress((p) => {
          arrived = Math.min(1, Math.max(0, (p - 0.09) / 0.08));
          apply();
        });

    registerGsap();
    const span = altitude.bottom - altitude.top;

    const scroll = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const p = self.progress;
        if (metres.current) {
          metres.current.textContent = String(Math.round(altitude.top + span * p));
        }
        if (fill.current) fill.current.style.transform = `scaleX(${p})`;

        landed = Math.min(1, Math.max(0, (p - 0.965) / 0.025));
        apply();
      },
    });

    // The section across the middle of the viewport owns the label.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const section = descent.find((s) => s.id === entry.target.id);
          if (!section) continue;
          if (index.current) index.current.textContent = section.index;
          if (label.current) label.current.textContent = section.label;
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    for (const section of descent) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }

    return () => {
      unsubscribe();
      scroll.kill();
      observer.disconnect();
    };
  }, []);

  return (
    // Two shapes. On a wide screen it stacks in the bottom-left margin, where
    // there is nothing to collide with. On a phone there is no margin — content
    // runs edge to edge — so it becomes a status bar with its own ground rather
    // than an overlay sitting on top of the words.
    <div
      ref={root}
      aria-hidden
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-line bg-paper px-5 py-2.5 opacity-0 transition-opacity duration-300 select-none md:inset-x-auto md:bottom-8 md:left-10 md:block md:border-0 md:bg-transparent md:p-0"
    >
      <p className="tnum shrink-0 font-mono text-[11px] leading-none tracking-[0.06em] md:text-[13px]">
        <span ref={metres}>{altitude.top}</span>
        <span className="text-muted"> m</span>
      </p>

      <span className="block h-px flex-1 overflow-hidden bg-line md:mt-2.5 md:w-14 md:flex-none">
        <span ref={fill} className="block h-full w-full origin-left scale-x-0 bg-green" />
      </span>

      <p className="shrink-0 font-mono text-[9.5px] tracking-[0.2em] text-muted uppercase md:mt-2.5">
        <span ref={index}>{descent[0].index}</span>
        <span className="px-1.5 text-green">·</span>
        <span ref={label}>{descent[0].label}</span>
      </p>
    </div>
  );
}

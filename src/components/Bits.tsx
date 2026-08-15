"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion, useIsomorphicLayoutEffect } from "@/lib/motion";

/** Static film grain. No animation — texture without costing frames. */
export function Grain({ opacity = 0.4 }: { opacity?: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] mix-blend-overlay"
      style={{
        opacity,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
      }}
    />
  );
}

/** Rotating circular badge — sticker energy, one transform. */
export function SpinBadge({
  text,
  className = "",
  size = 132,
  color = "currentColor",
}: {
  text: string;
  className?: string;
  size?: number;
  color?: string;
}) {
  const ref = useRef<SVGSVGElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;
    const tween = gsap.to(ref.current, {
      rotation: 360,
      duration: 18,
      ease: "none",
      repeat: -1,
      transformOrigin: "50% 50%",
    });
    return () => {
      tween.kill();
    };
  }, []);

  const id = `badge-${text.replace(/\W/g, "").slice(0, 8)}`;

  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`will-change-transform ${className}`}
      aria-hidden
    >
      <defs>
        <path id={id} d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" fill="none" />
      </defs>
      <text fill={color} style={{ fontSize: 9.5, textTransform: "uppercase" }}>
        {/* textLength = the path's circumference (2πr, r=36), so the string is
            fitted to exactly one lap instead of overlapping itself. */}
        <textPath href={`#${id}`} textLength={226} lengthAdjust="spacingAndGlyphs">
          {text}
        </textPath>
      </text>
    </svg>
  );
}

/**
 * Custom cursor: a dot that tracks tightly plus a ring that lags.
 * Mouse-only, off under reduced motion, and it never covers content.
 */
export function CustomCursor({
  color = "#ffffff",
  blend = true,
  label = "View",
}: {
  color?: string;
  blend?: boolean;
  /** Shown inside the ring over elements marked data-cursor="view". */
  label?: string;
}) {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const tag = useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!dot.current || !ring.current) return;
    if (prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches) return;

    const dx = gsap.quickTo(dot.current, "x", { duration: 0.08, ease: "power2.out" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.08, ease: "power2.out" });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.45, ease: "power3.out" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.45, ease: "power3.out" });

    let revealed = false;
    const onMove = (e: PointerEvent) => {
      if (!revealed) {
        // Jump to the pointer before showing, so nothing flashes at 0,0.
        revealed = true;
        gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY });
        gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.2 });
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      const target = e.target as HTMLElement;
      const view = target?.closest?.('[data-cursor="view"]');
      const hot = view ?? target?.closest?.("a,button,[data-cursor]");
      gsap.to(ring.current, {
        scale: view ? 3.2 : hot ? 2.1 : 1,
        opacity: hot ? 0.95 : 0.5,
        duration: 0.4,
        ease: "power3.out",
        overwrite: "auto",
      });
      gsap.to(tag.current, {
        autoAlpha: view ? 1 : 0,
        duration: 0.25,
        overwrite: "auto",
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const blendClass = blend ? "mix-blend-difference" : "";

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[70] hidden lg:block">
      <div
        ref={dot}
        className={`absolute left-0 top-0 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 will-change-transform ${blendClass}`}
        style={{ backgroundColor: color }}
      />
      <div
        ref={ring}
        className={`absolute left-0 top-0 size-9 -translate-x-1/2 -translate-y-1/2 rounded-full border opacity-0 will-change-transform ${blendClass}`}
        style={{ borderColor: color }}
      >
        <span
          ref={tag}
          className="absolute inset-0 grid place-items-center text-[3.2px] font-bold tracking-[0.18em] uppercase opacity-0"
          style={{ color }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion, useIsomorphicLayoutEffect } from "@/lib/motion";

/**
 * The image that chases the cursor while a project row is hovered — the single
 * most recognisable interaction in this style of portfolio.
 * One fixed element, transform-only, driven by quickTo (no rAF loop of ours).
 */
export function CursorPreview({
  images,
  active,
  shape = "rounded-xl",
  size = "h-[300px] w-[380px]",
}: {
  images: string[];
  active: number | null;
  shape?: string;
  size?: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const lastX = useRef(0);

  useIsomorphicLayoutEffect(() => {
    const el = box.current;
    if (!el || prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.55, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.55, ease: "power3.out" });
    const rTo = gsap.quickTo(el, "rotation", { duration: 0.8, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      // Tilt into the direction of travel, then settle.
      rTo(gsap.utils.clamp(-12, 12, (e.clientX - lastX.current) * 0.6));
      lastX.current = e.clientX;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div
      ref={box}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-40 hidden -translate-x-1/2 -translate-y-1/2 will-change-transform lg:block"
    >
      <div
        className={`relative overflow-hidden ${shape} ${size} transition-[opacity,transform] duration-500 ease-out ${
          active === null ? "scale-90 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 size-full object-cover transition-opacity duration-300 ${
              active === i ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

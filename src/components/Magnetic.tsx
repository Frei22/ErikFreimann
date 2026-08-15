"use client";

import { useRef, type ReactNode } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Wraps an interactive element so it drifts toward the cursor.
 * Pointer-driven only (no rAF loop), skipped on touch and reduced motion.
 */
export function Magnetic({
  children,
  strength = 0.35,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const quickX = useRef<gsap.QuickToFunc | null>(null);
  const quickY = useRef<gsap.QuickToFunc | null>(null);

  const init = () => {
    if (!ref.current || quickX.current) return;
    quickX.current = gsap.quickTo(ref.current, "x", { duration: 0.5, ease: "power3.out" });
    quickY.current = gsap.quickTo(ref.current, "y", { duration: 0.5, ease: "power3.out" });
  };

  const onMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (e.pointerType !== "mouse" || prefersReducedMotion() || !ref.current) return;
    init();
    const r = ref.current.getBoundingClientRect();
    quickX.current?.((e.clientX - (r.left + r.width / 2)) * strength);
    quickY.current?.((e.clientY - (r.top + r.height / 2)) * strength);
  };

  const onLeave = () => {
    quickX.current?.(0);
    quickY.current?.(0);
  };

  return (
    <span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`inline-block will-change-transform ${className}`}
    >
      {children}
    </span>
  );
}

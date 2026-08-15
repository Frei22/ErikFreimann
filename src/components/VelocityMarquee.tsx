"use client";

import { useRef, type ReactNode } from "react";
import {
  ScrollTrigger,
  gsap,
  prefersReducedMotion,
  registerGsap,
  useIsomorphicLayoutEffect,
} from "@/lib/motion";

/**
 * A marquee that speeds up, reverses and skews with scroll velocity — the
 * "this page is alive" tell. One tween on one element: transform only.
 */
export function VelocityMarquee({
  children,
  baseSpeed = 22,
  className = "",
  skew = true,
}: {
  children: ReactNode;
  baseSpeed?: number;
  className?: string;
  skew?: boolean;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!track.current || prefersReducedMotion()) return;
    registerGsap();

    const ctx = gsap.context(() => {
      const tween = gsap.to(track.current, {
        xPercent: -50,
        duration: baseSpeed,
        ease: "none",
        repeat: -1,
      });

      const setSkew = gsap.quickTo(track.current, "skewX", {
        duration: 0.5,
        ease: "power3.out",
      });

      const st = ScrollTrigger.create({
        onUpdate: (self) => {
          const v = self.getVelocity();
          // Direction follows scroll direction; speed scales with it, clamped.
          tween.timeScale(gsap.utils.clamp(-6, 6, v / 260 || 1) || 1);
          if (skew) setSkew(gsap.utils.clamp(-9, 9, v / 320));
          gsap.to(tween, {
            timeScale: self.direction === -1 ? -1 : 1,
            duration: 0.9,
            overwrite: true,
          });
          if (skew) setSkew(0);
        },
      });

      return () => st.kill();
    }, wrap);

    return () => ctx.revert();
  }, [baseSpeed, skew]);

  return (
    <div ref={wrap} className={`overflow-hidden ${className}`}>
      <div ref={track} className="flex w-max will-change-transform">
        {children}
        {children}
      </div>
    </div>
  );
}

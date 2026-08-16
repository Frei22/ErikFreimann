"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion, registerGsap } from "./motion";

/**
 * Smooth scroll, driven off GSAP's ticker so Lenis, ScrollTrigger and the
 * hero's canvas share a single rAF loop — one layout pass per frame instead
 * of three. Skipped entirely under prefers-reduced-motion.
 */
export function useLenis() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    registerGsap();

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Native hash jumps teleport past Lenis and leave its internal position
    // out of step with the document. Hand anchors to Lenis instead so the
    // nav travels the page rather than cutting to it.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return;

      const anchor = (event.target as Element | null)?.closest?.("a[href^='#']");
      const hash = anchor?.getAttribute("href");
      if (!hash || hash === "#") return;

      const target = document.querySelector(hash);
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: 0, duration: 1.4 });
      history.replaceState(null, "", hash);
    };

    document.addEventListener("click", onClick);

    // Exposed for scripts/screenshot.mjs, which has to land on exact scroll
    // positions that a wheel loop can only approximate.
    (window as Window & { __lenis?: Lenis }).__lenis = lenis;

    return () => {
      document.removeEventListener("click", onClick);
      delete (window as Window & { __lenis?: Lenis }).__lenis;
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
}

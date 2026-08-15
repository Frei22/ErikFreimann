"use client";

import { useEffect, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

let registered = false;

/** Register GSAP plugins exactly once, client-side. */
export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, SplitText);
  registered = true;
}

/** True when the visitor has asked for less motion. */
export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Reveals `.js-anim` elements without animating them. Used as the
 * reduced-motion / no-JS fallback so content is never hidden.
 */
export function showFinalState(scope: HTMLElement | null) {
  document.documentElement.classList.add("motion-ready");
  if (!scope) return;
  gsap.set(scope.querySelectorAll(".js-anim"), { clearProps: "all" });
}

/** useLayoutEffect on the client, useEffect on the server (no SSR warning). */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Waits for webfonts before measuring text — SplitText needs final metrics. */
export function whenFontsReady(cb: () => void) {
  if (typeof document === "undefined") return;
  if (document.fonts?.status === "loaded") {
    cb();
    return;
  }
  document.fonts?.ready.then(cb) ?? cb();
}

export { gsap, ScrollTrigger, SplitText };

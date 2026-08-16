"use client";

import type { ReactNode, RefObject } from "react";
import {
  gsap,
  prefersReducedMotion,
  registerGsap,
  showFinalState,
  useIsomorphicLayoutEffect,
} from "@/lib/motion";

/**
 * The whole site has two moves. Type rises out of a mask; rules draw
 * themselves left to right. That is the entire vocabulary — everything else
 * is scroll, and the scroll belongs to the hero.
 */

/** One line of type behind a mask. Compose several for a multi-line heading. */
export function Mask({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`mask-line js-anim ${className}`} data-mask>
      <span>{children}</span>
    </span>
  );
}

/** A hairline that draws itself. */
export function Rule({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      data-rule
      className={`js-anim block h-px w-full origin-left bg-line ${className}`}
    />
  );
}

/**
 * Animates every `[data-mask]`, `[data-fade]` and `[data-rule]` inside the
 * scope as it arrives. `once` throughout: things settle and stay settled —
 * replaying on the way back up is the tell of a template.
 */
export function useReveal(scope: RefObject<HTMLElement | null>) {
  useIsomorphicLayoutEffect(() => {
    const root = scope.current;
    if (!root) return;

    if (prefersReducedMotion()) {
      showFinalState(root);
      return;
    }

    registerGsap();
    document.documentElement.classList.add("motion-ready");

    const ctx = gsap.context(() => {
      const trigger = (node: Element) => ({ trigger: node, start: "top 88%", once: true });

      // Masked lines rise together when they share a parent, so a stanza
      // reads as one movement rather than a queue of separate ones.
      const groups = new Map<Element, HTMLElement[]>();
      gsap.utils.toArray<HTMLElement>("[data-mask]").forEach((line) => {
        const parent = line.parentElement ?? root;
        const group = groups.get(parent) ?? [];
        group.push(line);
        groups.set(parent, group);
      });

      for (const [parent, lines] of groups) {
        gsap.from(
          lines.map((line) => line.firstElementChild),
          {
            // Past 100% because .mask-line's clip box now extends 0.2em below
            // the text to save descenders — the line has to clear that too, or
            // a sliver of it shows before the reveal starts.
            yPercent: 130,
            duration: 1.05,
            ease: "power4.out",
            stagger: 0.075,
            scrollTrigger: trigger(parent),
          },
        );
      }

      gsap.utils.toArray<HTMLElement>("[data-fade]").forEach((node) => {
        gsap.from(node, {
          y: 18,
          autoAlpha: 0,
          duration: 0.85,
          ease: "power3.out",
          delay: Number(node.dataset.fade) || 0,
          scrollTrigger: trigger(node),
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-rule]").forEach((node) => {
        gsap.from(node, {
          scaleX: 0,
          duration: 1.1,
          ease: "power3.inOut",
          scrollTrigger: trigger(node),
        });
      });
    }, root);

    return () => ctx.revert();
  }, [scope]);
}

"use client";

import { useRef } from "react";
import { site } from "@/config/site";
import { Magnetic } from "@/components/Magnetic";
import { RollingText } from "@/components/RollingText";
import type { CinemaTheme } from "./theme";
import {
  SplitText,
  gsap,
  prefersReducedMotion,
  registerGsap,
  showFinalState,
  useIsomorphicLayoutEffect,
  whenFontsReady,
} from "@/lib/motion";

/**
 * The hero owns the intro timeline and flips `animDone` when it settles.
 * Three compositions share one reveal: the name arrives character by character
 * out of a mask, everything else fades up behind it.
 */
export function CinemaHero({ theme }: { theme: CinemaTheme }) {
  const scope = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = scope.current;
    if (!el) return;
    registerGsap();

    const done = () => {
      document.documentElement.dataset.animDone = "true";
    };

    if (prefersReducedMotion()) {
      showFinalState(el);
      done();
      return;
    }

    document.documentElement.classList.add("motion-ready");

    const ctx = gsap.context(() => {
      const splits: SplitText[] = [];

      whenFontsReady(() => {
        const tl = gsap.timeline({ onComplete: done });

        el.querySelectorAll<HTMLElement>("[data-split]").forEach((node, i) => {
          const split = new SplitText(node, {
            type: "chars,lines",
            mask: "lines",
            linesClass: "overflow-hidden",
          });
          splits.push(split);
          tl.from(
            split.chars,
            { yPercent: 108, duration: 1.15, ease: "expo.out", stagger: 0.025 },
            i === 0 ? 0.1 : "-=1",
          );
        });

        tl.from(
          "[data-fade]",
          { autoAlpha: 0, y: 18, duration: 0.9, ease: "power3.out", stagger: 0.08 },
          "-=0.75",
        ).from(
          "[data-rule]",
          { scaleX: 0, transformOrigin: "left", duration: 1, ease: "expo.out" },
          "-=0.9",
        );
      });

      return () => splits.forEach((s) => s.revert());
    }, el);

    return () => ctx.revert();
  }, []);

  const label = (
    <p
      data-fade
      className="js-anim font-mono text-[11px] leading-relaxed tracking-[0.16em] text-[var(--muted)] uppercase"
    >
      {site.education}
      <br />
      Available for freelance work — {new Date().getFullYear()}
    </p>
  );

  const cta = (
    <Magnetic strength={0.4}>
      <a
        data-fade
        href={`mailto:${site.email}`}
        className="js-anim group inline-flex items-center gap-3 rounded-full bg-[var(--ink)] px-7 py-4 font-mono text-[12px] tracking-[0.14em] text-[var(--bg)] uppercase transition-colors hover:bg-[var(--accent)]"
      >
        <RollingText text="Work with me" />
        <span className="transition-transform duration-500 group-hover:translate-x-1.5">→</span>
      </a>
    </Magnetic>
  );

  if (theme.heroLayout === "centered") {
    return (
      <section
        ref={scope}
        className="relative flex min-h-[100svh] flex-col items-center justify-center px-5 py-28 text-center md:px-10"
      >
        <p
          data-fade
          className="js-anim mb-10 inline-flex items-center gap-2.5 rounded-full border border-[var(--line)] px-4 py-2 font-mono text-[11px] tracking-[0.16em] text-[var(--muted)] uppercase"
        >
          <span className="size-1.5 rounded-full bg-[var(--accent)]" aria-hidden />
          Available for freelance work
        </p>

        <h1 className="text-[clamp(3rem,12vw,12rem)] leading-[0.92] font-normal tracking-[-0.03em]">
          <span data-split className="js-anim block">
            Erik
          </span>
          <span data-split className="js-anim block italic text-[var(--accent)]">
            Freimann
          </span>
        </h1>

        <p
          data-fade
          className="js-anim mx-auto mt-9 max-w-xl font-inter text-[16px] leading-relaxed text-[var(--muted)]"
        >
          {site.intro}
        </p>

        <div className="mt-10">{cta}</div>

        <div className="absolute inset-x-5 bottom-6 flex items-end justify-between font-mono text-[11px] tracking-[0.16em] text-[var(--muted)] uppercase md:inset-x-10">
          <span data-fade className="js-anim">
            {site.location}
          </span>
          <span data-fade className="js-anim">
            (Scroll)
          </span>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={scope}
      className="flex min-h-[100svh] flex-col justify-center px-5 pb-10 pt-28 md:justify-end md:px-10 md:pb-14"
    >
      <div className="mb-8 max-w-md">{label}</div>

      <h1 className="text-[clamp(3.2rem,13.5vw,14rem)] leading-[0.86] font-normal tracking-[-0.03em]">
        <span data-split className="js-anim block">
          Erik
        </span>
        <span data-split className="js-anim block italic text-[var(--accent)] md:pl-[18vw]">
          Freimann
        </span>
      </h1>

      <div data-rule className="js-anim mt-10 h-px w-full bg-[var(--line)]" aria-hidden />

      <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
        <p
          data-fade
          className="js-anim max-w-sm font-inter text-[15px] leading-relaxed text-[var(--muted)]"
        >
          I design and build fast, modern web apps — start to finish, from the Firestore rules
          to the last hover state.
        </p>
        {cta}
        <span
          data-fade
          className="js-anim font-mono text-[11px] tracking-[0.16em] text-[var(--muted)] uppercase"
        >
          (Scroll)
        </span>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { featuredCase, projects } from "@/config/site";
import { RollingText } from "@/components/RollingText";
import { asset } from "@/lib/asset";
import type { CinemaTheme } from "./theme";
import {
  gsap,
  prefersReducedMotion,
  registerGsap,
  useIsomorphicLayoutEffect,
} from "@/lib/motion";

const art = (theme: CinemaTheme, i: number) => asset(`/art/${theme.artPrefix}-0${i + 1}.svg`);

/**
 * CAMERA MOVE 1 — a window in the middle of the page that opens to full bleed
 * as you scroll through it. clip-path only, so nothing reflows.
 */
export function CameraScene({ theme }: { theme: CinemaTheme }) {
  const scope = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = scope.current;
    if (!el || prefersReducedMotion()) return;
    registerGsap();

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.6 },
        })
        .fromTo(
          "[data-expand]",
          { clipPath: "inset(22% 26% 22% 26% round 20px)" },
          { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none" },
          0,
        )
        .fromTo("[data-expand] img", { scale: 1.35 }, { scale: 1, ease: "none" }, 0)
        .fromTo("[data-caption]", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0 }, 0.45);
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={scope} data-shot="camera" className="pin-scene relative h-[230vh]">
      <div className="pin-sticky sticky top-0 h-[100svh] overflow-hidden">
        <div data-expand className="expand-frame absolute inset-0 overflow-hidden">
          <img
            src={art(theme, 0)}
            alt=""
            width={1200}
            height={900}
            className="size-full object-cover will-change-transform"
          />
          <div className="absolute inset-0 bg-black/10" aria-hidden />
          <div
            className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/50 to-transparent md:h-1/2"
            aria-hidden
          />
        </div>

        <div
          data-caption
          className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-6 text-white md:p-10"
        >
          <h2 className="max-w-2xl text-[clamp(1.8rem,4.6vw,4rem)] leading-[1.02] font-normal">
            Four projects, start to finish — <span className="italic">design, build, ship.</span>
          </h2>
          <span className="font-mono text-[11px] tracking-[0.16em] uppercase">
            Selected work — 04
          </span>
        </div>
      </div>
    </section>
  );
}

/**
 * CAMERA MOVE 2 — the gallery is pinned and tracks sideways while the page
 * scrolls vertically.
 */
export function WorkGallery({ theme }: { theme: CinemaTheme }) {
  const scope = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = scope.current;
    const rail = track.current;
    if (!el || !rail || prefersReducedMotion()) return;
    registerGsap();

    const ctx = gsap.context(() => {
      const distance = () => rail.scrollWidth - window.innerWidth + 64;

      gsap.to(rail, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: "[data-pin]",
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });

      gsap.to("[data-progress]", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={scope} data-shot="gallery" className="pin-scene relative h-[420vh]">
      <div
        data-pin
        className="pin-sticky sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden"
      >
        <div className="flex items-baseline justify-between px-5 pb-8 font-mono text-[11px] tracking-[0.16em] text-[var(--muted)] uppercase md:px-10">
          <p>Selected work — the gallery tracks sideways as you scroll</p>
          <span>04</span>
        </div>

        <div
          ref={track}
          className="pin-track flex gap-6 px-5 will-change-transform md:gap-10 md:px-10"
        >
          {projects.map((project, i) => (
            <a
              key={project.name}
              href={project.href}
              data-cursor="view"
              className="group w-[78vw] shrink-0 md:w-[42vw]"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                <img
                  src={art(theme, i)}
                  alt=""
                  loading={i > 1 ? "lazy" : undefined}
                  decoding="async"
                  width={1200}
                  height={900}
                  className="size-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                />
                <span className="absolute left-4 top-4 rounded-full bg-[var(--bg)]/90 px-3 py-1 font-mono text-[10px] tracking-[0.14em] uppercase">
                  {project.index} — {project.year}
                </span>
              </div>

              <div className="mt-5 flex items-start justify-between gap-6">
                <div>
                  <h3 className="text-[clamp(1.6rem,3.4vw,2.8rem)] leading-none font-normal">
                    <RollingText text={project.name} />
                  </h3>
                  <p className="mt-3 max-w-md font-inter text-[14px] leading-relaxed text-[var(--muted)]">
                    {project.summary}
                  </p>
                </div>
                <span className="mt-2 shrink-0 font-mono text-[11px] tracking-[0.14em] text-[var(--muted)] uppercase">
                  {project.role}
                </span>
              </div>

              <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] tracking-[0.12em] text-[var(--muted)] uppercase">
                {project.stack.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
            </a>
          ))}
        </div>

        <div className="mt-10 px-5 md:px-10">
          <div className="h-px w-full bg-[var(--line)]">
            <div data-progress className="h-px origin-left scale-x-0 bg-[var(--accent)]" />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * CAMERA MOVE 3 — the featured case study. Pinned, and scrubbing through it
 * steps the copy and the image through three beats.
 */
export function CaseStudy({ theme }: { theme: CinemaTheme }) {
  const scope = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = scope.current;
    if (!el || prefersReducedMotion()) return;
    registerGsap();

    const ctx = gsap.context(() => {
      const texts = gsap.utils.toArray<HTMLElement>("[data-beat]");
      const images = gsap.utils.toArray<HTMLElement>("[data-beat-img]");

      gsap.set(texts.slice(1), { autoAlpha: 0, y: 24 });
      gsap.set(images.slice(1), { autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.6 },
      });

      // Each beat gets a hold, then a clean hand-off: the outgoing copy is gone
      // before the incoming arrives, so two beats are never legible at once.
      texts.forEach((_, i) => {
        if (i === 0) return;
        tl.to({}, { duration: 0.5 })
          .to(texts[i - 1], { autoAlpha: 0, y: -24, duration: 0.22 })
          .to(images[i - 1], { autoAlpha: 0, duration: 0.28 }, "<")
          .fromTo(
            images[i],
            { autoAlpha: 0, scale: 1.08 },
            { autoAlpha: 1, scale: 1, duration: 0.32 },
            ">-0.06",
          )
          .to(texts[i], { autoAlpha: 1, y: 0, duration: 0.3 }, "<0.04");
      });
      tl.to({}, { duration: 0.5 });

      gsap.to("[data-case-progress]", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: true },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={scope} data-shot="case" className="pin-scene relative h-[300vh]">
      <div className="pin-sticky sticky top-0 flex h-[100svh] items-center overflow-hidden px-5 md:px-10">
        <div className="grid w-full items-center gap-10 md:grid-cols-12 md:gap-14">
          {/* Copy */}
          <div className="relative md:col-span-5">
            <div className="mb-8 flex items-center gap-4 font-mono text-[11px] tracking-[0.16em] text-[var(--muted)] uppercase">
              <span>Case study</span>
              <span className="h-px flex-1 bg-[var(--line)]" />
              <span>{featuredCase.year}</span>
            </div>

            <h2 className="text-[clamp(2.2rem,5.5vw,4.5rem)] leading-[0.95] font-normal">
              {featuredCase.name}
            </h2>

            <div className="relative mt-8 min-h-[15rem]">
              {featuredCase.beats.map((beat, i) => (
                <div
                  key={beat.label}
                  data-beat
                  className={`pin-layer ${i === 0 ? "" : "absolute inset-0"}`}
                >
                  <p className="font-mono text-[11px] tracking-[0.16em] text-[var(--accent)] uppercase">
                    {String(i + 1).padStart(2, "0")} — {beat.label}
                  </p>
                  <h3 className="mt-4 max-w-md text-[clamp(1.3rem,2.4vw,2rem)] leading-[1.15] font-normal italic">
                    {beat.title}
                  </h3>
                  <p className="mt-4 max-w-md font-inter text-[15px] leading-relaxed text-[var(--muted)]">
                    {beat.body}
                  </p>
                </div>
              ))}
            </div>

            <ul className="mt-10 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] tracking-[0.12em] text-[var(--muted)] uppercase">
              {featuredCase.stack.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
          </div>

          {/* Scrub progress */}
          <div className="hidden md:col-span-1 md:block">
            <div className="mx-auto h-40 w-px bg-[var(--line)]">
              <div
                data-case-progress
                className="h-40 w-px origin-top scale-y-0 bg-[var(--accent)]"
              />
            </div>
          </div>

          {/* Stills */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm md:col-span-6">
            {featuredCase.beats.map((beat, i) => (
              <img
                key={beat.label}
                data-beat-img
                src={art(theme, i + 1)}
                alt=""
                loading="lazy"
                decoding="async"
                width={1200}
                height={900}
                className={`pin-layer size-full object-cover ${i === 0 ? "" : "absolute inset-0"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

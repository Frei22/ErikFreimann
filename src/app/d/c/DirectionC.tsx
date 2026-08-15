"use client";

import { useRef } from "react";
import { projects, site } from "@/config/site";
import { CustomCursor, Grain } from "@/components/Bits";
import { RollingText } from "@/components/RollingText";
import { Magnetic } from "@/components/Magnetic";
import { useLenis } from "@/lib/useLenis";
import {
  SplitText,
  gsap,
  prefersReducedMotion,
  registerGsap,
  showFinalState,
  useIsomorphicLayoutEffect,
  whenFontsReady,
} from "@/lib/motion";

const ART = projects.map((_, i) => `/art/c-0${i + 1}.svg`);

/**
 * DIRECTION C — "CINEMA".
 * Warm ivory, ink, and a burnt red. Type is enormous and serif; the motion
 * does the shouting. Two camera moves carry the page: a window that opens to
 * full-bleed as you scroll, then a gallery that tracks sideways while pinned.
 */
export function DirectionC() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  useLenis();

  useIsomorphicLayoutEffect(() => {
    const scope = root.current;
    if (!scope) return;
    registerGsap();

    const done = () => {
      document.documentElement.dataset.animDone = "true";
    };

    if (prefersReducedMotion()) {
      showFinalState(scope);
      done();
      return;
    }

    document.documentElement.classList.add("motion-ready");

    const ctx = gsap.context(() => {
      const splits: SplitText[] = [];

      whenFontsReady(() => {
        const tl = gsap.timeline({ onComplete: done });

        scope.querySelectorAll<HTMLElement>("[data-split]").forEach((el, i) => {
          const split = new SplitText(el, {
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
        ).from("[data-rule]", { scaleX: 0, transformOrigin: "left", duration: 1, ease: "expo.out" }, "-=0.9");

        // CAMERA MOVE 1 — the window opens to full bleed.
        gsap
          .timeline({
            scrollTrigger: {
              trigger: "[data-expand-scene]",
              start: "top top",
              end: "bottom bottom",
              scrub: 0.6,
            },
          })
          .fromTo(
            "[data-expand]",
            { clipPath: "inset(22% 26% 22% 26% round 20px)" },
            { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none" },
            0,
          )
          .fromTo("[data-expand] img", { scale: 1.35 }, { scale: 1, ease: "none" }, 0)
          .fromTo("[data-expand-caption]", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0 }, 0.45);

        // CAMERA MOVE 2 — pinned gallery tracks sideways.
        const el = track.current;
        if (el) {
          gsap.to(el, {
            x: () => -(el.scrollWidth - window.innerWidth + 64),
            ease: "none",
            scrollTrigger: {
              trigger: "[data-gallery-scene]",
              start: "top top",
              end: () => `+=${el.scrollWidth - window.innerWidth + 64}`,
              pin: "[data-gallery-pin]",
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          });

          gsap.to("[data-progress]", {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-gallery-scene]",
              start: "top top",
              end: () => `+=${el.scrollWidth - window.innerWidth + 64}`,
              scrub: true,
            },
          });
        }

        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((node) => {
          gsap.from(node, {
            y: 30,
            autoAlpha: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: node, start: "top 88%", once: true },
          });
        });
      });

      return () => splits.forEach((s) => s.revert());
    }, scope);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={root}
      className="hide-cursor relative min-h-screen overflow-x-clip bg-c-bg font-fraunces text-c-ink selection:bg-c-accent selection:text-c-bg"
    >
      <Grain opacity={0.3} />
      <CustomCursor color="#16130f" blend={false} label="View" />

      {/* NAV */}
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-5 font-mono text-[11px] tracking-[0.16em] uppercase md:px-10">
        <span data-fade className="js-anim">
          {site.name}
        </span>
        <span data-fade className="js-anim hidden md:block">
          {site.location}
        </span>
        <Magnetic strength={0.3}>
          <a data-fade href={`mailto:${site.email}`} className="js-anim">
            <RollingText text="Contact" />
          </a>
        </Magnetic>
      </header>

      {/* HERO */}
      <section className="flex min-h-[100svh] flex-col justify-center px-5 pb-10 pt-28 md:justify-end md:px-10 md:pb-14">
        <p
          data-fade
          className="js-anim mb-8 max-w-md font-mono text-[12px] leading-relaxed tracking-[0.08em] text-c-muted uppercase"
        >
          {site.education} — building full-stack web &amp; mobile products, available for
          freelance work.
        </p>

        <h1 className="text-[clamp(3.2rem,13.5vw,14rem)] leading-[0.86] font-normal tracking-[-0.03em]">
          <span data-split className="js-anim block">
            Erik
          </span>
          <span data-split className="js-anim block italic text-c-accent md:pl-[18vw]">
            Freimann
          </span>
        </h1>

        <div data-rule className="js-anim mt-10 h-px w-full bg-c-ink/25" aria-hidden />

        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <p data-fade className="js-anim max-w-sm font-inter text-[15px] leading-relaxed text-c-muted">
            I design and build fast, modern web apps — start to finish, from the Firestore rules
            to the last hover state.
          </p>
          <Magnetic strength={0.4}>
            <a
              data-fade
              href={`mailto:${site.email}`}
              className="js-anim group inline-flex items-center gap-3 rounded-full bg-c-ink px-7 py-4 font-mono text-[12px] tracking-[0.14em] text-c-bg uppercase transition-colors hover:bg-c-accent"
            >
              <RollingText text="Work with me" />
              <span className="transition-transform duration-500 group-hover:translate-x-1.5">
                →
              </span>
            </a>
          </Magnetic>
          <span data-fade className="js-anim font-mono text-[11px] tracking-[0.16em] text-c-muted uppercase">
            (Scroll)
          </span>
        </div>
      </section>

      {/* CAMERA MOVE 1 — window opens */}
      <section data-expand-scene className="pin-scene relative h-[230vh]">
        <div className="pin-sticky sticky top-0 h-[100svh] overflow-hidden">
          <div data-expand className="expand-frame absolute inset-0 overflow-hidden">
            <img
              src={ART[0]}
              alt=""
              width={1200}
              height={900}
              className="size-full object-cover will-change-transform"
            />
            {/* Scrim: keeps the caption readable whatever the artwork does. */}
            <div className="absolute inset-0 bg-c-ink/10" aria-hidden />
            <div
              className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-c-ink/95 via-c-ink/55 to-transparent md:h-1/2"
              aria-hidden
            />
          </div>
          <div
            data-expand-caption
            className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-6 text-c-bg md:p-10"
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

      {/* CAMERA MOVE 2 — pinned horizontal gallery */}
      <section data-gallery-scene className="pin-scene relative h-[420vh]">
        <div data-gallery-pin className="pin-sticky sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
          <div className="flex items-baseline justify-between px-5 pb-8 md:px-10">
            <p className="font-mono text-[11px] tracking-[0.16em] text-c-muted uppercase">
              Drag your scroll — the gallery tracks sideways
            </p>
            <span className="font-mono text-[11px] tracking-[0.16em] text-c-muted uppercase">
              04
            </span>
          </div>

          <div ref={track} className="pin-track flex gap-6 px-5 will-change-transform md:gap-10 md:px-10">
            {projects.map((project, i) => (
              <a
                key={project.name}
                href={project.href}
                data-cursor="view"
                className="group w-[78vw] shrink-0 md:w-[42vw]"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                  <img
                    src={ART[i]}
                    alt=""
                    loading={i > 1 ? "lazy" : undefined}
                    decoding="async"
                    width={1200}
                    height={900}
                    className="size-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-c-bg/90 px-3 py-1 font-mono text-[10px] tracking-[0.14em] uppercase">
                    {project.index} — {project.year}
                  </span>
                </div>

                <div className="mt-5 flex items-start justify-between gap-6">
                  <div>
                    <h3 className="text-[clamp(1.6rem,3.4vw,2.8rem)] leading-none font-normal">
                      <RollingText text={project.name} />
                    </h3>
                    <p className="mt-3 max-w-md font-inter text-[14px] leading-relaxed text-c-muted">
                      {project.summary}
                    </p>
                  </div>
                  <span className="mt-2 font-mono text-[11px] tracking-[0.14em] text-c-muted uppercase">
                    {project.role}
                  </span>
                </div>

                <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] tracking-[0.12em] text-c-muted uppercase">
                  {project.stack.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
              </a>
            ))}
          </div>

          <div className="mt-10 px-5 md:px-10">
            <div className="h-px w-full bg-c-line">
              <div data-progress className="h-px origin-left scale-x-0 bg-c-accent" />
            </div>
          </div>
        </div>
      </section>

      <div className="h-24 md:h-40" />
    </div>
  );
}

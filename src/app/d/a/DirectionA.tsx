"use client";

import { useRef, useState } from "react";
import { projects, site } from "@/config/site";
import { CursorPreview } from "@/components/CursorPreview";
import { CustomCursor, Grain, SpinBadge } from "@/components/Bits";
import { RollingText } from "@/components/RollingText";
import { VelocityMarquee } from "@/components/VelocityMarquee";
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

const ART = projects.map((_, i) => `/art/a-0${i + 1}.svg`);

/**
 * DIRECTION A — "TAKEOVER".
 * Black, acid lime, and type at billboard scale. Counter loader → curtain →
 * name slams in. Work is a list of rows that flood with colour on hover while
 * the project image chases the cursor.
 */
export function DirectionA() {
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
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
      gsap.set("[data-loader]", { display: "none" });
      done();
      return;
    }

    document.documentElement.classList.add("motion-ready");

    const ctx = gsap.context(() => {
      const splits: SplitText[] = [];

      whenFontsReady(() => {
        const tl = gsap.timeline({ onComplete: done });

        // 1. Loader: count to 100, then the curtain leaves.
        const count = { v: 0 };
        tl.to(count, {
          v: 100,
          duration: 0.85,
          ease: "power2.inOut",
          onUpdate: () => {
            if (counter.current) {
              counter.current.textContent = String(Math.round(count.v)).padStart(3, "0");
            }
          },
        })
          .to("[data-loader-bar]", { scaleX: 1, duration: 0.85, ease: "power2.inOut" }, 0)
          .to("[data-loader]", {
            yPercent: -100,
            duration: 0.85,
            ease: "expo.inOut",
          })
          .set("[data-loader]", { display: "none" });

        // 2. Name slams in, character by character.
        scope.querySelectorAll<HTMLElement>("[data-split]").forEach((el, i) => {
          const split = new SplitText(el, {
            type: "chars,lines",
            mask: "lines",
            linesClass: "overflow-hidden",
          });
          splits.push(split);
          tl.from(
            split.chars,
            {
              yPercent: 105,
              duration: 1.05,
              ease: "expo.out",
              stagger: 0.028,
            },
            i === 0 ? "-=0.55" : "-=0.9",
          );
        });

        tl.from(
          "[data-hero-item]",
          { autoAlpha: 0, y: 22, duration: 0.8, ease: "power3.out", stagger: 0.07 },
          "-=0.6",
        ).from("[data-hero-art]", { scaleY: 0, transformOrigin: "bottom", duration: 1, ease: "expo.out" }, "-=0.8");

        // 3. Scroll behaviour.
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.from(el, {
            y: 44,
            autoAlpha: 0,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        });

        // Hero art drifts — the "camera move" on the way out.
        gsap.to("[data-hero-art]", {
          yPercent: -22,
          ease: "none",
          scrollTrigger: { trigger: "[data-hero]", start: "top top", end: "bottom top", scrub: true },
        });
      });

      return () => splits.forEach((s) => s.revert());
    }, scope);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={root}
      className="hide-cursor relative min-h-screen overflow-x-clip bg-a-bg font-mono text-a-ink selection:bg-a-accent selection:text-a-bg"
    >
      <Grain opacity={0.22} />
      <CustomCursor color="#d8ff00" />
      <CursorPreview
        images={ART}
        active={hovered}
        shape="rounded-none"
        size="h-[250px] w-[320px]"
      />

      {/* LOADER */}
      <div
        data-loader
        className="fixed inset-0 z-[80] flex items-end justify-between bg-a-bg px-5 pb-6 md:px-8"
      >
        <span className="font-anton text-[clamp(4rem,18vw,14rem)] leading-[0.8] text-a-ink">
          <span ref={counter}>000</span>
        </span>
        <span className="pb-4 text-[11px] tracking-[0.2em] text-a-muted uppercase">
          {site.name} — Portfolio
        </span>
        <span
          data-loader-bar
          className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-a-accent"
          aria-hidden
        />
      </div>

      {/* NAV */}
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-5 text-[11px] tracking-[0.18em] uppercase mix-blend-difference md:px-8">
        <a href="#" data-hero-item className="js-anim font-bold">
          {site.name}
          <sup className="ml-0.5">®</sup>
        </a>
        <a href={`mailto:${site.email}`} data-hero-item className="js-anim hidden md:block">
          <RollingText text="Get in touch" />
        </a>
        <span data-hero-item className="js-anim flex items-center gap-2">
          <span className="size-1.5 animate-pulse rounded-full bg-a-accent" aria-hidden />
          Available 2026
        </span>
      </header>

      {/* HERO */}
      <section
        data-hero
        className="relative flex min-h-[100svh] flex-col justify-end gap-6 px-5 pb-6 pt-24 md:justify-between md:gap-0 md:px-8 md:pb-8"
      >
        <div className="pointer-events-none absolute right-[5vw] top-[42%] hidden md:block">
          <SpinBadge text="freelance · web · mobile · " color="#d8ff00" size={150} />
        </div>

        <h1 className="relative font-anton text-[clamp(3.5rem,15.5vw,17rem)] leading-[0.78] tracking-[-0.02em] uppercase">
          <span data-split className="js-anim block">
            Erik
          </span>

          {/* Art + copy sit inside the headline stack — the grid breaks here. */}
          <span className="my-4 flex items-end gap-5 md:my-2 md:gap-8">
            <span
              data-hero-art
              className="js-anim block w-[38vw] shrink-0 overflow-hidden md:w-[22vw]"
            >
              <img
                src="/art/a-01.svg"
                alt=""
                width={1200}
                height={900}
                className="aspect-[4/3] w-full object-cover"
              />
            </span>
            <span
              data-hero-item
              className="js-anim block max-w-md pb-1 font-mono text-[12px] leading-relaxed tracking-normal text-a-muted normal-case md:text-[13px]"
            >
              {site.intro}
            </span>
          </span>

          <span data-split className="js-anim block text-right md:text-left md:pl-[12vw]">
            Freimann<span className="text-a-accent">.</span>
          </span>
        </h1>

        <div className="mt-8 flex items-end justify-between gap-6 border-t border-a-line pt-5 text-[11px] tracking-[0.18em] uppercase">
          <span data-hero-item className="js-anim text-a-muted">
            {site.location}
          </span>
          <span data-hero-item className="js-anim hidden text-a-muted md:block">
            {site.education}
          </span>
          <a
            data-hero-item
            href={`mailto:${site.email}`}
            className="js-anim group flex items-center gap-3 bg-a-accent px-5 py-3 font-bold text-a-bg transition-colors hover:bg-a-ink"
          >
            <RollingText text="Work with me" />
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
        </div>
      </section>

      {/* VELOCITY MARQUEE */}
      <VelocityMarquee className="border-y border-a-accent bg-a-accent py-2.5 text-a-bg" baseSpeed={20}>
        <span className="flex shrink-0 items-center font-anton text-[clamp(1.6rem,3.6vw,3.2rem)] uppercase">
          {["Full-stack developer", "React & Next.js", "Flutter", "Firebase", "Open for work"].map(
            (word) => (
              <span key={word} className="flex items-center">
                <span className="px-5">{word}</span>
                <span className="text-[0.6em]">✦</span>
              </span>
            ),
          )}
        </span>
      </VelocityMarquee>

      {/* SELECTED WORK */}
      <section data-shot="work" className="px-5 pt-20 md:px-8 md:pt-32">
        <div data-reveal className="js-anim flex items-end justify-between">
          <h2 className="font-anton text-[clamp(2.6rem,9vw,8rem)] leading-[0.82] uppercase">
            Selected
            <br />
            work
          </h2>
          <span className="pb-3 text-[11px] tracking-[0.18em] text-a-muted uppercase">
            (04) — {new Date().getFullYear()}
          </span>
        </div>

        <ul className="mt-12 border-t border-a-line md:mt-20">
          {projects.map((project, i) => (
            <li key={project.name}>
              <a
                href={project.href}
                data-reveal
                data-cursor
                onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(i)}
                onPointerLeave={() => setHovered(null)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                data-shot={i === 1 ? "row" : undefined}
                className="js-anim group flex flex-col gap-4 border-b border-a-line px-2 py-6 transition-colors duration-300 hover:bg-a-accent hover:text-a-bg md:flex-row md:items-center md:gap-8 md:py-7"
              >
                <span className="w-10 shrink-0 text-[11px] tracking-[0.18em] text-a-muted uppercase group-hover:text-a-bg/60">
                  {project.index}
                </span>

                <h3 className="flex-1 font-anton text-[clamp(2.2rem,7vw,5.5rem)] leading-[0.85] uppercase">
                  <RollingText text={project.name} />
                </h3>

                {/* Mobile gets the image inline — there is no hover to chase. */}
                <img
                  src={ART[i]}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  width={1200}
                  height={900}
                  className="h-40 w-full object-cover md:hidden"
                />

                <span className="hidden max-w-[16rem] text-[11px] tracking-[0.14em] text-a-muted uppercase group-hover:text-a-bg/70 lg:block">
                  {project.stack.join(" · ")}
                </span>

                {/* On phones the year and arrow share a line; md:contents drops
                    this wrapper so the desktop row stays a single flex line. */}
                <div className="flex items-center justify-between md:contents">
                  <span className="text-[11px] tracking-[0.18em] text-a-muted uppercase group-hover:text-a-bg/70">
                    {project.year}
                  </span>
                  <span className="text-2xl transition-transform duration-500 ease-out group-hover:translate-x-2 group-hover:-translate-y-1">
                    ↗
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <div className="h-28 md:h-44" />
    </div>
  );
}

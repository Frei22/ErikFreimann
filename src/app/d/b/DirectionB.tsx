"use client";

import { useRef } from "react";
import { projects, site } from "@/config/site";
import { Grain, SpinBadge } from "@/components/Bits";
import { RollingText } from "@/components/RollingText";
import { VelocityMarquee } from "@/components/VelocityMarquee";
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

/** Card skins cycle so the stack reads as a deck of different objects. */
const SKINS = [
  { bg: "bg-b-orange", text: "text-b-ink", chip: "border-b-ink/30", art: "/art/b-01.svg" },
  { bg: "bg-b-cobalt", text: "text-b-bg", chip: "border-b-bg/40", art: "/art/b-02.svg" },
  { bg: "bg-b-ink", text: "text-b-bg", chip: "border-b-bg/40", art: "/art/b-03.svg" },
  { bg: "bg-b-bg", text: "text-b-ink", chip: "border-b-ink/30", art: "/art/b-04.svg" },
];

/**
 * DIRECTION B — "POP".
 * Cream paper, hard black outlines, orange and cobalt blocks, chunky expanded
 * type. Colour panels wipe off on load; the work section is a deck of cards
 * that stack up under each other as you scroll.
 */
export function DirectionB() {
  const root = useRef<HTMLDivElement>(null);
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
      gsap.set("[data-panel]", { display: "none" });
      done();
      return;
    }

    document.documentElement.classList.add("motion-ready");

    const ctx = gsap.context(() => {
      const splits: SplitText[] = [];

      whenFontsReady(() => {
        const tl = gsap.timeline({ onComplete: done });

        // Colour curtain: three panels leave in sequence.
        tl.to("[data-panel]", {
          yPercent: -100,
          duration: 0.85,
          ease: "expo.inOut",
          stagger: 0.12,
        }).set("[data-panel]", { display: "none" });

        scope.querySelectorAll<HTMLElement>("[data-split]").forEach((el, i) => {
          const split = new SplitText(el, {
            type: "chars,lines",
            mask: "lines",
            linesClass: "overflow-hidden",
          });
          splits.push(split);
          tl.from(
            split.chars,
            { yPercent: 110, duration: 0.9, ease: "expo.out", stagger: 0.03 },
            i === 0 ? "-=0.5" : "-=0.75",
          );
        });

        tl.from(
          "[data-pop]",
          {
            scale: 0.7,
            autoAlpha: 0,
            rotate: -8,
            duration: 0.7,
            ease: "back.out(1.7)",
            stagger: 0.08,
          },
          "-=0.5",
        );

        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.from(el, {
            y: 40,
            autoAlpha: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        });

        // The deck: each card shrinks slightly as the next one covers it.
        gsap.utils.toArray<HTMLElement>("[data-card]").forEach((card, i, all) => {
          if (i === all.length - 1) return;
          gsap.to(card, {
            scale: 0.93,
            filter: "brightness(0.88)",
            ease: "none",
            scrollTrigger: {
              trigger: all[i + 1],
              start: "top bottom",
              end: "top top+=120",
              scrub: true,
            },
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
      className="relative min-h-screen overflow-x-clip bg-b-bg font-bricolage text-b-ink selection:bg-b-orange selection:text-b-bg"
    >
      <Grain opacity={0.18} />

      {/* COLOUR CURTAIN */}
      <div className="pointer-events-none fixed inset-0 z-[80]">
        <div data-panel className="absolute inset-0 bg-b-ink" />
        <div data-panel className="absolute inset-0 bg-b-cobalt" />
        <div data-panel className="absolute inset-0 bg-b-orange" />
      </div>

      {/* NAV */}
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-4 md:px-6">
        <a
          data-pop
          href="#"
          className="js-anim rounded-full border-2 border-b-ink bg-b-bg px-4 py-2 font-mono text-[11px] font-bold tracking-[0.14em] uppercase"
        >
          {site.name}
        </a>
        <nav className="flex items-center gap-2">
          {["Work", "About"].map((item) => (
            <a
              key={item}
              data-pop
              href="#"
              className="js-anim hidden rounded-full border-2 border-b-ink px-4 py-2 font-mono text-[11px] font-bold tracking-[0.14em] uppercase transition-colors hover:bg-b-ink hover:text-b-bg sm:block"
            >
              {item}
            </a>
          ))}
          <Magnetic strength={0.3}>
            <a
              data-pop
              href={`mailto:${site.email}`}
              className="js-anim block rounded-full border-2 border-b-ink bg-b-orange px-4 py-2 font-mono text-[11px] font-bold tracking-[0.14em] uppercase transition-colors hover:bg-b-cobalt hover:text-b-bg"
            >
              <RollingText text="Hire me" />
            </a>
          </Magnetic>
        </nav>
      </header>

      {/* HERO */}
      <section className="relative px-4 pb-10 pt-24 md:px-6 md:pt-28">
        <div className="relative">
          <p
            data-pop
            className="js-anim mb-5 inline-flex items-center gap-2 rounded-full border-2 border-b-ink bg-b-bg px-3.5 py-1.5 font-mono text-[11px] font-bold tracking-[0.12em] uppercase"
          >
            <span className="size-2 rounded-full bg-b-orange" aria-hidden />
            {site.role} — {site.location}
          </p>

          <h1 className="font-bricolage text-[clamp(3rem,14.5vw,15rem)] leading-[0.82] font-extrabold tracking-[-0.045em] uppercase">
            <span data-split className="js-anim block">
              Erik
            </span>
            <span data-split className="js-anim block">
              Freimann
            </span>
          </h1>

          {/* Sticker */}
          <div
            data-pop
            className="js-anim absolute -top-2 right-0 hidden size-[124px] place-items-center rounded-full border-2 border-b-ink bg-b-cobalt text-b-bg md:grid lg:size-[150px]"
          >
            <SpinBadge text="available for freelance work · " color="#f2e9dc" size={130} />
            <span className="absolute font-mono text-2xl">✷</span>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:mt-10 md:grid-cols-12 md:items-end">
          <p
            data-pop
            className="js-anim max-w-lg text-[17px] leading-snug font-medium md:col-span-6 md:text-[20px]"
          >
            {site.intro}
          </p>

          <div data-pop className="js-anim md:col-span-3">
            <ul className="flex flex-wrap gap-2 font-mono text-[11px] font-bold tracking-[0.1em] uppercase">
              {["TypeScript", "React", "Next.js", "Flutter", "Firebase"].map((tech) => (
                <li key={tech} className="rounded-full border-2 border-b-ink px-3 py-1.5">
                  {tech}
                </li>
              ))}
            </ul>
          </div>

          <div data-pop className="js-anim md:col-span-3 md:justify-self-end">
            <Magnetic strength={0.4}>
              <a
                href={`mailto:${site.email}`}
                className="group inline-flex items-center gap-3 rounded-full border-2 border-b-ink bg-b-ink px-7 py-4 text-[15px] font-bold text-b-bg uppercase shadow-[6px_6px_0_0_var(--color-b-orange)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[10px_10px_0_0_var(--color-b-cobalt)]"
              >
                <RollingText text="Work with me" />
                <span className="grid size-7 place-items-center rounded-full bg-b-orange text-b-ink transition-transform duration-500 group-hover:rotate-45">
                  ↗
                </span>
              </a>
            </Magnetic>
          </div>
        </div>

        {/* Tilted art slab */}
        <div
          data-pop
          className="js-anim mt-10 overflow-hidden rounded-[28px] border-2 border-b-ink shadow-[10px_10px_0_0_var(--color-b-ink)] md:mt-14 md:rotate-[-1.2deg]"
        >
          <img
            src="/art/b-01.svg"
            alt=""
            width={1200}
            height={900}
            className="h-[34vh] w-full object-cover md:h-[52vh]"
          />
        </div>
      </section>

      {/* MARQUEE */}
      <VelocityMarquee className="border-y-2 border-b-ink bg-b-ink py-3 text-b-bg" baseSpeed={18}>
        <span className="flex shrink-0 items-center text-[clamp(1.4rem,3.2vw,2.8rem)] font-extrabold uppercase">
          {["Websites", "Web apps", "Mobile apps", "Freelance", "Malmö × Luleå"].map((word) => (
            <span key={word} className="flex items-center">
              <span className="px-5">{word}</span>
              <span className="text-b-orange">✷</span>
            </span>
          ))}
        </span>
      </VelocityMarquee>

      {/* WORK — the deck */}
      <section data-shot="deck" className="px-4 pt-16 md:px-6 md:pt-28">
        <div data-reveal className="js-anim mb-10 flex items-end justify-between md:mb-16">
          <h2 className="text-[clamp(2.4rem,8vw,7rem)] leading-[0.85] font-extrabold tracking-[-0.04em] uppercase">
            Selected
            <br />
            work
          </h2>
          <span className="pb-3 font-mono text-[11px] font-bold tracking-[0.14em] uppercase">
            (04) scroll ↓
          </span>
        </div>

        <div className="relative">
          {projects.map((project, i) => {
            const skin = SKINS[i % SKINS.length];
            return (
              <div
                key={project.name}
                className="sticky pb-6 md:pb-8"
                style={{ top: `calc(5rem + ${i * 1.5}rem)` }}
              >
                <a
                  data-card
                  href={project.href}
                  className={`group block overflow-hidden rounded-[28px] border-2 border-b-ink will-change-transform ${skin.bg} ${skin.text} shadow-[0_10px_0_0_var(--color-b-ink)] transition-transform duration-500 hover:-translate-y-1.5`}
                >
                  <div className="grid md:grid-cols-2">
                    <div className="flex flex-col justify-between gap-5 p-5 md:gap-6 md:p-9">
                      <div className="flex items-start justify-between">
                        <span className="font-mono text-[11px] font-bold tracking-[0.14em] uppercase">
                          {project.index} / {project.year}
                        </span>
                        <span className="grid size-10 place-items-center rounded-full border-2 border-current transition-transform duration-500 group-hover:rotate-45">
                          ↗
                        </span>
                      </div>

                      <div>
                        <h3 className="text-[clamp(2rem,5.2vw,3.8rem)] leading-[0.9] font-extrabold tracking-[-0.03em] uppercase">
                          <RollingText text={project.name} />
                        </h3>
                        <p className="mt-3 max-w-md text-[15px] leading-snug font-medium md:mt-4 md:text-[17px]">
                          {project.summary}
                        </p>
                        {/* Detail is desktop-only: on a phone the card has to
                            stay shorter than the viewport or the stack clips it. */}
                        <p className="mt-3 hidden max-w-md text-[13px] leading-snug opacity-75 md:block">
                          {project.detail}
                        </p>
                      </div>

                      <ul className="flex flex-wrap gap-2 font-mono text-[10px] font-bold tracking-[0.1em] uppercase">
                        {project.stack.map((tech) => (
                          <li key={tech} className={`rounded-full border px-2.5 py-1 ${skin.chip}`}>
                            {tech}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="relative overflow-hidden border-t-2 border-b-ink md:border-l-2 md:border-t-0">
                      <img
                        src={skin.art}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        width={1200}
                        height={900}
                        className="h-40 w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105 md:h-full"
                      />
                    </div>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      </section>

      <div className="h-24 md:h-40" />
    </div>
  );
}

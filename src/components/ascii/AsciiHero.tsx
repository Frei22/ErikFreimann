"use client";

import { useRef, useState } from "react";
import { site, statement } from "@/config/site";
import { loadAsciiGrid } from "@/lib/ascii/grid";
import { AsciiRenderer } from "@/lib/ascii/renderer";
import { setHeroProgress } from "@/lib/heroProgress";
import {
  ScrollTrigger,
  gsap,
  prefersReducedMotion,
  registerGsap,
  showFinalState,
  useIsomorphicLayoutEffect,
} from "@/lib/motion";

/* ─────────────────────────────────────────────────────────────────────────
   The flight, in progress space. The renderer owns the zoom and the
   whiteout; these are the beats laid over it.

     0.000 → 0.075   the title clears the frame
     0.000 → 0.700   the dolly in, exponential, toward the sun
     0.700 → 0.840   whiteout — the picture burns out to flat paper
     0.845 → 0.920   the line arrives out of that light
     0.920 → 1.000   it holds, then the section releases and it scrolls off
   ───────────────────────────────────────────────────────────────────── */

const TITLE_OUT = 0.075;
const LINE_IN_START = 0.845;
const LINE_IN_END = 0.92;

/**
 * How much page the flight is worth. The eased zoom crawls through the wide
 * shot on purpose, so the runway is shorter than it was — otherwise the first
 * screens read as nothing happening.
 */
const FLIGHT_HEIGHT = "440svh";

/** Follow lag on top of Lenis — the original page's `smoothing`. */
const FOLLOW = 0.12;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export function AsciiHero() {
  const shell = useRef<HTMLElement>(null);
  const stick = useRef<HTMLDivElement>(null);
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const title = useRef<HTMLDivElement>(null);
  const scrim = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLDivElement>(null);
  const [plateFailed, setPlateFailed] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const canvas = canvasEl.current;
    const shellEl = shell.current;
    const stickEl = stick.current;
    if (!canvas || !shellEl || !stickEl) return;

    let renderer: AsciiRenderer | null = null;
    let trigger: ScrollTrigger | null = null;
    let ticker: ((time: number) => void) | null = null;
    let disposed = false;

    const reduced = prefersReducedMotion();
    registerGsap();

    // The title does not wait for the plate. It animates on arrival, and if
    // the plate never comes it is still a finished piece of type on paper.
    const intro = gsap.context(() => {
      document.documentElement.classList.add("motion-ready");
      if (reduced) {
        showFinalState(shellEl);
        return;
      }
      gsap
        .timeline({ delay: 0.12 })
        .from("[data-mask] > *", { yPercent: 108, duration: 1.15, ease: "power4.out" })
        .from(
          "[data-fade]",
          { y: 16, autoAlpha: 0, duration: 0.8, ease: "power3.out", stagger: 0.08 },
          "-=0.85",
        );
    }, shellEl);

    let target = 0;
    let shown = 0;

    /** Everything that is not the canvas, driven off the same progress. */
    const paint = (p: number) => {
      setHeroProgress(p);

      const out = clamp01(p / TITLE_OUT);
      if (title.current) {
        title.current.style.opacity = String(1 - out);
        title.current.style.transform = `translate3d(0, ${-out * 44}px, 0)`;
      }
      if (scrim.current) scrim.current.style.opacity = String(1 - out);

      const arrive = clamp01((p - LINE_IN_START) / (LINE_IN_END - LINE_IN_START));
      if (line.current) {
        line.current.style.opacity = String(arrive);
        line.current.style.transform = `translate3d(0, ${(1 - arrive) * 34}px, 0)`;
        // Nothing under the whiteout should be clickable until it is there.
        line.current.style.pointerEvents = arrive > 0.5 ? "auto" : "none";
      }
    };

    loadAsciiGrid()
      .then((grid) => {
        if (disposed) return;

        renderer = new AsciiRenderer(canvas, grid, { ink: "#1a1e26", paper: "#faf8f3" });
        renderer.resize();

        if (reduced) {
          // No flight — the plate is simply a picture.
          renderer.draw(0);
          paint(0);
          return;
        }

        trigger = ScrollTrigger.create({
          trigger: shellEl,
          start: "top top",
          end: () => `+=${shellEl.offsetHeight - stickEl.offsetHeight}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            target = self.progress;
          },
        });
        target = trigger.progress;
        shown = target;

        // One ticker for the plate, shared with Lenis and ScrollTrigger, so
        // the frame does a single layout pass. Idle frames cost nothing —
        // once the follow has caught up there is nothing to redraw.
        ticker = () => {
          const delta = target - shown;
          if (Math.abs(delta) <= 0.00015) {
            if (shown === target) return;
            shown = target;
          } else {
            shown += delta * FOLLOW;
          }
          renderer?.draw(shown);
          paint(shown);
        };
        gsap.ticker.add(ticker);

        renderer.draw(shown);
        paint(shown);
      })
      .catch(() => {
        if (!disposed) setPlateFailed(true);
      });

    const onResize = () => {
      renderer?.resize();
      renderer?.draw(shown);
    };
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      window.removeEventListener("resize", onResize);
      if (ticker) gsap.ticker.remove(ticker);
      trigger?.kill();
      intro.revert();
    };
  }, []);

  return (
    <section
      ref={shell}
      id="top"
      className={`hero-shell relative ${plateFailed ? "hero-flat" : ""}`}
      style={{ height: FLIGHT_HEIGHT }}
      aria-label="Introduction"
    >
      <div ref={stick} className="hero-stick sticky top-0 h-[100svh] overflow-hidden bg-paper">
        <canvas
          ref={canvasEl}
          aria-hidden
          className="hero-canvas absolute inset-0 block h-full w-full"
        />

        {/* Paper hazed back over the top and bottom edges so the nav and the
            title have something to sit on. Kept deliberately weak and short —
            the plate is the point, and this only has to carry 11px of mono.
            It leaves with the title: once the flight starts, nothing to
            protect and nothing over the picture. */}
        <div ref={scrim} aria-hidden className="hero-scrim pointer-events-none absolute inset-0">
          <span className="absolute inset-x-0 top-0 block h-24 bg-gradient-to-b from-paper/90 to-transparent" />
          {/* A phone rests the title on paper below the band, so it barely
              needs this; a covered landscape screen puts it over stipple. */}
          <span className="absolute inset-x-0 bottom-0 block h-[20%] bg-gradient-to-t from-paper via-paper/55 to-transparent md:h-[44%] md:via-paper/75" />
        </div>

        {/* Title. Sits low-left over the sky, clears the frame the moment
            the flight starts so nothing competes with the plate. */}
        <div
          ref={title}
          className="hero-copy absolute inset-x-0 bottom-0 px-5 pb-[8svh] will-change-[transform,opacity] md:px-10"
        >
          <p
            data-fade
            className="js-anim font-mono text-[11px] tracking-[0.2em] text-muted uppercase"
          >
            {plateFailed ? "Vallée Blanche" : "Vallée Blanche — 3842 m"}
          </p>

          <h1 className="mt-4 font-fraunces text-[clamp(2.6rem,9vw,7.5rem)] leading-[0.94] font-normal tracking-[-0.035em]">
            <span className="mask-line js-anim" data-mask>
              <span>{site.name}</span>
            </span>
          </h1>

          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <p
              data-fade="0.1"
              className="js-anim max-w-sm font-inter text-[15px] leading-relaxed text-muted"
            >
              {site.role} — {site.location}.
            </p>

            <p
              data-fade="0.2"
              className="js-anim flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] text-muted uppercase"
            >
              <span className="hero-cue block h-8 w-px bg-green" aria-hidden />
              Scroll into the sun
            </p>
          </div>
        </div>

        {/* The line the light hands you. Present in the DOM from the start so
            it is in the page for a reader that never runs the flight. */}
        <div
          ref={line}
          className="hero-statement absolute inset-0 flex items-center px-5 opacity-0 will-change-[transform,opacity] md:px-10"
        >
          <div className="mx-auto max-w-4xl">
            <p className="font-mono text-[11px] tracking-[0.2em] text-green uppercase">
              {statement.label}
            </p>
            <p className="mt-7 font-fraunces text-[clamp(1.7rem,4.6vw,3.6rem)] leading-[1.08] font-normal tracking-[-0.025em] text-balance">
              {statement.lead}{" "}
              <span className="text-green italic">{statement.emphasis}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { Mask, useReveal } from "@/components/site/Reveal";
import { featuredCase } from "@/config/site";
import { SectionHead } from "./SectionHead";

/**
 * One project, told properly. The identity column stays put while the three
 * beats scroll past it — sticky, not pinned: the page keeps moving under your
 * finger the whole way, which is the difference between a section that reads
 * and a section that holds you hostage.
 */
export function Case() {
  const scope = useRef<HTMLElement>(null);
  useReveal(scope);

  return (
    <section ref={scope} id="case" className="px-5 md:px-10">
      <SectionHead
        index="02"
        label="Case study"
        note={`${featuredCase.year} · ${featuredCase.role}`}
      />

      <div className="mt-10 grid gap-x-10 md:mt-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="sticky-col sticky top-28 pb-10">
            <h2 className="font-fraunces text-[clamp(2.2rem,5.5vw,3.8rem)] leading-none font-normal tracking-[-0.03em]">
              <Mask>{featuredCase.name}</Mask>
            </h2>

            <ul
              data-fade="0.1"
              className="js-anim mt-7 flex flex-wrap gap-x-2 gap-y-2 font-mono text-[10px] tracking-[0.14em] text-muted uppercase"
            >
              {featuredCase.stack.map((tech) => (
                <li key={tech} className="border border-line px-2 py-1">
                  {tech}
                </li>
              ))}
            </ul>

            {featuredCase.href ? (
              <p data-fade="0.15" className="js-anim mt-7 font-mono text-[11px] tracking-[0.16em] uppercase">
                <a href={featuredCase.href} target="_blank" rel="noreferrer">
                  <span className="wipe">View the repo ↗</span>
                </a>
              </p>
            ) : (
              <p
                data-fade="0.15"
                className="js-anim mt-7 font-mono text-[10px] tracking-[0.18em] text-muted uppercase"
              >
                Private repo — walkthrough on request
              </p>
            )}
          </div>
        </div>

        <ol className="md:col-span-7 md:col-start-6">
          {featuredCase.beats.map((beat, i) => (
            <li
              key={beat.label}
              className="border-t border-line pt-9 pb-14 first:border-t-0 first:pt-0 md:pb-24"
            >
              <p
                data-fade
                className="js-anim tnum flex items-baseline gap-3 font-mono text-[10px] tracking-[0.2em] uppercase"
              >
                <span className="text-green">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-muted">{beat.label}</span>
              </p>

              <h3 className="mt-5 font-fraunces text-[clamp(1.4rem,3.2vw,2.3rem)] leading-[1.14] font-normal tracking-[-0.02em]">
                <Mask>{beat.title}</Mask>
              </h3>

              <p
                data-fade="0.08"
                className="js-anim mt-5 max-w-prose font-inter text-[16px] leading-relaxed text-muted"
              >
                {beat.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

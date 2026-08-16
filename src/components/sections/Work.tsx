"use client";

import { useRef, useState } from "react";
import { AsciiPlate } from "@/components/ascii/AsciiPlate";
import { Mask, useReveal } from "@/components/site/Reveal";
import { projects } from "@/config/site";
import { SectionHead } from "./SectionHead";

/**
 * The index. Names on the left at display size, one detail panel on the right
 * that the pointer swaps between — four projects cost one panel of height
 * instead of four cards of it, and the eye stays on the type.
 *
 * The panel is a mirror, not the source: every row carries its own copy,
 * visible on a phone and screen-reader-only on a desktop, so the words exist
 * for a reader with no pointer. The panel itself is aria-hidden.
 *
 * All the panel's states are stacked in one grid cell so the column is as
 * tall as its tallest state and never resizes under the pointer.
 */
export function Work() {
  const scope = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  useReveal(scope);

  return (
    <section ref={scope} id="work" className="px-5 md:px-10">
      <SectionHead index="01" label="Selected work" note={`${projects.length} projects`} />

      <div className="mt-8 grid gap-x-10 md:mt-12 md:grid-cols-12">
        {/* ── the index ────────────────────────────────────────────── */}
        <ul className="md:col-span-7">
          {projects.map((project, i) => {
            const Row = project.href ? "a" : "div";
            const link = project.href
              ? ({ href: project.href, target: "_blank", rel: "noreferrer" } as const)
              : ({ tabIndex: 0 } as const);

            return (
              <li key={project.name}>
                <Row
                  {...link}
                  data-active={active === i}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="row block border-b border-line py-7 md:py-9"
                >
                  <div className="flex items-baseline gap-4 md:gap-6">
                    <span className="tnum font-mono text-[11px] tracking-[0.14em] text-muted">
                      {project.index}
                    </span>

                    <h3 className="font-fraunces text-[clamp(1.7rem,4.6vw,3.1rem)] leading-none font-normal tracking-[-0.03em]">
                      <Mask>{project.name}</Mask>
                    </h3>

                    <span
                      aria-hidden
                      className="row-mark ml-auto self-center font-mono text-[13px] text-green"
                    >
                      {project.href ? "↗" : "—"}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1 pl-8 font-mono text-[10px] tracking-[0.18em] text-muted uppercase md:pl-10">
                    <span>{project.year}</span>
                    <span className="text-line">·</span>
                    <span>{project.role}</span>
                    {!project.href ? (
                      <>
                        <span className="text-line">·</span>
                        <span>Private repo</span>
                      </>
                    ) : null}
                  </div>

                  <div className="mt-4 max-w-prose space-y-3 pl-8 font-inter text-[15px] leading-relaxed text-muted md:sr-only">
                    <p>{project.summary}</p>
                    <p>{project.detail}</p>
                  </div>
                </Row>
              </li>
            );
          })}
        </ul>

        {/* ── the mirror ───────────────────────────────────────────── */}
        <div aria-hidden className="hidden md:col-span-4 md:col-start-9 md:block">
          <div className="sticky-col sticky top-28">
            <div className="relative aspect-[2/1] w-full overflow-hidden border border-line bg-faint">
              {projects.map((project, i) => (
                <div
                  key={project.name}
                  className="absolute inset-0 transition-opacity duration-500 ease-out"
                  style={{ opacity: active === i ? 1 : 0 }}
                >
                  <AsciiPlate crop={project.crop} />
                </div>
              ))}
            </div>

            <p className="tnum mt-3 font-mono text-[9.5px] tracking-[0.2em] text-muted uppercase">
              Plate · col {String(projects[active].crop.col).padStart(4, "0")} · row{" "}
              {String(projects[active].crop.row).padStart(3, "0")}
            </p>

            <div className="mt-8 grid">
              {projects.map((project, i) => (
                <div
                  key={project.name}
                  style={{ opacity: active === i ? 1 : 0 }}
                  className="col-start-1 row-start-1 transition-opacity duration-500 ease-out"
                >
                  <p className="font-inter text-[15px] leading-relaxed">{project.summary}</p>
                  <p className="mt-4 font-inter text-[15px] leading-relaxed text-muted">
                    {project.detail}
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-x-2 gap-y-2 font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
                    {project.stack.map((tech) => (
                      <li key={tech} className="border border-line px-2 py-1">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { AsciiPlate } from "@/components/ascii/AsciiPlate";
import { Mask, useReveal } from "@/components/site/Reveal";
import { useCopy } from "@/components/CopyProvider";
import type { ProjectCopy } from "@/config/copy";
import { projects } from "@/config/site";
import { SectionHead } from "./SectionHead";

/**
 * Two projects, each told properly rather than listed.
 *
 * The identity column stays put while the beats scroll past it — sticky, not
 * pinned: the page keeps moving under your finger the whole way, which is the
 * difference between a section that reads and one that holds you hostage.
 */
type ProjectMeta = (typeof projects)[number];

function Entry({
  project,
  text,
  viewRepo,
  privateRepo,
}: {
  project: ProjectMeta;
  text: ProjectCopy;
  viewRepo: string;
  privateRepo: string;
}) {
  return (
    <article className="border-t border-line pt-10 md:pt-14">
      <div className="grid gap-x-10 gap-y-8 md:grid-cols-12">
        {/* ── identity ─────────────────────────────────────────── */}
        <div className="md:col-span-4">
          <div className="sticky-col sticky top-28 pb-10">
            <p
              data-fade
              className="js-anim tnum flex items-baseline gap-3 font-mono text-[10px] tracking-[0.2em] uppercase"
            >
              <span className="text-blue">{project.index}</span>
              <span className="text-line">/</span>
              <span className="text-muted">
                {project.year} · {text.role}
              </span>
            </p>

            <h3 className="mt-4 font-fraunces text-[clamp(2.1rem,5.4vw,3.6rem)] leading-none font-normal tracking-[-0.03em]">
              <Mask>{project.name}</Mask>
            </h3>

            <div
              data-fade="0.08"
              className="js-anim mt-7 aspect-[2/1] w-full overflow-hidden border border-line bg-faint"
            >
              <AsciiPlate crop={project.crop} />
            </div>

            <ul
              data-fade="0.12"
              className="js-anim mt-6 flex flex-wrap gap-x-2 gap-y-2 font-mono text-[10px] tracking-[0.14em] text-muted uppercase"
            >
              {project.stack.map((tech) => (
                <li key={tech} className="border border-line px-2 py-1">
                  {tech}
                </li>
              ))}
            </ul>

            {project.href ? (
              <p
                data-fade="0.16"
                className="js-anim mt-6 font-mono text-[11px] tracking-[0.16em] uppercase"
              >
                <a href={project.href} target="_blank" rel="noreferrer">
                  <span className="wipe">{viewRepo}</span>
                </a>
              </p>
            ) : (
              <p
                data-fade="0.16"
                className="js-anim mt-6 font-mono text-[10px] tracking-[0.18em] text-muted uppercase"
              >
                {privateRepo}
              </p>
            )}
          </div>
        </div>

        {/* ── the telling ──────────────────────────────────────── */}
        <div className="md:col-span-7 md:col-start-6">
          <p
            data-fade
            className="js-anim max-w-prose font-fraunces text-[clamp(1.25rem,2.6vw,1.75rem)] leading-[1.35] font-normal"
          >
            {text.summary}
          </p>

          <ol className="mt-12">
            {text.beats.map((beat, i) => (
              <li
                key={beat.title}
                className="border-t border-line pt-7 pb-10 first:border-t-0 first:pt-0 md:pb-14"
              >
                <p
                  data-fade
                  className="js-anim tnum font-mono text-[10px] tracking-[0.2em] text-blue uppercase"
                >
                  {String(i + 1).padStart(2, "0")}
                </p>

                <h4 className="mt-4 font-fraunces text-[clamp(1.2rem,2.8vw,1.9rem)] leading-[1.16] font-normal tracking-[-0.02em]">
                  <Mask>{beat.title}</Mask>
                </h4>

                <p
                  data-fade="0.08"
                  className="js-anim mt-4 max-w-prose font-inter text-[16px] leading-relaxed text-muted"
                >
                  {beat.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </article>
  );
}

export function Work() {
  const scope = useRef<HTMLElement>(null);
  const { work } = useCopy();
  useReveal(scope);

  return (
    <section ref={scope} id="work" className="px-5 md:px-10">
      <SectionHead index="01" label={work.label} note={`${projects.length} ${work.countNoun}`} />

      <p
        data-fade
        className="js-anim mt-10 max-w-2xl font-inter text-[17px] leading-relaxed text-muted md:mt-14"
      >
        {work.lead}
      </p>

      <div className="mt-16 space-y-16 md:mt-24 md:space-y-24">
        {projects.map((project) => (
          <Entry
            key={project.id}
            project={project}
            text={work.projects[project.id]}
            viewRepo={work.viewRepo}
            privateRepo={work.privateRepo}
          />
        ))}
      </div>
    </section>
  );
}

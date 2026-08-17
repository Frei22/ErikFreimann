"use client";

import { useRef } from "react";
import { Mask, useReveal } from "@/components/site/Reveal";
import { useCopy } from "@/components/CopyProvider";
import { site } from "@/config/site";
import { SectionHead } from "./SectionHead";

/**
 * Prose on the left, the stack as a plain list on the right. No marquee —
 * a list of thirteen technologies is information, and sliding it past the
 * reader at a constant speed makes it harder to read, not easier.
 */
export function About() {
  const scope = useRef<HTMLElement>(null);
  const { about } = useCopy();
  useReveal(scope);

  return (
    <section ref={scope} id="about" className="px-5 md:px-10">
      <SectionHead index="02" label={about.label} note={about.location} />

      <div className="mt-10 grid gap-x-10 gap-y-14 md:mt-16 md:grid-cols-12">
        <div className="md:col-span-7">
          <h2 className="font-fraunces text-[clamp(1.8rem,4.4vw,3.1rem)] leading-[1.08] font-normal tracking-[-0.03em]">
            <Mask>{about.headline.lead}</Mask>
            <Mask>
              <span className="text-blue italic">{about.headline.emphasis}</span>
            </Mask>
          </h2>

          <div className="mt-9 max-w-prose space-y-5 font-inter text-[16px] leading-relaxed text-muted">
            {about.paragraphs.map((paragraph, i) => (
              <p data-fade={i * 0.06} className="js-anim" key={paragraph.slice(0, 24)}>
                {paragraph}
              </p>
            ))}
          </div>

          <dl
            data-fade="0.2"
            className="js-anim mt-11 grid max-w-lg grid-cols-[7rem_1fr] gap-y-3 border-t border-line pt-7 font-mono text-[11px] tracking-[0.12em]"
          >
            <dt className="text-muted uppercase">{about.facts.degree}</dt>
            <dd>{about.education}</dd>
            <dt className="text-muted uppercase">{about.facts.based}</dt>
            <dd>{about.location}</dd>
            <dt className="text-muted uppercase">{about.facts.status}</dt>
            <dd className="text-blue">{about.facts.statusValue}</dd>
          </dl>
        </div>

        <div className="md:col-span-4 md:col-start-9">
          <p
            data-fade
            className="js-anim font-mono text-[10px] tracking-[0.2em] text-muted uppercase"
          >
            {about.stackLabel}
          </p>

          <ul
            data-fade="0.08"
            className="js-anim mt-6 grid grid-cols-2 gap-x-6 font-mono text-[12px] tracking-[0.04em]"
          >
            {site.stack.map((tech) => (
              <li key={tech} className="border-b border-line py-2.5">
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

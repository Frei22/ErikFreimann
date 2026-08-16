"use client";

import { useRef } from "react";
import { useReveal } from "@/components/site/Reveal";
import { site } from "@/config/site";
import type { Repo } from "@/lib/github";
import { SectionHead } from "./SectionHead";

/**
 * The live feed, as a directory listing rather than a card grid — mono,
 * columnar, one rule per row. It is the most literal part of the page and it
 * should look it.
 *
 * Only public repos come back, so this is deliberately short. It fills itself
 * in: anything made public later shows up on the next build without a code
 * change.
 */
export function Repos({ repos }: { repos: Repo[] }) {
  const scope = useRef<HTMLElement>(null);
  useReveal(scope);

  return (
    <section ref={scope} id="repos" className="px-5 md:px-10">
      <SectionHead
        index="03"
        label="Repositories"
        note={repos.length ? `${repos.length} public · live from GitHub` : "Live from GitHub"}
      />

      {repos.length === 0 ? (
        <p data-fade className="js-anim py-12 font-inter text-[16px] text-muted">
          The repository list could not be loaded right now —{" "}
          <a href={`https://github.com/${site.githubUsername}`} target="_blank" rel="noreferrer">
            <span className="wipe text-ink">browse everything on GitHub ↗</span>
          </a>
        </p>
      ) : (
        <ul className="mt-10 md:mt-14">
          {repos.map((repo) => (
            <li key={repo.name}>
              <a
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                className="row grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-2 border-b border-line py-6 transition-colors hover:bg-faint md:grid-cols-[minmax(0,15rem)_1fr_auto] md:py-7"
              >
                <span className="flex items-baseline gap-3 font-mono text-[14px] tracking-[0.02em]">
                  <span aria-hidden className="row-mark text-green">
                    ↗
                  </span>
                  {repo.name}
                </span>

                <span className="col-span-2 font-inter text-[14px] leading-relaxed text-muted md:col-span-1 md:pr-8">
                  {repo.description || "—"}
                </span>

                <span className="tnum col-start-2 row-start-1 flex items-baseline gap-4 justify-self-end font-mono text-[10px] tracking-[0.16em] text-muted uppercase md:col-start-3">
                  {repo.language ? (
                    <span className="flex items-center gap-2">
                      <span aria-hidden className="size-1.5 rounded-full bg-green" />
                      {repo.language}
                    </span>
                  ) : null}
                  {repo.stars > 0 ? <span>{repo.stars}★</span> : null}
                  <span className="hidden sm:inline">{repo.pushed}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

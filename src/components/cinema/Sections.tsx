"use client";

import { useEffect, useRef, useState } from "react";
import { about, sampleRepos, site } from "@/config/site";
import { RollingText } from "@/components/RollingText";
import { VelocityMarquee } from "@/components/VelocityMarquee";
import { Magnetic } from "@/components/Magnetic";
import type { CinemaTheme } from "./theme";
import {
  gsap,
  prefersReducedMotion,
  registerGsap,
  useIsomorphicLayoutEffect,
} from "@/lib/motion";

/** Fade + rise as sections enter. Shared by the static sections below. */
function useReveal(scope: React.RefObject<HTMLElement | null>) {
  useIsomorphicLayoutEffect(() => {
    const el = scope.current;
    if (!el || prefersReducedMotion()) return;
    registerGsap();

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((node) => {
        gsap.from(node, {
          y: 30,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: node, start: "top 88%", once: true },
        });
      });
    }, el);

    return () => ctx.revert();
  }, [scope]);
}

/** About — first person, with a parallaxed still and the stack marquee. */
export function AboutSection({ theme }: { theme: CinemaTheme }) {
  const scope = useRef<HTMLElement>(null);
  useReveal(scope);

  useIsomorphicLayoutEffect(() => {
    const el = scope.current;
    if (!el || prefersReducedMotion()) return;
    registerGsap();

    const ctx = gsap.context(() => {
      gsap.to("[data-parallax]", {
        yPercent: -12,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={scope} id="about" data-shot="about" className="relative pt-20 pb-0 md:pt-28">
      <div className="grid gap-12 px-5 md:grid-cols-12 md:gap-14 md:px-10">
        <div data-reveal className="js-anim md:col-span-4">
          <p className="font-mono text-[11px] tracking-[0.16em] text-[var(--muted)] uppercase">
            About
          </p>
          <div className="mt-8 overflow-hidden rounded-sm">
            <img
              data-parallax
              src={`/art/${theme.artPrefix}-04.svg`}
              alt=""
              loading="lazy"
              decoding="async"
              width={1200}
              height={900}
              className="aspect-[4/5] w-full scale-110 object-cover will-change-transform"
            />
          </div>
        </div>

        <div className="md:col-span-7 md:col-start-6">
          <h2
            data-reveal
            className="js-anim text-[clamp(1.9rem,4.2vw,3.4rem)] leading-[1.1] font-normal"
          >
            I build the whole thing —{" "}
            <span className="italic text-[var(--accent)]">data model to hover state</span>.
          </h2>

          <div className="mt-8 space-y-5 font-inter text-[16px] leading-relaxed text-[var(--muted)]">
            {about.map((paragraph) => (
              <p data-reveal className="js-anim" key={paragraph.slice(0, 24)}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>

      <VelocityMarquee
        className="mt-16 border-y border-[var(--line)] py-4 md:mt-20"
        baseSpeed={26}
        skew={false}
      >
        <span className="flex shrink-0 items-center font-mono text-[12px] tracking-[0.18em] text-[var(--muted)] uppercase">
          {site.stack.map((tech) => (
            <span key={tech} className="flex items-center">
              <span className="px-6">{tech}</span>
              <span className="text-[var(--accent)]">◆</span>
            </span>
          ))}
        </span>
      </VelocityMarquee>
    </section>
  );
}

/** All projects — stands in for the live GitHub feed. */
export function ProjectsGrid() {
  const scope = useRef<HTMLElement>(null);
  useReveal(scope);

  return (
    <section ref={scope} data-shot="repos" className="px-5 py-16 md:px-10 md:py-24">
      <div
        data-reveal
        className="js-anim flex items-end justify-between border-b border-[var(--line)] pb-5"
      >
        <h2 className="text-[clamp(1.8rem,4vw,3rem)] leading-none font-normal">
          All projects
        </h2>
        <span className="font-mono text-[11px] tracking-[0.16em] text-[var(--muted)] uppercase">
          Live from GitHub
        </span>
      </div>

      <ul className="grid gap-px border-[var(--line)] md:grid-cols-3">
        {sampleRepos.map((repo) => (
          // Borders and padding live on the li so nth-child counts the cells.
          <li
            key={repo.name}
            className="border-b border-[var(--line)] md:border-r md:px-6 md:[&:nth-child(3n)]:border-r-0 md:[&:nth-child(3n+1)]:pl-0"
          >
            <a
              data-reveal
              href={`https://github.com/${site.githubUsername}/${repo.name}`}
              className="js-anim group flex h-full flex-col justify-between gap-8 py-7"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-mono text-[13px] tracking-[0.06em]">
                    <RollingText text={repo.name} />
                  </h3>
                  <span className="text-[var(--muted)] transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1">
                    ↗
                  </span>
                </div>
                <p className="mt-3 max-w-xs font-inter text-[14px] leading-relaxed text-[var(--muted)]">
                  {repo.description}
                </p>
              </div>

              <div className="flex items-center gap-4 font-mono text-[10px] tracking-[0.14em] text-[var(--muted)] uppercase">
                <span className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[var(--accent)]" aria-hidden />
                  {repo.language}
                </span>
                <span>★ {repo.stars}</span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Contact + footer. The email is the largest thing on the page, by design. */
export function ContactFooter() {
  const scope = useRef<HTMLElement>(null);
  const [time, setTime] = useState("");
  useReveal(scope);

  useEffect(() => {
    // Rendered after mount so the server and client markup can't disagree.
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Europe/Stockholm",
        }).format(new Date()),
      );
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer ref={scope} id="contact" data-shot="contact" className="border-t border-[var(--line)] px-5 py-16 md:px-10 md:py-24">
      <div data-reveal className="js-anim flex flex-wrap items-baseline justify-between gap-4">
        <p className="font-mono text-[11px] tracking-[0.16em] text-[var(--muted)] uppercase">
          Available for freelance work
        </p>
        <p className="font-mono text-[11px] tracking-[0.16em] text-[var(--muted)] uppercase">
          {site.location} — {time ? `${time} local` : " "}
        </p>
      </div>

      {/* Both layers are one nowrap line of identical metrics, so the roll
          lands exactly — the address is long, so the size is clamped to fit. */}
      <a
        data-reveal
        href={`mailto:${site.email}`}
        data-shot="email"
        className="js-anim group relative mt-8 block overflow-hidden"
      >
        <span className="block whitespace-nowrap text-[clamp(1.05rem,4.6vw,3.6rem)] leading-[1.25] font-normal tracking-[-0.02em] transition-transform duration-500 ease-out group-hover:-translate-y-full">
          {site.email}
        </span>
        <span
          aria-hidden
          className="absolute inset-0 translate-y-full whitespace-nowrap text-[clamp(1.05rem,4.6vw,3.6rem)] leading-[1.25] font-normal tracking-[-0.02em] text-[var(--accent)] italic transition-transform duration-500 ease-out group-hover:translate-y-0"
        >
          Let&apos;s talk →
        </span>
      </a>

      <div className="mt-14 flex flex-wrap items-end justify-between gap-8 border-t border-[var(--line)] pt-6">
        <ul className="flex flex-wrap gap-6 font-mono text-[11px] tracking-[0.16em] uppercase">
          {site.socials
            .filter((social) => social.href)
            .map((social) => (
              <li key={social.label}>
                <Magnetic strength={0.3}>
                  <a href={social.href} className="text-[var(--muted)] hover:text-[var(--ink)]">
                    <RollingText text={social.label} />
                  </a>
                </Magnetic>
              </li>
            ))}
        </ul>

        <div className="flex items-center gap-6 font-mono text-[11px] tracking-[0.16em] text-[var(--muted)] uppercase">
          <span>
            © {new Date().getFullYear()} {site.name}
          </span>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="hover:text-[var(--ink)]"
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { useRef } from "react";
import { site } from "@/config/site";
import type { Repo } from "@/lib/github";
import {
  ScrollTrigger,
  gsap,
  prefersReducedMotion,
  registerGsap,
  useIsomorphicLayoutEffect,
} from "@/lib/motion";
import { CustomCursor, Grain } from "@/components/Bits";
import { Magnetic } from "@/components/Magnetic";
import { RollingText } from "@/components/RollingText";
import { useLenis } from "@/lib/useLenis";
import { CinemaHero } from "./CinemaHero";
import { CameraScene, CaseStudy, WorkGallery } from "./Scenes";
import { AboutSection, ContactFooter, ProjectsGrid } from "./Sections";
import type { CinemaTheme } from "./theme";

/**
 * Full Cinema page. Every variant renders the same sections in the same order —
 * the theme decides the ground, the accent and the hero composition.
 */
export function CinemaPage({ theme, repos }: { theme: CinemaTheme; repos: Repo[] }) {
  const nav = useRef<HTMLElement>(null);
  useLenis();

  // Past the hero the bar takes a ground so text can't collide with it, and it
  // gets out of the way on the way down. The ground applies with reduced
  // motion too — only the hide/show is motion.
  useIsomorphicLayoutEffect(() => {
    const el = nav.current;
    if (!el) return;
    registerGsap();
    const reduced = prefersReducedMotion();

    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const past = self.scroll() > window.innerHeight * 0.6;
        el.classList.toggle("is-solid", past);
        if (reduced) return;
        gsap.to(el, {
          yPercent: past && self.direction === 1 ? -130 : 0,
          duration: 0.45,
          ease: "power3.out",
          overwrite: true,
        });
      },
    });

    return () => st.kill();
  }, []);

  return (
    <div
      style={theme.vars}
      className="hide-cursor relative min-h-screen overflow-x-clip bg-[var(--bg)] font-fraunces text-[var(--ink)] selection:bg-[var(--accent)] selection:text-[var(--bg)]"
    >
      <Grain opacity={theme.grain} />
      <CustomCursor color={theme.cursorColor} blend={false} label="View" />

      <header
        ref={nav}
        className="cinema-nav fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-5 font-mono text-[11px] tracking-[0.16em] uppercase will-change-transform md:px-10"
      >
        <a href="#" data-fade className="js-anim">
          {site.name}
        </a>
        <nav className="flex items-center gap-6">
          {[
            ["Work", "#work"],
            ["About", "#about"],
          ].map(([label, href]) => (
            <Magnetic key={label} strength={0.3}>
              <a
                data-fade
                href={href}
                className="js-anim hidden text-[var(--muted)] transition-colors hover:text-[var(--ink)] sm:block"
              >
                <RollingText text={label} />
              </a>
            </Magnetic>
          ))}
          <Magnetic strength={0.3}>
            <a data-fade href="#contact" className="js-anim">
              <RollingText text="Contact" />
            </a>
          </Magnetic>
        </nav>
      </header>

      <main>
        <CinemaHero theme={theme} />
        <CameraScene theme={theme} />
        <div id="work">
          <WorkGallery theme={theme} />
        </div>
        <CaseStudy theme={theme} />
        <ProjectsGrid repos={repos} />
        <AboutSection theme={theme} />
      </main>

      <ContactFooter />
    </div>
  );
}

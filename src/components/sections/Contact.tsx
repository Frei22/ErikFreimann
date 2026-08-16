"use client";

import { useEffect, useRef, useState } from "react";
import { Mask, useReveal } from "@/components/site/Reveal";
import { altitude, site } from "@/config/site";
import { SectionHead } from "./SectionHead";

/**
 * The bottom of the run. The altimeter has been counting down to this number
 * the whole way, so the section is allowed to just say it and stop.
 */
export function Contact() {
  const scope = useRef<HTMLElement>(null);
  const [time, setTime] = useState("");
  useReveal(scope);

  useEffect(() => {
    // Rendered after mount so server and client markup cannot disagree.
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

  const socials = site.socials.filter((social) => social.href);

  return (
    <footer ref={scope} id="contact" className="px-5 pb-16 md:px-10 md:pb-20">
      <SectionHead
        index="05"
        label="Chamonix"
        note={
          <span className="tnum">
            {altitude.bottom} m {time ? `· ${time} local` : ""}
          </span>
        }
      />

      <h2 className="mt-12 font-fraunces text-[clamp(2rem,6vw,4.4rem)] leading-[1.02] font-normal tracking-[-0.035em] md:mt-20">
        <Mask>Got something you want built?</Mask>
      </h2>

      <p data-fade className="js-anim mt-8">
        <a
          href={`mailto:${site.email}`}
          className="inline-block font-fraunces text-[clamp(1.05rem,3.6vw,2.4rem)] leading-tight tracking-[-0.02em] break-all"
        >
          <span className="wipe">{site.email}</span>
        </a>
      </p>

      <p
        data-fade="0.08"
        className="js-anim mt-6 max-w-prose font-inter text-[16px] leading-relaxed text-muted"
      >
        Freelance web work — sites, web apps, and the occasional rescue of something
        half-finished. Reply time is usually the same day.
      </p>

      <div className="mt-20 flex flex-wrap items-end justify-between gap-8 border-t border-line pt-6 font-mono text-[10px] tracking-[0.18em] uppercase md:mt-28">
        <ul className="flex flex-wrap gap-6">
          {socials.map((social) => (
            <li key={social.label}>
              <a href={social.href} target="_blank" rel="noreferrer" className="text-muted hover:text-ink">
                <span className="wipe">{social.label}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center gap-6 text-muted">
          <span className="tnum">
            © {new Date().getFullYear()} {site.name}
          </span>
          <a href="#top" className="hover:text-ink">
            <span className="wipe">Back to {altitude.top} m ↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

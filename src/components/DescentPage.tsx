"use client";

import { AsciiHero } from "@/components/ascii/AsciiHero";
import { About } from "@/components/sections/About";
import { Case } from "@/components/sections/Case";
import { Contact } from "@/components/sections/Contact";
import { Repos } from "@/components/sections/Repos";
import { Work } from "@/components/sections/Work";
import { FlightRing } from "@/components/site/FlightRing";
import { Nav } from "@/components/site/Nav";
import type { Repo } from "@/lib/github";
import { useLenis } from "@/lib/useLenis";

/**
 * The hero owns the motion. Everything below it is type on paper that arrives
 * and then holds still — including the chrome: the flight ring is the only
 * persistent instrument, and it leaves with the flight.
 */
export function DescentPage({ repos }: { repos: Repo[] }) {
  useLenis();

  return (
    <>
      <Nav />
      <FlightRing />

      <main>
        <AsciiHero />
        <Work />
        <Case />
        <Repos repos={repos} />
        <About />
        <Contact />
      </main>
    </>
  );
}
